import { useState, useEffect } from "react";

export default function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  useEffect(() => { token ? localStorage.setItem("token", token) : localStorage.removeItem("token"); }, [token]);
  return { token, setToken };
}
