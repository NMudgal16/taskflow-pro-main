import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const API_URL = process.env.REACT_APP_API_URL;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const request = useCallback(async (path, options = {}) => {
    if (!API_URL) {
      throw new Error("REACT_APP_API_URL is not configured");
    }

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };

    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }, [token]);

  const saveSession = (payload) => {
    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  };

  const register = useCallback(async (form) => {
    const payload = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(form)
    });
    saveSession(payload);
  }, [request]);

  const login = useCallback(async (form) => {
    const payload = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(form)
    });
    saveSession(payload);
  }, [request]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    API_URL,
    token,
    user,
    isAdmin: user?.role === "admin",
    isAuthenticated: Boolean(token),
    login,
    logout,
    register,
    request
  }), [login, logout, register, request, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
