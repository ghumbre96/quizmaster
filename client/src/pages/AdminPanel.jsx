import React from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { apiPost } from "../lib/api";
import QuestionEditor from "../components/QuestionEditor";

export default function AdminPanel() {
  const { token } = useAuth();
  const nav = useNavigate();
  React.useEffect(() => { if (!token) nav("/admin"); }, [token, nav]);

  const [title, setTitle] = React.useState("");
  const [questions, setQuestions] = React.useState([]);

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
  function updateAt(i, patch) { setQuestions(qs => qs.map((q,idx)=> idx===i ? {...q, ...patch} : q)); }
  function removeAt(i) { setQuestions(qs => qs.filter((_,idx)=> idx!==i)); }
  function addOptionAt(i) {
    setQuestions(qs => qs.map((q,idx)=> idx!==i ? q :
      ({ ...q, options:[...q.options, { id: crypto.randomUUID(), text: "", isCorrect: false }] })));
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
      const { id } = await apiPost("/api/admin/quizzes", payload, token);
      alert("Saved!");
      setTitle(""); setQuestions([]);
      nav(`/quiz/${id}`);
    } catch (e) {
      console.error(e);
      alert("Save failed");
    }
  }

  return (
    <>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1 className="h1">Create New Quiz</h1>
        <Link to="/admin/quizzes" className="btn btn-secondary">Manage Quizzes</Link>
      </div>

      <div className="card stack">
        <label>Quiz Title</label>
        <input className="input" placeholder="e.g., General Knowledge 101"
          value={title} onChange={e=>setTitle(e.target.value)} />

        <div className="row">
          <select onChange={e=>addQuestion(e.target.value)} defaultValue="MCQ" className="input" style={{ maxWidth: 280 }}>
            <option value="MCQ">Multiple Choice</option>
            <option value="TRUE_FALSE">True / False</option>
            <option value="SHORT_TEXT">Short Text</option>
          </select>
          <button className="btn btn-primary" onClick={()=>addQuestion("MCQ")}>+ Add Question</button>
        </div>

        <div className="stack">
          {questions.map((q,i)=>(
            <QuestionEditor
              key={q.id}
              q={q}
              onUpdate={(patch)=>updateAt(i, patch)}
              onRemove={()=>removeAt(i)}
              onAddOption={()=>addOptionAt(i)}
            />
          ))}
        </div>

        <button disabled={!title || questions.length===0} className="btn btn-primary" onClick={save}>
          Save Quiz
        </button>
      </div>
    </>
  );
}
