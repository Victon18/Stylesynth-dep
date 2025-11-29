import os
import shutil
import subprocess
from flask import Flask, request, jsonify
import base64
from PIL import Image
from werkzeug.utils import secure_filename
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", "..", "backend"))
UPLOAD_DIR = os.path.join(CURRENT_DIR, "uploads")
CHECKPOINT_DIR = os.path.join(BACKEND_DIR, "checkpoints", "fashion_pix2pix")

os.makedirs(UPLOAD_DIR, exist_ok=True)

def debug_print(*args):
    print("[INDEX DEBUG]", *args, flush=True)

@app.route("/generate", methods=["POST"])
def generate():
    debug_print("Endpoint hit")
    debug_print("CURRENT_DIR:", CURRENT_DIR)
    debug_print("BACKEND_DIR:", BACKEND_DIR)
    debug_print("UPLOAD_DIR:", UPLOAD_DIR)
    debug_print("CHECKPOINT_DIR:", CHECKPOINT_DIR)

    if "image" not in request.files:
        return jsonify({"error": "image field missing"}), 400

    for f in os.listdir(UPLOAD_DIR):
        p = os.path.join(UPLOAD_DIR, f)
        try:
            if os.path.isfile(p) or os.path.islink(p):
                os.remove(p)
            else:
                shutil.rmtree(p)
        except Exception as e:
            debug_print("Warning cleaning old upload entry:", p, "->", e)

    test_folder = os.path.join(UPLOAD_DIR, "test")
    try:
        os.makedirs(test_folder, exist_ok=True)
    except Exception as e:
        debug_print("Failed creating test folder:", test_folder, e)
        return jsonify({"error": "failed to create test folder", "detail": str(e)}), 500

    if not os.path.isdir(test_folder):
        debug_print("TEST FOLDER MISSING after os.makedirs:", test_folder)
        return jsonify({"error": "test folder not present before save", "test_folder": test_folder}), 500

    upload_file = request.files["image"]
    orig_name = secure_filename(upload_file.filename or "upload.png")
    debug_print("Original uploaded filename:", orig_name)

    try:
        img = Image.open(upload_file.stream if hasattr(upload_file, "stream") else upload_file)
        img = img.convert("RGB")
        target_size = (256, 256)
        img = img.resize(target_size, Image.LANCZOS)

        concat_w, concat_h = target_size[0] * 2, target_size[1]
        concat = Image.new("RGB", (concat_w, concat_h))
        concat.paste(img, (0, 0))
        concat.paste(img, (target_size[0], 0))

        save_path = os.path.join(test_folder, "test.png")
        concat.save(save_path, format="PNG")
    except Exception as e:
        debug_print("Error processing uploaded image:", str(e))
        return jsonify({"error": "failed to process uploaded image", "detail": str(e)}), 500

    if not os.path.isfile(save_path):
        debug_print("Saved file missing:", save_path)
        debug_print("Uploads listing:", os.listdir(UPLOAD_DIR))
        debug_print("Test listing:", os.listdir(test_folder) if os.path.isdir(test_folder) else [])
        return jsonify({"error": "saved file missing", "save_path": save_path}), 500

    debug_print("Saved concatenated AB test image at:", save_path)

    cmd = [
        "python3",
        os.path.join(BACKEND_DIR, "test.py"),
        "--dataroot", UPLOAD_DIR,
        "--name", "fashion_pix2pix",
        "--model", "pix2pix",
        "--direction", "AtoB",  # ASSUMED: sketch -> garment
        "--checkpoints_dir", os.path.join(BACKEND_DIR, "checkpoints")
    ]

    debug_print("Running command (cwd -> BACKEND_DIR):", " ".join(cmd))

    try:
        proc = subprocess.run(cmd, cwd=BACKEND_DIR, capture_output=True, text=True, check=False)
    except Exception as e:
        debug_print("Subprocess launch failed:", str(e))
        return jsonify({"error": "failed to start test.py", "detail": str(e)}), 500

    debug_print("test.py returncode:", proc.returncode)
    if proc.stdout:
        debug_print("test.py stdout (tail):", proc.stdout.strip().splitlines()[-10:])
    if proc.stderr:
        debug_print("test.py stderr (tail):", proc.stderr.strip().splitlines()[-20:])

    if proc.returncode != 0:
        return jsonify({
            "error": "test.py failed",
            "returncode": proc.returncode,
            "stdout_tail": proc.stdout.strip().splitlines()[-50:],
            "stderr_tail": proc.stderr.strip().splitlines()[-200:]
        }), 500

    images_candidate_1 = os.path.join(BACKEND_DIR, "results", "fashion_pix2pix", "images")
    images_candidate_2 = os.path.join(BACKEND_DIR, "results", "fashion_pix2pix", "test_latest", "images")

    RESULT_DIR = None
    if os.path.exists(images_candidate_1):
        RESULT_DIR = images_candidate_1
    elif os.path.exists(images_candidate_2):
        RESULT_DIR = images_candidate_2
    else:
        debug_print("No results dir found. Checked:", images_candidate_1, images_candidate_2)
        return jsonify({
            "error": "no results folder found",
            "checked": [images_candidate_1, images_candidate_2],
            "backend_stdout_tail": proc.stdout.strip().splitlines()[-50:],
            "backend_stderr_tail": proc.stderr.strip().splitlines()[-200:]
        }), 500

    debug_print("Using RESULT_DIR:", RESULT_DIR)
    files = os.listdir(RESULT_DIR)
    debug_print("Result dir files:", files)

    fake_files = [f for f in files if f.endswith("_fake_B.png")]
    if not fake_files:
        fake_files = [f for f in files if "_fake_A" in f or "_fake" in f]
    if not fake_files:
        return jsonify({"error": "no fake output found", "result_files": files}), 500

    final_img_path = os.path.join(RESULT_DIR, fake_files[0])
    debug_print("Final generated image path:", final_img_path)

    try:
        with open(final_img_path, "rb") as fh:
            encoded = base64.b64encode(fh.read()).decode("utf-8")
    except Exception as e:
        debug_print("Failed to read final image:", str(e))
        return jsonify({"error": "failed to read generated image", "detail": str(e)}), 500

    return jsonify({"result_base64": encoded})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5328, debug=True)

