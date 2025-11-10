import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { apiGet, apiPut } from "../lib/api";
import QuestionEditor from "../components/QuestionEditor";

export default function AdminEditQuiz() {
  const { id } = useParams();
  const nav = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = React.useState("");
  const [questions, setQuestions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await apiGet(`/api/admin/quizzes/${id}`, token);
        setTitle(data.title || "");
        setQuestions(
          data.questions.map(q => ({
            id: q.id,
            text: q.text,
            type: q.type,
            options: q.type === "MCQ" ? q.options.map(o => ({ id: o.id, text: o.text, isCorrect: o.isCorrect })) : [],
            correct: q.type === "TRUE_FALSE" ? q.correct : undefined,
            answerKey: q.type === "SHORT_TEXT" ? (q.answerKey || "") : undefined,
          }))
        );
      } catch (e) {
        console.error(e);
        alert("Failed to load quiz");
        nav("/admin/quizzes");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, nav, token]);

  function updateAt(i, patch) { setQuestions(qs => qs.map((q, idx) => idx === i ? { ...q, ...patch } : q)); }
  function removeAt(i) { setQuestions(qs => qs.filter((_, idx) => idx !== i)); }
  function addOptionAt(i) {
    setQuestions(qs => qs.map((q, idx) => idx !== i ? q :
      ({ ...q, options: [...q.options, { id: crypto.randomUUID(), text: "", isCorrect: false }] })));
  }
  function addQuestion(type="MCQ") {
    setQuestions(qs => [...qs, {
      id: crypto.randomUUID(),
      text: "",
      type,
      options: type==="MCQ" ? [
        { id: crypto.randomUUID(), text: "", isCorrect: true },
        { id: crypto.randomUUID(), text: "", isCorrect: false },
      ] : [],
      correct: type==="TRUE_FALSE" ? true : undefined,
      answerKey: type==="SHORT_TEXT" ? "" : undefined
    }]);
  }

  async function save() {
    try {
      const payload = {
        title,
        questions: questions.map(q => ({
          text: q.text,
          type: q.type,
          options: q.type==="MCQ" ? q.options : [],
          correct: q.type==="TRUE_FALSE" ? q.correct : undefined,
          answerKey: q.type==="SHORT_TEXT" ? q.answerKey : undefined
        }))
      };
      await apiPut(`/api/admin/quizzes/${id}`, payload, token);
      alert("Quiz updated");
      nav("/admin/quizzes");
    } catch (e) {
      console.error(e);
      alert("Save failed");
    }
  }

  if (loading) return <div className="muted">Loading…</div>;

  return (
    <>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="h1">Edit Quiz #{id}</h1>
        <div className="row" style={{ gap: 8 }}>
          <Link className="btn btn-ghost" to="/admin/quizzes">Back</Link>
          <button className="btn btn-primary" onClick={save}>Save</button>
        </div>
      </div>

      <div className="card stack">
        <label>Quiz Title</label>
        <input className="input" value={title} onChange={e => setTitle(e.target.value)} />

        <div className="row">
          <select onChange={e=>addQuestion(e.target.value)} defaultValue="MCQ" className="input" style={{ maxWidth: 280 }}>
            <option value="MCQ">Multiple Choice</option>
            <option value="TRUE_FALSE">True / False</option>
            <option value="SHORT_TEXT">Short Text</option>
          </select>
          <button className="btn btn-ghost" onClick={() => addQuestion("MCQ")}>+ Add Question</button>
        </div>

        <div className="stack">
          {questions.map((q, i) => (
            <QuestionEditor
              key={q.id}
              q={q}
              onUpdate={(patch) => updateAt(i, patch)}
              onRemove={() => removeAt(i)}
              onAddOption={() => addOptionAt(i)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
