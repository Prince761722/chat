import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { connectSocket } from "../socket";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !password) {
      setErrorMsg("Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: username.trim(),
            password
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Login failed");
        return;
      }

      localStorage.setItem("chatUser", JSON.stringify(data));
      connectSocket(data._id);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center mt-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-indigo-500/20">
        <div className="mb-6 text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Welcome back
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Login to{" "}
            <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Quick Chat
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Use your registered username and password.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {errorMsg && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded-xl px-3 py-2">
              {errorMsg}
            </p>
          )}

          <div className="space-y-1.5 text-sm">
            <label className="block text-slate-200" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="prince_1045"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 transition"
            />
          </div>

          <div className="space-y-1.5 text-sm">
            <label className="block text-slate-200" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-indigo-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 hover:bg-indigo-400 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-[11px] text-slate-400 text-center">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-sky-300 hover:text-sky-200 font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
