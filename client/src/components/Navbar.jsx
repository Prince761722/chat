import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/40">
            <span className="text-xs font-semibold tracking-tight">GZ</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">
            GenZ Chat
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-full transition ${
                isActive
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-slate-300 hover:bg-white/10"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-full transition hidden sm:inline-block ${
                isActive
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-slate-300 hover:bg-white/10"
              }`
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/40"
                  : "bg-white text-slate-900 hover:bg-slate-100"
              }`
            }
          >
            Login
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
