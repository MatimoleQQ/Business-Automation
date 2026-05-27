import { useEffect, useState } from "react";
import { fetchReports } from "../api/reports.api";

export function useReports(token) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ws;

    async function load() {
      try {
        const data = await fetchReports(token);
        setReports(Array.isArray(data) ? data : []);
      } catch (e) {
        setReports([]);
      } finally {
        setLoading(false);
      }
    }

    load();

    ws = new WebSocket("ws://127.0.0.1:8000/ws/reports");

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        // SAFE FORMAT
        if (msg?.type === "reports_update") {
          setReports(Array.isArray(msg.data) ? msg.data : []);
        }
      } catch (e) {
        console.log("WS error", e);
      }
    };

    return () => ws?.close();
  }, [token]);

  return { reports, loading };
}