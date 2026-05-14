import {
  ArrowRightOnRectangleIcon,
  ClipboardDocumentCheckIcon,
  FolderIcon,
  Squares2X2Icon
} from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Squares2X2Icon },
  { to: "/projects", label: "Projects", icon: FolderIcon },
  { to: "/tasks", label: "Tasks", icon: ClipboardDocumentCheckIcon }
];

const Sidebar = () => {
  const { logout, user } = useAuth();
  const { theme, setTheme, themes } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="border-b border-slate-200 bg-white/92 backdrop-blur lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col px-4 py-4">
        <div className="mb-5">
          <BrandLogo />
          <div className="mt-3 inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-bold uppercase tracking-wide text-slate-500">{user?.role}</div>
        </div>

        <nav className="grid grid-cols-3 gap-2 lg:grid-cols-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition lg:justify-start ${
                  isActive ? "text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`
              }
              style={({ isActive }) => (isActive ? { background: "var(--accent)" } : undefined)}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Theme</div>
          <div className="grid grid-cols-4 gap-2">
            {themes.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`h-9 rounded-md border border-slate-200 bg-white p-1 transition hover:scale-105 ${theme === item.id ? "theme-active" : ""}`}
                onClick={() => setTheme(item.id)}
                title={item.label}
                aria-label={`Use ${item.label} theme`}
              >
                <span className={`block h-full rounded ${item.swatch}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 lg:mt-auto">
          <div className="truncate text-sm font-semibold text-slate-900">{user?.name}</div>
          <div className="truncate text-xs text-slate-500">{user?.email}</div>
          <button type="button" onClick={handleLogout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
