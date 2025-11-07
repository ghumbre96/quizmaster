import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();

  //  If no token, redirect to login
  if (!token) {
    alert("Please log in first!");
    return <Navigate to="/admin" replace />;
  }

  //  Otherwise show the requested page
  return children;
}
