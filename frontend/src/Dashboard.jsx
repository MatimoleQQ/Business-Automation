import { useEffect, useState } from "react";

export default function Dashboard() {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/reports/");
    const data = await res.json();
    setReports(data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">

      {/* SIDEBAR */}
      <div className="w-64 bg-gray-800 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-10">🚀 Dashboard</h1>

        <button className="mb-4 hover:text-blue-400">📊 Reports</button>
        <button className="mb-4 hover:text-blue-400">📁 Upload</button>
        <button className="mb-4 hover:text-blue-400">⚙️ Settings</button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold">Reports</h2>
          <button
            onClick={fetchReports}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition"
          >
            Refresh
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow">
            <p className="text-gray-400">Total Reports</p>
            <h3 className="text-2xl">{reports.length}</h3>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow">
            <p className="text-gray-400">Last Upload</p>
            <h3 className="text-sm">
              {reports[0]?.created_at || "—"}
            </h3>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow">
            <p className="text-gray-400">Status</p>
            <h3 className="text-green-400">Active</h3>
          </div>
        </div>

        {/* REPORTS LIST */}
        <div className="grid gap-4">
          {reports.map((r) => (
            <div
              key={r.id}
              className="bg-gray-800 p-5 rounded-xl flex justify-between items-center hover:bg-gray-700 transition"
            >
              <div>
                <h3 className="font-semibold">{r.file_name}</h3>
                <p className="text-sm text-gray-400">
                  Rows: {r.rows} | Columns: {r.columns}
                </p>
              </div>

              <a
                href={`http://127.0.0.1:8000/${r.report_path}`}
                target="_blank"
                className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition"
              >
                Download
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}