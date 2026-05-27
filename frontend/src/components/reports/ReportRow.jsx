import { motion } from "framer-motion";
import { Download, Eye, Trash2 } from "lucide-react";

export default function ReportRow({
  report,
  onClick,
  onDelete,
  onDownload,
  onPreview,
}) {
  return (
    <motion.div
      onClick={() => onClick(report)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-xl cursor-pointer"
    >

      {/* LEFT */}
      <div className="flex flex-col">
        <div className="font-medium">
          {report.file_name}
        </div>

        <div className="text-xs text-gray-500">
          {report.status}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2">

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload(report);
          }}
          className="p-2 hover:bg-gray-800 rounded"
        >
          <Download size={16} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview(report);
          }}
          className="p-2 hover:bg-gray-800 rounded"
        >
          <Eye size={16} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(report);
          }}
          className="p-2 hover:bg-gray-800 rounded text-red-400"
        >
          <Trash2 size={16} />
        </button>

      </div>
    </motion.div>
  );
}