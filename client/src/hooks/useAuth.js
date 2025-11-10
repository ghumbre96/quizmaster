export default function useAuth() {
  const token = localStorage.getItem("token");
  return {
    token,
    set(t) {
      if (t) localStorage.setItem("token", t);
      else localStorage.removeItem("token");
    },
  };
}
