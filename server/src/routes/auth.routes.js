import express from "express";
import { login } from "../services/authService.js";

export const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    const data = await login(username, password);
    res.json(data);
  } catch (e) {
    res.status(401).json({ message: e.message || "Invalid credentials" });
  }
});
