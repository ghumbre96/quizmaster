import React from "react";
import { useParams } from "react-router-dom";
import { apiGet, apiPost } from "../lib/api";

export default function TakeQuiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = React.useState(null);
  const [answers, setAnswers] = React.useState({});
  const [result, setResult] = React.useState(null);

  React.useEffect(() => { apiGet(`/api/quizzes/${id}`).then(setQuiz); }, [id]);
  function setAnswer(qid, val){ setAnswers(p => ({...p, [qid]: val})); }
  async function submit(){ setResult(await apiPost(`/api/quizzes/${id}/submit`, { answers })); }

//   if (!quiz) return <div className="muted">Loading…</div>;
if (!quiz || !quiz.id) return <div className="muted">Quiz not found.</div>;


  return (
    <>
      <h1 className="h1">{quiz.title}</h1>
      <div className="stack">
        {quiz.questions.map((q, i)=>(
          <div key={q.id} className="card">
            <strong>Q{i+1}. {q.text}</strong>
            {q.type==="MCQ" && (
              <div className="stack-sm">
                {q.options.map(o => (
                  <label key={o.id} className="row-center">
                    <input type="radio" name={`q${q.id}`}
                      onChange={()=>setAnswer(q.id, o.id)}
                      checked={String(answers[q.id])===String(o.id)} />
                    <span>{o.text}</span>
                  </label>
                ))}
              </div>
            )}
            {q.type==="TRUE_FALSE" && (
              <div className="row">
                {["true","false"].map(v => (
                  <label key={v} className="row-center">
                    <input type="radio" name={`q${q.id}`}
                      onChange={()=>setAnswer(q.id, v==="true")}
                      checked={String(answers[q.id])===v} />
                    <span>{v.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            )}
            {q.type==="SHORT_TEXT" && (
              <input className="input" placeholder="Your answer"
                     onChange={e=>setAnswer(q.id, e.target.value)} />
            )}
          </div>
        ))}
      </div>
      <button className="btn btn-primary" onClick={submit}>Submit</button>
      {result && <div className="card" style={{marginTop:12}}>
        <strong>Score: {result.score} / {result.total}</strong>
      </div>}
    </>
  );
}
