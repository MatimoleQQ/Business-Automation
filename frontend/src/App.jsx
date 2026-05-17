import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./Dashboard";
import ReportDetail from "./ReportDetail";

export default function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/report/:id"
          element={<ReportDetail />}
        />
      </Routes>

    </BrowserRouter>
  );
}