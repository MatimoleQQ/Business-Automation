import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/apiFetch";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        setError(data.detail || "Login failed");
        return;
      }
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }


      // SAFE STORAGE

        localStorage.setItem(
          "access_token",
          data.access_token ?? ""
        );
        localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/app/reports");

    } catch (err) {
      console.error(err);
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">

        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
        <p className="text-gray-400 text-sm mb-6">
          Login to your dashboard
        </p>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-xs text-gray-500 mt-6 text-center">
          Don’t have an account?{" "}
           <Link to="/register" className="text-blue-400 underline">
             Create one
          </Link>
        </p>


      </div>
    </div>
  );
}