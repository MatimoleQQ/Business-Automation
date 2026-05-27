import { useState } from "react";

export default function Settings() {
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [autoPdf, setAutoPdf] = useState(true);
  const [autoSaveDb, setAutoSaveDb] = useState(true);

  return (
    <div className="max-w-xl">

      <h1 className="text-2xl mb-6">Settings</h1>

      {/* EMAIL */}
      <div className="bg-gray-800 p-4 rounded mb-4 flex justify-between items-center">
        <span>Send email after upload</span>
        <input
          type="checkbox"
          checked={emailEnabled}
          onChange={() => setEmailEnabled(!emailEnabled)}
        />
      </div>

      {/* PDF */}
      <div className="bg-gray-800 p-4 rounded mb-4 flex justify-between items-center">
        <span>Auto generate PDF</span>
        <input
          type="checkbox"
          checked={autoPdf}
          onChange={() => setAutoPdf(!autoPdf)}
        />
      </div>

      {/* DB */}
      <div className="bg-gray-800 p-4 rounded mb-4 flex justify-between items-center">
        <span>Save to database</span>
        <input
          type="checkbox"
          checked={autoSaveDb}
          onChange={() => setAutoSaveDb(!autoSaveDb)}
        />
      </div>

      {/* SAVE BUTTON (na przyszłość backend) */}
      <button className="bg-blue-600 px-4 py-2 rounded mt-4">
        Save settings
      </button>

    </div>
  );
}