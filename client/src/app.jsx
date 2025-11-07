// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PublicList from "./pages/PublicList";
import TakeQuiz from "./pages/TakeQuiz";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminQuizzes from "./pages/AdminQuizzes";
import AdminEditQuiz from "./pages/AdminEditQuiz";

export default function App() {
  return (
    <>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<PublicList />} />
          <Route path="/quiz/:id" element={<TakeQuiz />} />
          <Route path="/admin" element={<AdminLogin />} />

          {/* New: Admin list + edit (protected) */}
          <Route
            path="/admin/quizzes"
            element={
              <ProtectedRoute>
                <AdminQuizzes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/quizzes/:id/edit"
            element={
              <ProtectedRoute>
                <AdminEditQuiz />
              </ProtectedRoute>
            }
          />

          {/* Existing creator page */}
          <Route
            path="/admin/panel"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
