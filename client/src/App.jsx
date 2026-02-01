import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-50">
      {/* Navbar */}
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold">
            QUICK CHAT
          </Link>

          <div className="flex items-center gap-3 text-xs">
            <Link
              to="/"
              className="px-3 py-1.5 rounded-full hover:bg-white/10 transition"
            >
              Home
            </Link>
            <Link
              to="/profile"
              className="px-3 py-1.5 rounded-full hover:bg-white/10 transition"
            >
              Profile
            </Link>
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-full hover:bg-white/10 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 rounded-full bg-white text-slate-900 text-xs font-semibold hover:bg-slate-100 transition"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>

      {/* Pages */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
