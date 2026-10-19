import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);
const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem("shopease-user") || "null");
  } catch {
    return null;
  }
};
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [loading, setLoading] = useState(
    Boolean(localStorage.getItem("shopease-token")),
  );
  useEffect(() => {
    if (!loading) return;
    api("/auth/me")
      .then(({ user: current }) => {
        setUser(current);
        localStorage.setItem("shopease-user", JSON.stringify(current));
      })
      .catch(() => {
        localStorage.removeItem("shopease-token");
        localStorage.removeItem("shopease-user");
        setUser(null);
      })
      .finally(() => setLoading(false));
    // Validate the persisted session once when the provider mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function signIn(email, password) {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    saveSession(data);
    return data.user;
  }
  async function register(name, email, password) {
    const data = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    saveSession(data);
    return data.user;
  }
  function saveSession(data) {
    localStorage.setItem("shopease-token", data.token);
    localStorage.setItem("shopease-user", JSON.stringify(data.user));
    setUser(data.user);
  }
  function signOut() {
    localStorage.removeItem("shopease-token");
    localStorage.removeItem("shopease-user");
    setUser(null);
  }
  async function updateName(name) {
    const data = await api("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });
    setUser(data.user);
    localStorage.setItem("shopease-user", JSON.stringify(data.user));
    return data.user;
  }
  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, register, signOut, updateName }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
