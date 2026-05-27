const BASE_URL = "http://127.0.0.1:8000";

const token = () => localStorage.getItem("token");

// =========================
// REPORTS
// =========================

export const fetchReportsAPI = async () => {
  const res = await fetch(`${BASE_URL}/api/reports/`, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch reports");

  return res.json();
};

export const deleteReportAPI = async (id) => {
  const res = await fetch(`${BASE_URL}/api/reports/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete report");

  return res.json();
};

// =========================
// UPLOAD
// =========================

export const uploadFileAPI = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  return res.json();
};