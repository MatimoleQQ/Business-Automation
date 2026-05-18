import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

import Dashboard from "./Dashboard";
import ReportDetail from "./ReportDetail";



export default function App() {

const location = useLocation();
 return (
  <AnimatePresence mode="wait">
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/report/:id" element={<ReportDetail />} />
    </Routes>
  </AnimatePresence>
);
}