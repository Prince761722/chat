import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !username.trim() || !password || !confirm) {
      setErrorMsg("Please fill all fields");
      return;
    }

    if (password !== confirm) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: name.trim(),
            username: username.trim(),
            password
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Registration failed");
        return;
      }

      // Registration success → go to login
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      setErrorMsg("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center mt-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-sky-500/20">
        <div className="mb-6 text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Create Account
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Register on{" "}
            <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Quick Chat
            </span>
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {errorMsg && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded-xl px-3 py-2">
              {errorMsg}
            </p>
          )}

          <div className="space-y-1.5 text-sm">
            <label className="block text-slate-200" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Prince Kashyap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 transition"
            />
          </div>

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
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 transition"
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
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 transition"
            />
          </div>

          <div className="space-y-1.5 text-sm">
            <label className="block text-slate-200" htmlFor="confirm">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-sky-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 hover:bg-sky-400 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
