import { useEffect, useState } from "react";

export default function Dashboard() {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/reports/");
      const data = await res.json();

      setReports(data);
    } catch (error) {
      alert("Błąd pobierania reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>📊 Reports Dashboard</h1>

      <button onClick={fetchReports}>Refresh</button>

      <hr />

      {reports.length === 0 ? (
        <p>Brak raportów</p>
      ) : (
        reports.map((r) => (
          <div
            key={r.id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              marginTop: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{r.file_name}</h3>

            <p>Rows: {r.rows}</p>
            <p>Columns: {r.columns}</p>
            <p>{r.created_at}</p>

            <a
              href={`http://127.0.0.1:8000/${r.report_path}`}
              target="_blank"
              rel="noreferrer"
            >
              📄 Download PDF
            </a>
          </div>
        ))
      )}
    </div>
  );
}