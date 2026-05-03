import { useEffect, useState } from "react";
import Upload from "./Upload";
import Settings from "./Settings";

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [view, setView] = useState("reports");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    const res = await fetch("http://127.0.0.1:8000/api/reports/");
    const data = await res.json();
    setReports(data);
    setLoading(false);
  };

  const deleteReport = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/reports/${id}`, {
      method: "DELETE",
    });
    fetchReports();
  };

  useEffect(() => {
    if (view === "reports") {
      fetchReports();
    }
  }, [view]);

  const filteredReports = reports.filter((r) =>
    r.file_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">

      {/* SIDEBAR */}
      <div className="w-64 bg-gray-800 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-10">🚀 Dashboard</h1>

        <button onClick={() => setView("reports")} className="mb-4 hover:text-blue-400 text-left">
          📊 Reports
        </button>

        <button onClick={() => setView("upload")} className="mb-4 hover:text-blue-400 text-left">
          📁 Upload
        </button>

        <button onClick={() => setView("settings")} className="mb-4 hover:text-blue-400 text-left">
          ⚙️ Settings
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">

        {/* ================= REPORTS ================= */}
        {view === "reports" && (
          <>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold">Reports</h2>

              <button
                onClick={fetchReports}
                className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500"
              >
                Refresh
              </button>
            </div>

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-800 p-2 rounded w-full mb-6"
            />

            {/* STATS */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 p-6 rounded-xl">
                <p className="text-gray-400">Total Reports</p>
                <h3 className="text-2xl">{reports.length}</h3>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl">
                <p className="text-gray-400">Last Upload</p>
                <h3 className="text-sm">
                  {reports[0]?.created_at || "—"}
                </h3>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl">
                <p className="text-gray-400">Status</p>
                <h3 className="text-green-400">Active</h3>
              </div>
            </div>

            {/* LOADING */}
            {loading && <p className="text-gray-400">Loading reports...</p>}

            {/* EMPTY */}
            {!loading && filteredReports.length === 0 && (
              <div className="text-center text-gray-400 mt-10">
                📭 No reports found
              </div>
            )}

            {/* LIST */}
            <div className="grid gap-4">
              {!loading &&
                filteredReports.map((r) => (
                  <div
                    key={r.id}
                    className="bg-gray-800 p-5 rounded-xl flex justify-between items-center hover:bg-gray-700 transition"
                  >
                    <div>
                      <h3 className="font-semibold">{r.file_name}</h3>
                      <p className="text-sm text-gray-400">
                        Rows: {r.rows} | Columns: {r.columns}
                      </p>
                      <p className="text-xs text-gray-500">
                        {r.created_at}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <a
                        href={`http://127.0.0.1:8000/${r.report_path}`}
                        target="_blank"
                        className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500"
                      >
                        Download
                      </a>

                      <button
                        onClick={() => deleteReport(r.id)}
                        className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        {/* ================= UPLOAD ================= */}
        {view === "upload" && <Upload />}

        {/* ================= SETTINGS ================= */}
        {view === "settings" && <Settings />}

      </div>
    </div>
  );
}