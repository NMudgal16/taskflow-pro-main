import { CheckSquare, Folder, Home, LogOut, Users, Zap } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/projects", label: "Projects", icon: Folder },
  { to: "/tasks", label: "My Tasks", icon: CheckSquare },
  { to: "/teams", label: "Team", icon: Users }
];

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || "J";

  return (
    <aside className="border-slate-800 bg-[#1b1f2b] text-slate-300 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-80 lg:border-r">
      <div className="flex min-h-full flex-col">
        <div className="flex h-[92px] items-center gap-4 border-b border-slate-800 px-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5268ff] text-white shadow-[0_12px_30px_rgba(82,104,255,0.4)]">
            <Zap className="h-5 w-5" />
          </div>
          <div className="text-xl font-bold text-white">TaskFlow</div>
        </div>

        <nav className="space-y-3 px-4 py-8">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-lg border px-4 py-3 text-lg font-semibold transition ${
                  isActive
                    ? "border-[#40539d] bg-[#29345f] text-[#6f86ff]"
                    : "border-transparent text-slate-400 hover:bg-[#222839] hover:text-slate-100"
                }`
              }
            >
              <Icon className="h-6 w-6" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-[#242a42] p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white shadow-[0_0_24px_rgba(20,184,166,0.35)]">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-base font-bold text-white">{user?.name || "jordan"}</div>
              <div className="text-sm text-slate-400">{user?.role || "Member"}</div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md p-2 text-slate-500 transition hover:bg-slate-700/60 hover:text-white"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
