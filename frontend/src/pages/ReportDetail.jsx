import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

export default function ReportDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");


  const token = localStorage.getItem("access_token");

  // =========================
  // FETCH REPORT
  // =========================
  const fetchReport = async () => {
      if (error) {
          return (
            <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
              <div className="text-red-400 text-xl mb-2">
                ⚠️ Error
              </div>

              <div className="text-gray-300 mb-6">
                {error}
              </div>

              <button
                onClick={() => fetchReport()}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
              >
                Retry
              </button>
            </div>
          );
      }

      try {
        setLoading(true);
        setError("");

        const res = await apiFetch(
          `http://127.0.0.1:8000/api/reports/${id}`
        );

        if (!res) return;

        if (!res.ok) {
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
  // SKELETON LOADING
  // =========================
    function SkeletonBlock() {
      return (
        <div className="animate-pulse bg-gray-800 rounded-xl p-4 h-24" />
      );
    }


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
  // DOWNLOAD
  // =========================
  const downloadFile = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // =========================
  // PDF PREVIEW
  // =========================
  const openPreview = () => {
    if (!report?.pdf_url) return;
    setPreviewUrl(`http://127.0.0.1:8000${report.pdf_url}`);
  };

  const closePreview = () => setPreviewUrl(null);

  // =========================
  // Download CSV
  // =========================
  const downloadCSV = () => {
      const token = localStorage.getItem("access_token");

      fetch(`http://127.0.0.1:8000/${report.csv_path}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = report.file_name || "report.csv";
          document.body.appendChild(a);
          a.click();
          a.remove();
        });
    };

  // =========================
  // LOADING / EMPTY
  // =========================
  if (loading) {
      return (
        <div className="min-h-screen bg-gray-950 p-8 text-white">

          <div className="h-8 w-1/3 bg-gray-800 rounded mb-6 animate-pulse" />

          <div className="grid grid-cols-3 gap-4 mb-6">
            <SkeletonBlock />
            <SkeletonBlock />
            <SkeletonBlock />
          </div>

          <div className="h-64 bg-gray-800 rounded-xl animate-pulse mb-6" />

          <div className="h-64 bg-gray-800 rounded-xl animate-pulse" />

        </div>
      );
    }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center text-center p-10">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-xl font-semibold">Report not found</h2>
          <p className="text-gray-400 mt-2">
            This report may have been deleted or never existed.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
          >
            Go back
          </button>
        </div>
    );
  }

  return (


    <div className="min-h-screen bg-gray-950 text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
        >
          ← Back
        </button>

        <div className="text-sm text-gray-400">
          Report #{report.id}
        </div>
      </div>

      {/* TITLE */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{report.file_name}</h1>
        <p className="text-gray-400 text-sm mt-1">
          Auto-generated analytics dashboard • AI processed dataset
        </p>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">

  <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
    <p className="text-gray-400 text-xs">File name</p>
    <p className="text-sm mt-1">{report.file_name}</p>
  </div>

  <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
    <p className="text-gray-400 text-xs">Status</p>
    <p className="text-sm mt-1 capitalize">{report.status}</p>
  </div>

  <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
    <p className="text-gray-400 text-xs">Report ID</p>
    <p className="text-sm mt-1">#{report.id}</p>
  </div>

</div>

      {/* STATUS */}
      <div className="mb-8">
        <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
          Ready
        </span>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-3 gap-4 mb-10">

        <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
          <div className="text-gray-400 text-sm">Rows</div>
          <div className="text-4xl font-bold mt-2">
            {analysis.rows ?? 0}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
          <div className="text-gray-400 text-sm">Columns</div>
          <div className="text-4xl font-bold mt-2">
            {analysis.columns ?? 0}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
          <div className="text-gray-400 text-sm">Data Quality</div>
          <div className="text-4xl font-bold mt-2">
            {qualityScore}%
          </div>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-6 mb-10">

        {/* BAR */}
        <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">
            Dataset Overview
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                  itemStyle={{
                    color: "#fff"
                  }}
                  labelStyle={{
                    color: "#fff"
                  }}
                />
              <Bar
                dataKey="value"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">
            Data Quality Score
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={90}
                innerRadius={60}
                paddingAngle={4}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                  itemStyle={{
                    color: "#fff"
                  }}
                  labelStyle={{
                    color: "#fff"
                  }}
                />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* INSIGHTS */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Insights</h2>

        <div className="space-y-2">
          {(analysis.insights?.length > 0) ? (
              analysis.insights.map((i, idx) => (
                <motion.div
                    key={idx}
                    className="p-3 bg-gray-900 border border-gray-800 rounded-lg text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    • {i}
                  </motion.div>
              ))
            ) : (
              <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 text-sm">
                No insights available for this dataset
              </div>
            )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">

        <button
          onClick={openPreview}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
        >
          Preview PDF
        </button>

        <button
          onClick={() =>
            downloadFile(
              `http://127.0.0.1:8000${report.pdf_url}`,
              report.file_name + ".pdf"
            )
          }
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
        >
          Download PDF
        </button>

        <button onClick={downloadCSV} className="bg-green-600 px-4 py-2 rounded">
          Download CSV
        </button>

      </div>


      {/* MODAL */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-gray-900 w-[90%] h-[90%] rounded-xl border border-gray-700 flex flex-col">

            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="font-semibold">PDF Preview</h2>

              <button
                onClick={closePreview}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded"
              >
                Close
              </button>
            </div>

            <iframe
              src={previewUrl}
              className="flex-1 w-full bg-white"
              title="PDF Preview"
            />

          </div>

        </div>
      )}

    </div>
  );
}