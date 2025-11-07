import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes.js";
import { quizRouter } from "./routes/quiz.routes.js";
import { adminRouter } from "./routes/admin.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

// Base routes
app.use("/api/auth", authRouter);
app.use("/api/quizzes", quizRouter);
app.use("/api/admin", adminRouter);
