import { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "../services/authApi";

const AuthContext = createContext(null);
const TOKEN_KEY = "token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  // True until we've checked localStorage + validated any existing token
  // against the backend. Consumers (protected routes) must wait for this
  // before deciding whether someone is logged in.
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (!savedToken) {
        setAuthLoading(false);
        return;
      }

      try {
        const result = await authApi.getMe(savedToken);
        if (!cancelled) {
          setUser(result.data.user);
          setToken(savedToken);
        }
      } catch {
        // Token missing/invalid/expired — clear it rather than leave the
        // app thinking someone is logged in when the backend disagrees.
        localStorage.removeItem(TOKEN_KEY);
        if (!cancelled) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email, password) => {
    const result = await authApi.login(email, password);
    const { user: loggedInUser, token: newToken } = result.data;
    localStorage.setItem(TOKEN_KEY, newToken);
    setUser(loggedInUser);
    setToken(newToken);
    return loggedInUser;
  };

  const signup = async (name, email, password) => {
    const result = await authApi.signup(name, email, password);
    const { user: newUser, token: newToken } = result.data;
    localStorage.setItem(TOKEN_KEY, newToken);
    setUser(newUser);
    setToken(newToken);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, authLoading, login, signup, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
