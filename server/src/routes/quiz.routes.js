// src/routes/quiz.routes.js
import express from "express";
import { listQuizzes, getQuizById, gradeQuiz } from "../services/quizService.js";

export const quizRouter = express.Router();

quizRouter.get("/", async (_req, res) => {
  res.json(await listQuizzes());
});

quizRouter.get("/:id", async (req, res) => {
  const quiz = await getQuizById(Number(req.params.id));
  if (!quiz) return res.status(404).json({ message: "Not found" });
  res.json(quiz);
});

quizRouter.post("/:id/submit", async (req, res) => {
  const result = await gradeQuiz(Number(req.params.id), req.body.answers);
  if (!result) return res.status(404).json({ message: "Not found" });
  res.json(result);
});
