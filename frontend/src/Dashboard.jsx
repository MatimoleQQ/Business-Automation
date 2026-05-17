import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Download, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Upload from "./Upload";
import Settings from "./Settings";

export default function Dashboard({ user, onLogout }) {
  const [reports, setReports] = useState([]);
  const [view, setView] = useState("reports");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // =========================
  // FETCH
  // =========================
  const fetchReports = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/reports/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE
  // =========================
  const deleteReport = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/reports/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    showToast("Deleted");
    fetchReports();
  };

  // =========================
  // DOWNLOAD
  // =========================
  const downloadCsv = (r) => {
    const a = document.createElement("a");
    a.href = `http://127.0.0.1:8000${r.csv_url}`;
    a.click();
  };

  const previewPdf = (r) => {
    setPreviewUrl(`http://127.0.0.1:8000${r.pdf_url}`);
  };

  const closePreview = () => setPreviewUrl(null);

  // =========================
  // TOAST
  // =========================
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    if (view === "reports") fetchReports();
  }, [view]);

  const filtered = reports.filter((r) =>
    r.file_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
        Not logged in
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-950 text-white">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col">
        <h1 className="text-xl font-bold mb-8">🚀 Automation</h1>

        <p className="text-sm mb-6 text-gray-400">{user?.email}</p>

        <nav className="space-y-2">
          {["reports", "upload", "settings"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`w-full text-left px-3 py-2 rounded transition ${
                view === v ? "bg-blue-600" : "hover:bg-gray-800"
              }`}
            >
              {v}
            </button>
          ))}
        </nav>

        <button
          onClick={onLogout}
          className="mt-auto text-red-400 hover:text-red-300"
        >
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">

        {view === "reports" && (
          <>
            <h2 className="text-2xl mb-4">Reports</h2>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full p-2 mb-4 bg-gray-900 border border-gray-800 rounded"
            />

            {/* LOADING SKELETON */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 bg-gray-800 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">

                <AnimatePresence>
                  {filtered.map((r) => (
                    <motion.div
                      key={r.id}
                      onClick={() => navigate(`/report/${r.id}`)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-xl"
                    >

                      {/* LEFT */}
                      <div className="flex items-center gap-3">

                        <span className={
                          r.status === "done"
                            ? "bg-green-600"
                            : r.status === "processing"
                            ? "bg-yellow-600 animate-pulse"
                            : "bg-red-600"
                        }>
                          {r.status}
                        </span>

                        <div>
                          <div className="font-medium">
                            {r.file_name}
                          </div>

                          <div className="text-xs text-gray-500">
                            {r.created_at
                              ? new Date(r.created_at).toLocaleString()
                              : ""}
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center gap-2">

                        <button
                          onClick={() => downloadCsv(r)}
                          className="p-2 hover:bg-gray-800 rounded transition active:scale-95"
                        >
                          <Download size={16} />
                        </button>

                        <button
                          onClick={() => previewPdf(r)}
                          className="p-2 hover:bg-gray-800 rounded transition active:scale-95"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                           e.stopPropagation()
                           deleteReport(r.id)
                           }}
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

              </div>
            )}
          </>
        )}

        {view === "upload" && <Upload />}
        {view === "settings" && <Settings />}
      </main>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 right-6 bg-black px-4 py-2 rounded"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL PDF */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <div className="bg-gray-900 w-[90%] h-[90%] rounded-lg overflow-hidden flex flex-col">

              <div className="flex justify-between items-center p-4 border-b border-gray-800">
                <h2>PDF Preview</h2>

                <button
                  onClick={closePreview}
                  className="px-3 py-1 bg-red-600 rounded"
                >
                  Close
                </button>
              </div>

              <iframe
                src={previewUrl}
                className="flex-1 bg-white"
                title="PDF"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}