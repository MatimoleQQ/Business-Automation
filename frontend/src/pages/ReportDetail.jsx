import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getFileName } from "../api/fileUtils";
import { apiFetch } from "../api/apiFetch";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const API = import.meta.env.VITE_API_URL;

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");

  // =========================
  // FETCH REPORT
  // =========================
  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await apiFetch(`/api/reports/${id}`);

      if (!res || !res.ok) {
        throw new Error("Failed to load report");
      }

      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
      setError("Could not load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  // =========================
  // SAFE ANALYSIS
  // =========================
  const analysis =
    typeof report?.analysis === "string"
      ? JSON.parse(report.analysis)
      : report?.analysis || {};

  const missingCount = Object.values(
    analysis.missing_values || {}
  ).reduce((a, b) => a + b, 0);

  const qualityScore = Math.max(0, 100 - missingCount);

  // =========================
  // CHART DATA
  // =========================
  const chartData = [
    { name: "Rows", value: analysis.rows ?? 0 },
    { name: "Columns", value: analysis.columns ?? 0 },
  ];

  const pieData = [
    { name: "Valid", value: qualityScore },
    { name: "Missing", value: 100 - qualityScore },
  ];

  const COLORS = ["#3b82f6", "#22c55e"];

  // =========================
  // DOWNLOAD FILE (GENERIC)
  // =========================
  const downloadFile = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };


  // =========================
  // DOWNLOAD PDF
  // =========================
  const downloadPDF = async () => {
  const token = localStorage.getItem("access_token");

  const res = await fetch(
    `${API}/api/reports/${report.id}/download`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    console.error("Download failed");
    return;
  }

  const blob = await res.blob();

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${report.file_name}.pdf`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
};

  // =========================
  // PDF PREVIEW
  // =========================
  const openPreview = async () => {
      const token = localStorage.getItem("access_token");

      const res = await fetch(
        `${API}/api/reports/${report.id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("PDF preview failed");
        return;
      }

      const blob = await res.blob();

      const url = URL.createObjectURL(blob);

      setPreviewUrl(url);
    };

  const closePreview = () => setPreviewUrl(null);

  // =========================
  // CSV DOWNLOAD
  // =========================
  const downloadCSV = async () => {
      const token = localStorage.getItem("access_token");

      const res = await fetch(
        `${API}/api/reports/${report.id}/download-csv`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("CSV download failed");
        return;
      }

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.file_name}.csv`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-8 text-white animate-pulse">
        <div className="h-8 w-1/3 bg-gray-800 rounded mb-6" />
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="h-24 bg-gray-800 rounded" />
          <div className="h-24 bg-gray-800 rounded" />
          <div className="h-24 bg-gray-800 rounded" />
        </div>
        <div className="h-64 bg-gray-800 rounded mb-6" />
        <div className="h-64 bg-gray-800 rounded" />
      </div>
    );
  }

  // =========================
  // ERROR / EMPTY
  // =========================
  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
        <div className="text-red-400 text-xl mb-2">⚠️ Error</div>
        <div className="text-gray-300 mb-4">{error}</div>

        <button
          onClick={fetchReport}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Report not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
        >
          ← Back
        </button>

        <div className="text-gray-400 text-sm">
          Report #{report.id}
        </div>
      </div>

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6">
        {report.file_name}
      </h1>

      {/* METRICS */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="p-6 bg-gray-900 rounded-xl">
          Rows: {analysis.rows ?? 0}
        </div>
        <div className="p-6 bg-gray-900 rounded-xl">
          Columns: {analysis.columns ?? 0}
        </div>
        <div className="p-6 bg-gray-900 rounded-xl">
          Quality: {qualityScore}%
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-6 mb-10">

        <div className="p-6 bg-gray-900 rounded-xl">
          <h2 className="mb-4">Dataset Overview</h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 bg-gray-900 rounded-xl">
          <h2 className="mb-4">Quality</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">

        <button
          onClick={openPreview}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Preview PDF
        </button>

        <button
          onClick={() =>
            downloadPDF(
              `${API}/api/reports/${report.id}/download`,
              report.file_name + ".pdf"
            )

          }
          className="px-4 py-2 bg-gray-800 rounded"
        >
          Download PDF
        </button>

        <button
          onClick={downloadCSV}
          className="px-4 py-2 bg-green-600 rounded"
        >
          Download CSV
        </button>

      </div>

      {/* PREVIEW MODAL */}
      {previewUrl && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 w-[90%] h-[90%] rounded-xl flex flex-col">

              <div className="flex justify-between p-4 border-b border-gray-700">
                <h2>PDF Preview</h2>

                <button
                  onClick={() => {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                  }}
                  className="px-3 py-1 bg-red-600 rounded"
                >
                  Close
                </button>
              </div>

              <iframe
                src={previewUrl}
                className="flex-1 w-full bg-white"
              />
            </div>
          </div>
        )}

    </div>
  );
}