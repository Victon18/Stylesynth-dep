import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function saveBase64Image(base64: string) {
  const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");

  const fileName = crypto.randomBytes(10).toString("hex") + ".png";
  const filePath = path.join(process.cwd(), "public", "generated", fileName);

  await writeFile(filePath, buffer);

  // return the URL path for the browser
  return `/generated/${fileName}`;
}

