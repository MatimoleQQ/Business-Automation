import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import DashboardLayout from "./layouts/DashboardLayout";

import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import Upload from "./pages/Upload";
import Settings from "./pages/Settings";

import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>

      {/* ===================== */}
      {/* PUBLIC ROUTES */}
      {/* ===================== */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ===================== */}
      {/* PROTECTED APP AREA */}
      {/* ===================== */}

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >

        {/* default redirect */}
        <Route index element={<Navigate to="/app/reports" replace />} />

        {/* child routes */}
        <Route path="reports" element={<Reports />} />
        <Route path="reports/:id" element={<ReportDetail />} />
        <Route path="upload" element={<Upload />} />
        <Route path="settings" element={<Settings />} />

      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}