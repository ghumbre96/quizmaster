import React from "react";
import { useParams } from "react-router-dom";

const API = import.meta.env.VITE_API || "http://localhost:4000";

export default function TakeQuiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = React.useState(null);
  const [answers, setAnswers] = React.useState({});
  const [result, setResult] = React.useState(null);
  const [index, setIndex] = React.useState(0); // current question index
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setQuiz(null);
    setResult(null);
    setIndex(0);
    fetch(`${API}/api/quizzes/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load quiz");
        return r.json();
      })
      .then(setQuiz)
      .catch((err) => {
        console.error(err);
        setQuiz(null);
      });
  }, [id]);

  // helper to set an answer
  function setAnswer(qid, val) {
    setAnswers((prev) => ({ ...prev, [qid]: val }));
  }

  // navigation
  function goNext() {
    if (!quiz) return;
    setIndex((i) => Math.min(i + 1, quiz.questions.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function goPrev() {
    setIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    if (!quiz) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/quizzes/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      setResult(data);
      // Optionally scroll to result
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Submit failed");
    } finally {
      setLoading(false);
    }
  }

  if (!quiz) {
    return (
      <div className="container">
        <div className="muted">Loading…</div>
      </div>
    );
  }

  const q = quiz.questions[index];
  const total = quiz.questions.length;
  const isLast = index === total - 1;

  return (
    <div className="container">
      <h1 className="h1">{quiz.title}</h1>

      {/* Progress */}
      <div style={{ marginBottom: 12 }}>
        <strong>Question {index + 1} / {total}</strong>
      </div>

      {/* Single question card */}
      <div className="card">
        <strong style={{ display: "block", marginBottom: 8 }}>
          Q{index + 1}. {q.text}
        </strong>

        {/* MCQ */}
        {q.type === "MCQ" && (
          <div className="stack-sm">
            {q.options.map((o) => (
              <label key={o.id} className="row-center" style={{ gap: 8 }}>
                <input
                  type="radio"
                  name={`q${q.id}`}
                  onChange={() => setAnswer(q.id, o.id)}
                  checked={String(answers[q.id]) === String(o.id)}
                />
                <span>{o.text}</span>
              </label>
            ))}
          </div>
        )}

        {/* TRUE_FALSE */}
        {q.type === "TRUE_FALSE" && (
          <div className="row" style={{ gap: 12 }}>
            {["true", "false"].map((v) => (
              <label key={v} className="row-center" style={{ gap: 8 }}>
                <input
                  type="radio"
                  name={`q${q.id}`}
                  onChange={() => setAnswer(q.id, v === "true")}
                  checked={String(answers[q.id]) === v}
                />
                <span>{v.toUpperCase()}</span>
              </label>
            ))}
          </div>
        )}

        {/* SHORT_TEXT */}
        {q.type === "SHORT_TEXT" && (
          <input
            className="input"
            placeholder="Your answer"
            value={answers[q.id] || ""}
            onChange={(e) => setAnswer(q.id, e.target.value)}
          />
        )}
      </div>

      {/* Navigation footer */}
      <div style={{
        display: "flex",
        gap: 8,
        marginTop: 16,
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div>
          <button
            className="btn btn-ghost"
            onClick={goPrev}
            disabled={index === 0}
            style={{ opacity: index === 0 ? 0.5 : 1 }}
          >
            ◀ Prev
          </button>
        </div>

        <div>
          {!isLast && (
            <button className="btn btn-primary" onClick={goNext}>
              Next ▶
            </button>
          )}

          {isLast && (
            <button
              className="btn btn-primary"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="card" style={{ marginTop: 16 }}>
          <strong>Score: {result.score} / {result.total}</strong>
          {result.details && (
            <pre style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
              {JSON.stringify(result.details, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
