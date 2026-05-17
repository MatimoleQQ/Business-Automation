import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);

  const token = localStorage.getItem("token");

  // =========================
  // FETCH REPORT
  // =========================
  const fetchReport = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/reports/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const found = data.find((r) => r.id === Number(id));

      setReport(found || null);
    } catch (err) {
      console.error(err);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  // =========================
  // SAFE ANALYSIS PARSE
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
  // DOWNLOAD FIX
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
  // LOADING / EMPTY
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading...
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
          Dataset analysis report
        </p>
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

      {/* INSIGHTS */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Insights</h2>

        <div className="space-y-2">
          {(analysis.insights || []).map((i, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-900 border border-gray-800 rounded-lg text-sm"
            >
              • {i}
            </div>
          ))}
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

      </div>

      {/* PDF MODAL */}
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
              title= "PDF Preview"
            />
          </div>

        </div>
      )}
    </div>
  );
}