import dotenv from "dotenv";
dotenv.config();

export const {
  ADMIN_USER,
  ADMIN_PASS_HASH,
  JWT_SECRET,
  PORT = 4000,
  DATABASE_URL,
} = process.env;
