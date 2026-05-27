import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import Reports from "./pages/Reports";
import Upload from "./pages/Upload";
import Settings from "./pages/Settings";
import ReportDetail from "./pages/ReportDetail";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* APP */}
    <Route
      path="/app/*"
      element={
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      }
    >


        <Route index element={<Navigate to="reports" />} />
      <Route path="reports" element={<Reports />} />
      <Route path="reports/:id" element={<ReportDetail />} />
      <Route path="upload" element={<Upload />} />
      <Route path="settings" element={<Settings />} />

      </Route>

    </Routes>
  );
}