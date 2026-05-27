export default function Badge({ status }) {
  const styles = {
    uploaded: "bg-blue-600/20 text-blue-400 border-blue-500/30",
    queued: "bg-gray-600/20 text-gray-300 border-gray-500/30",
    processing: "bg-yellow-600/20 text-yellow-400 border-yellow-500/30 animate-pulse",
    analyzing: "bg-purple-600/20 text-purple-400 border-purple-500/30",
    generating_pdf: "bg-indigo-600/20 text-indigo-400 border-indigo-500/30",
    done: "bg-green-600/20 text-green-400 border-green-500/30",
    failed: "bg-red-600/20 text-red-400 border-red-500/30",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded border ${styles[status] || "bg-gray-700 text-gray-300"}`}
    >
      {status}
    </span>
  );
}