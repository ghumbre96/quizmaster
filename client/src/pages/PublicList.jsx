import React from "react";
import { apiGet } from "../lib/api";
import QuizCard from "../components/QuizCard";

export default function PublicList() {
  const [quizzes, setQuizzes] = React.useState([]);
  React.useEffect(() => { apiGet("/api/quizzes").then(setQuizzes); }, []);
  return (
    <>
      <h1 className="h1">Available Quizzes</h1>
      <div className="list">
        {quizzes.map(q => <QuizCard key={q.id} quiz={q} />)}
        {quizzes.length===0 && <div className="muted">No quizzes yet.</div>}
      </div>
    </>
  );
}
