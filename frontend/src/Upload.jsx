import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async () => {
    if (!file) {
      setError("Wybierz plik CSV lub Excel");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      console.log("UPLOAD RESPONSE:", data);

      setResult(data);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl mb-6">📤 Upload File</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <br />

      <button
        onClick={uploadFile}
        disabled={loading}
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && (
        <div className="mt-4 text-red-400">
          ❌ {error}
        </div>
      )}

      {result && (
        <div className="mt-6 bg-gray-800 p-4 rounded">
          <p>✅ File uploaded</p>


          <p className="mt-2">
            📄 Name: {result.file_name || "—"}
          </p>

          <pre className="mt-3 text-sm text-gray-300 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}