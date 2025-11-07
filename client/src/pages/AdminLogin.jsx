import React from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../lib/api";
import useAuth from "../hooks/useAuth";

export default function AdminLogin() {
  const nav = useNavigate();
  const { setToken } = useAuth();
  const [form,setForm]=React.useState({username:"",password:""});

  async function login(e){
    e.preventDefault();
    try{
      const data = await apiPost("/api/auth/login", form);
      setToken(data.token);
      nav("/admin/panel");
    }catch{
      alert("Invalid credentials");
    }
  }

  return (
    <>
      <h1 className="h1">Admin Login</h1>
      <form className="card stack" onSubmit={login}>
        <label>Username</label>
        <input className="input" value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/>
        <label>Password</label>
        <input type="password" className="input" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
        <button className="btn btn-primary">Login</button>
        <div className="muted">Default: <code>admin / admin123</code></div>
      </form>
    </>
  );
}
