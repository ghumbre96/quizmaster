import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";
import useAuth from "../hooks/useAuth";

export default function AdminQuizzes() {
  const { token } = useAuth();
  const nav = useNavigate();
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  async function load() {
    setLoading(true);
    const r = await fetch(`${API_BASE}/api/admin/quizzes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await r.json();
    setItems(data);
    setLoading(false);
  }

  async function remove(id) {
    if (!confirm("Delete this quiz? This cannot be undone.")) return;
    const r = await fetch(`${API_BASE}/api/admin/quizzes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (r.ok) {
      setItems(items.filter(i => i.id !== id));
    } else {
      alert("Delete failed");
    }
  }

  React.useEffect(() => { load(); }, []);

  return (
    <>
      <div className="row" style={{justifyContent:"space-between", alignItems:"center"}}>
        <h1 className="h1">All Quizzes</h1>
        <div className="row">
          <Link className="btn btn-primary" to="/admin/panel">+ New Quiz</Link>
        </div>
      </div>

      {loading ? <div className="muted">Loading…</div> : (
        <div className="card">
          <div className="row" style={{fontWeight:600, borderBottom:"1px solid #e5e7eb", paddingBottom:8}}>
            <div style={{width:80}}>ID</div>
            <div style={{flex:1}}>Title</div>
            <div style={{width:160}}>Questions</div>
            <div style={{width:200}}>Actions</div>
          </div>
          {items.map(q => (
            <div key={q.id} className="row" style={{alignItems:"center", padding:"10px 0", borderBottom:"1px solid #f3f4f6"}}>
              <div style={{width:80}}>{q.id}</div>
              <div style={{flex:1}}>{q.title}</div>
              <div style={{width:160}}>{q.questionCount}</div>
              <div style={{width:200}} className="row">
                <Link className="btn btn-ghost" to={`/admin/quizzes/${q.id}/edit`}>Edit</Link>
                <button className="btn btn-danger" onClick={()=>remove(q.id)}>Delete</button>
              </div>
            </div>
          ))}
          {items.length===0 && <div className="muted" style={{marginTop:8}}>No quizzes yet.</div>}
        </div>
      )}
    </>
  );
}
