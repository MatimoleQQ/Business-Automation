import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
      isActive ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800"
    }`;

  return (
    <aside
      className={`h-screen sticky top-0 bg-gray-950 border-r border-gray-800 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* TOP */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!collapsed && (
          <div className="text-white font-bold text-lg">SAAS</div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* USER */}
      <div className="p-4 border-b border-gray-800">
        {!collapsed && (
          <div>
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="text-white text-sm truncate">
              {user?.email || "No user"}
            </p>
          </div>
        )}
      </div>

      {/* NAV */}
      <nav className="p-3 space-y-2">
        <NavLink to="/app/reports" className={linkClass}>
          <FileText size={18} />
          {!collapsed && "Reports"}
        </NavLink>

        <NavLink to="/app/settings" className={linkClass}>
          <Settings size={18} />
          {!collapsed && "Settings"}
        </NavLink>
      </nav>

      {/* FOOTER */}
      <div className="absolute bottom-0 w-full p-3 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 w-full px-3 py-2"
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}