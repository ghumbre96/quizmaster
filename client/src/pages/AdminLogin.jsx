import React from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../lib/api";
import useAuth from "../hooks/useAuth";

export default function AdminLogin() {
  const nav = useNavigate();
  const auth = useAuth();
  const [form, setForm] = React.useState({ username: "", password: "" });
  const [loading, setLoading] = React.useState(false);

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiPost("/api/auth/login", form);
      auth.set(data.token);              // ⬅️ IMPORTANT
      nav("/admin/panel");
    } catch (e) {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1 className="h1">Admin Login</h1>
      <form className="card stack" onSubmit={login}>
        <label>Username</label>
        <input className="input" value={form.username}
          onChange={e=>setForm({...form, username:e.target.value})}/>
        <label>Password</label>
        <input type="password" className="input" value={form.password}
          onChange={e=>setForm({...form, password:e.target.value})}/>
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
        <div className="muted">Default: <code>admin / admin123</code></div>
      </form>
    </div>
  );
}
