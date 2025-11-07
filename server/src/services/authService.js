import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ADMIN_USER, ADMIN_PASS_HASH, JWT_SECRET } from "../config/env.js";

export async function login(username, password) {
  if (username !== ADMIN_USER) throw new Error("Invalid username");

  const ok = await bcrypt.compare(password, ADMIN_PASS_HASH);
  if (!ok) throw new Error("Invalid password");

  const token = jwt.sign({ role: "admin", sub: username }, JWT_SECRET, {
    expiresIn: "12h",
  });
  return { token, user: { username } };
}
