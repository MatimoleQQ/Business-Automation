import { useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/apiFetch";


export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const fetchReports = async () => {
      try {
        const res = await apiFetch("/api/reports/");
        const data = await res.json();

        setReports(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
      fetchReports();

      const interval = setInterval(fetchReports, 3000);

      return () => clearInterval(interval);
  }, []);



  const deleteReport = async (id) => {
  try {
    const token = localStorage.getItem("access_token");

    await apiFetch(`/api/reports/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setReports(prev => prev.filter(r => r.id !== id));

  } catch (err) {
    console.error(err);
  }
};

  if (loading) {
    return (
      <div className="text-gray-400">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Reports
          </h1>

          <p className="text-gray-400 text-sm">
            Manage and view generated reports
          </p>
        </div>

        <button
          onClick={() => navigate("/app/upload")}
          className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-sm font-medium"
        >
          + New Report
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">




        {/* REPORTS */}
        {reports.map((report) => {
        const status = (report.status || "")
        .replace("[", "")
        .replace("]", "")
        .toLowerCase();

         return (

          <div
            key={report.id}
            className="flex items-center justify-between p-4 border-b border-gray-800 hover:bg-gray-800/40 transition"
          >

            {/* LEFT */}
            <div className="flex items-center gap-4">

              {/* REPORT INFO */}
              <div>
                <div className="flex items-center gap-3">

                  {/* TITLE */}
                  <p className="text-white font-medium">
                    {report.file_name || `Report #${report.id}`}
                  </p>

                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    status === "done"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"

                      : status === "processing"
                      ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"

                      : status === "analyzing"
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"

                      : status === "failed"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"

                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {status || "pending"}
                </span>

                </div>

                {/* ID + DATE */}
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>ID: {report.id}</span>
                  <span>{report.created_at || "No date"}</span>
                </div>
              </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-2">

              {/* VIEW */}
              <button
                onClick={() => navigate(`/app/reports/${report.id}`)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
              >
                <Eye size={16} className="text-white" />
              </button>

              {/* DELETE */}
              <button
                onClick={() => deleteReport(report.id)}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition"
              >
                <Trash2 size={16} className="text-red-400" />
              </button>

            </div>
          </div>
          )
        })}

        {/* EMPTY */}
        {reports.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No reports found.
          </div>
        )}

      </div>
    </div>
  );
}