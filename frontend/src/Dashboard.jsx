import { useEffect, useState } from "react";
import Upload from "./Upload";
import Settings from "./Settings";

export default function Dashboard({ user, onLogout }) {
  const [reports, setReports] = useState([]);
  const [view, setView] = useState("reports");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("token");

  // =========================
  // FETCH REPORTS
  // =========================
  const fetchReports = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/reports/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
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

    showToast("Deleted report");
    fetchReports();
  };

  // =========================
  // DOWNLOAD PDF/CSV
  // =========================
  const downloadPdf = (r) => {
      const link = document.createElement("a");
      link.href = `http://127.0.0.1:8000${r.pdf_url}`;
      link.download = r.file_name || "report.pdf";
      link.click();
    };

  const downloadCsv = (r) => {
    const a = document.createElement("a");
    a.href = `http://127.0.0.1:8000${r.csv_url}`;
    a.download = "";
    a.click();
  };

  // =========================
  // TOAST
  // =========================
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // =========================
  // EFFECT
  // =========================
  useEffect(() => {
    if (view === "reports") fetchReports();
  }, [view]);

  const filtered = reports.filter((r) =>
    r.file_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        Not logged in
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-950 text-white">

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-gray-800 bg-gray-900 p-6 flex flex-col">
        <h1 className="text-xl font-bold mb-10">🚀 Automation</h1>

        <p className="text-sm mb-6">{user?.email}</p>

        <nav className="space-y-2">
          {["reports", "upload", "settings"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`w-full text-left px-3 py-2 rounded ${
                view === v ? "bg-blue-600" : "hover:bg-gray-800"
              }`}
            >
              {v}
            </button>
          ))}
        </nav>

        <button onClick={onLogout} className="mt-auto text-red-400">
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
              className="w-full p-2 mb-4 bg-gray-900 border border-gray-800"
            />

            {loading ? (
              <p>Loading...</p>
            ) : filtered.length === 0 ? (
              <p>No reports</p>
            ) : (
              <div className="grid gap-3">
                {filtered.map((r) => (
                  <div
                    key={r.id}
                    className="flex justify-between p-4 bg-gray-900 border border-gray-800"
                  >
                    <div>
                      <div>{r.file_name}</div>
                      <div className="text-xs text-gray-500">
                        {r.created_at
                          ? new Date(r.created_at).toLocaleString()
                          : ""}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadCsv(r)}
                        className="px-3 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600"
                      >
                        Download CSV
                      </button>

                      <button
                        onClick={() => downloadPdf(r)}
                        className="px-3 py-1 text-xs rounded bg-blue-600 hover:bg-blue-500"
                      >
                        Download PDF
                      </button>

                      <button
                        onClick={() => deleteReport(r.id)}
                        className="px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {view === "upload" && <Upload />}
        {view === "settings" && <Settings />}
      </main>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-black p-3">
          {toast}
        </div>
      )}
    </div>
  );
}