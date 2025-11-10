import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { apiGet, apiDelete } from "../lib/api";

export default function AdminQuizzes() {
  const { token } = useAuth();
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await apiGet("/api/admin/quizzes", token);
      setItems(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this quiz? This cannot be undone.")) return;
    try {
      await apiDelete(`/api/admin/quizzes/${id}`, token);
      setItems(prev => prev.filter(x => x.id !== id));
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  }

  React.useEffect(() => { load(); }, []);

  return (
    <>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="h1">All Quizzes</h1>
        <Link className="btn btn-primary" to="/admin/panel">+ New Quiz</Link>
      </div>

      {loading ? <div className="muted">Loading…</div> : (
        <div className="card">
          <div className="row" style={{ fontWeight: 600, borderBottom: "1px solid #e5e7eb", paddingBottom: 8 }}>
            <div style={{ width: 80 }}>ID</div>
            <div style={{ flex: 1 }}>Title</div>
            <div style={{ width: 160 }}>Questions</div>
            <div style={{ width: 220 }}>Actions</div>
          </div>
          {items.map(q => (
            <div key={q.id} className="row" style={{ alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ width: 80 }}>{q.id}</div>
              <div style={{ flex: 1 }}>{q.title}</div>
              <div style={{ width: 160 }}>{q.questionCount}</div>
              <div style={{ width: 220 }} className="row">
                <Link className="btn btn-ghost" to={`/admin/quizzes/${q.id}/edit`}>Edit</Link>
                <button className="btn btn-danger" onClick={() => remove(q.id)}>Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="muted" style={{ marginTop: 8 }}>No quizzes yet.</div>}
        </div>
      )}
    </>
  );
}
