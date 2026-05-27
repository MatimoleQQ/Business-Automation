import { useState } from "react";

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const uploadFile = async () => {

    if (!selectedFile) {
      setMessage("❌ Wybierz plik");
      return;
    }

    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);

    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log(selectedFile);

    try {
      const res = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();

      console.log("UPLOAD OK:", data);
      setMessage("✅ Upload successful!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-4">Upload file</h2>

      {/* FILE INPUT */}
      <input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        className="mb-4"
      />

      {/* BUTTON */}
      <br />

      <button
        onClick={uploadFile}
        disabled={loading}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* STATUS */}
      {message && (
        <p className="mt-4">{message}</p>
      )}
    </div>
  );
}