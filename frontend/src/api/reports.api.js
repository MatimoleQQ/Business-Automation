const BASE = "http://127.0.0.1:8000";

export async function fetchReports(token) {
  const res = await fetch(`${BASE}/api/reports/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed fetch");

  return res.json();
}