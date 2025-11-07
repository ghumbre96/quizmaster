import { Link } from "react-router-dom";
import "./QuizCard.css"; // optional if you want separate styling

export default function QuizCard({ quiz }) {
  return (
    <div className="card quiz-card">
      <div>
        <div className="h2">{quiz.title}</div>
        <div className="muted">{quiz.questionCount} questions</div>
      </div>
      <div className="card-footer">
        <Link className="btn btn-primary" to={`/quiz/${quiz.id}`}>Start</Link>
      </div>
    </div>
  );
}
