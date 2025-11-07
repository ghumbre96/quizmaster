import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Header() {
  const { token } = useAuth();
  return (
    <header className="nav">
      <div className="brand"><span className="logo">🛡️</span> QuizMaster</div>
      <nav className="links">
        <Link to="/">Take a Quiz</Link>
        <Link to="/admin">Admin Panel</Link>
        <span className="muted">{token ? "admin" : ""}</span>
      </nav>
    </header>
  );
}
