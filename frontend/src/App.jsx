import { useState } from "react";

export default function App() {
  const [reports] = useState([
    { id: 1, name: "sales.csv", rows: 120, cols: 5 },
    { id: 2, name: "users.xlsx", rows: 450, cols: 8 }
  ]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>

      <h1>📊 Business Dashboard</h1>
      <p>System działa lokalnie 🚀</p>

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div style={card}>
          <h3>Reports</h3>
          <h2>{reports.length}</h2>
        </div>

        <div style={card}>
          <h3>Total Rows</h3>
          <h2>{reports.reduce((a,b)=>a+b.rows,0)}</h2>
        </div>

        <div style={card}>
          <h3>Status</h3>
          <h2>Active</h2>
        </div>
      </div>

      <h2 style={{ marginTop: 40 }}>Recent Reports</h2>

      <div>
        {reports.map(r => (
          <div key={r.id} style={row}>
            <b>{r.name}</b> — {r.rows} rows / {r.cols} cols
          </div>
        ))}
      </div>

    </div>
  );
}

const card = {
  padding: 20,
  border: "1px solid #ddd",
  borderRadius: 10,
  width: 200,
  boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
};

const row = {
  padding: 10,
  borderBottom: "1px solid #eee"
};