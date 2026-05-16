import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  let user = null;

  try {
    if (token) {
      user = jwtDecode(token);
    }
  } catch (e) {
    console.log("Bad token");
    localStorage.removeItem("token");
    setToken(null);
  }
  console.log("TOKEN:", token);
  console.log("USER:", user);

  return (
    <>
      {!token ? (
        <Login onLogin={login} />
      ) : (
        <Dashboard user={user} onLogout={logout} />
      )}
    </>
  );
}