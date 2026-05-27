import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error("USER PARSE ERROR:", err);
  }

  const onLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex">
      <Sidebar user={user} onLogout={onLogout} />

      <div className="flex-1 bg-gray-950 min-h-screen text-white p-6">
        <Outlet />
      </div>
    </div>
  );
}