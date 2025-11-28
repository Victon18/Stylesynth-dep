"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // 🔹 Mouse-based parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // adjust depth
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setOffset({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        name,
        email,
        phone,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials or registration failed");
      } else if (result?.ok) {
        router.push("/home");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/home" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out"
        style={{
          backgroundImage: "url(/gen3.png)",
          transform: `translate(${offset.x}px, ${offset.y}px) scale(1.05)`,
        }}
      ></div>

      <div className="absolute inset-0 backdrop-blur-sm"></div>

      <style jsx>{`
        * {
          font-family: 'Courier New', monospace;
        }
      `}</style>

      <div className="w-full max-w-md relative z-10">
        <div className="absolute top-2 left-2 right-[-8px] bottom-[-8px] border-2 border-black/50 rounded-xl -z-10"></div>

        <div className="relative border-2 border-black/70 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] backdrop-blur-xl bg-white/60 p-10">
          <h1 className="text-3xl font-bold text-center mb-8 tracking-tight text-black">
            LOGIN
          </h1>

          {error && (
            <div className="mb-6 p-4 border-2 border-red-600 bg-red-50/90 backdrop-blur-sm">
              <p className="text-red-600 text-sm font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleCredentialsLogin} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 font-bold text-sm tracking-wide text-black"
              >
                NAME
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 border-2 border-black/70 bg-white/70 backdrop-blur-sm text-base outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all text-black placeholder-gray-600"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 font-bold text-sm tracking-wide text-black"
              >
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border-2 border-black/70 bg-white/70 backdrop-blur-sm text-base outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all text-black placeholder-gray-600"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block mb-2 font-bold text-sm tracking-wide text-black"
              >
                PHONE NUMBER
              </label>
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="1231231231"
                required
                className="w-full px-4 py-3 border-2 border-black/70 bg-white/70 backdrop-blur-sm text-base outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all text-black placeholder-gray-600"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 font-bold text-sm tracking-wide text-black"
              >
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border-2 border-black/70 bg-white/70 backdrop-blur-sm text-base outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all text-black placeholder-gray-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-3 border-2 border-black/70 font-bold text-base cursor-pointer mt-3 transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-x-0 disabled:hover:translate-y-0"
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-b-2 border-black/70"></div>
            <span className="px-3 font-bold text-black">OR</span>
            <div className="flex-1 border-b-2 border-black/70"></div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-12 h-12 border-2 border-black/70 bg-white/70 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

