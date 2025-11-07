import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createQuiz,
  listQuizzesForAdmin,
  getQuizForAdmin,
  updateQuiz,
  deleteQuiz,
} from "../services/quizService.js";

export const adminRouter = express.Router();

adminRouter.post("/quizzes", authMiddleware, async (req, res) => {
  const { title, questions } = req.body || {};
  if (!title || !Array.isArray(questions) || !questions.length) {
    return res.status(400).json({ message: "Title and questions required" });
  }
  const quiz = await createQuiz(title, questions);
  res.status(201).json({ id: quiz.id });
});

adminRouter.get("/quizzes", authMiddleware, async (_req, res) => {
  res.json(await listQuizzesForAdmin());
});

adminRouter.get("/quizzes/:id", authMiddleware, async (req, res) => {
  const quiz = await getQuizForAdmin(Number(req.params.id));
  if (!quiz) return res.status(404).json({ message: "Not found" });
  res.json(quiz);
});

adminRouter.put("/quizzes/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  const { title, questions } = req.body || {};
  if (!title || !Array.isArray(questions) || !questions.length) {
    return res.status(400).json({ message: "Title and questions required" });
  }
  await updateQuiz(id, title, questions);
  res.json({ id });
});

adminRouter.delete("/quizzes/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  await deleteQuiz(id);
  res.json({ id, deleted: true });
});
