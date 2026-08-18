import { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "../services/authApi";

const AuthContext = createContext(null);

const TOKEN_KEY = "token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });

  const [authLoading, setAuthLoading] = useState(true);

  // Restore existing login session
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const savedToken = localStorage.getItem(TOKEN_KEY);

      if (!savedToken) {
        if (!cancelled) {
          setAuthLoading(false);
        }

        return;
      }

      try {
        const result = await authApi.getMe(savedToken);

        if (!cancelled) {
          setUser(result.data.user);
          setToken(savedToken);
        }
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);

        if (!cancelled) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (!cancelled) {
          setAuthLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  // Login
  const login = async (email, password) => {
    const result = await authApi.login(email, password);

    const {
      user: loggedInUser,
      token: newToken,
    } = result.data;

    localStorage.setItem(TOKEN_KEY, newToken);

    setUser(loggedInUser);
    setToken(newToken);

    return loggedInUser;
  };

  // Signup
  // Signup ke baad token save nahi hoga.
  // User ko OTP verify karna padega.
  const signup = async (name, email, password) => {
    const result = await authApi.signup(
      name,
      email,
      password
    );

    return result.data;
  };

  // Verify Email OTP
  const verifyEmail = async (email, otp) => {
    const result = await authApi.verifyEmail(
      email,
      otp
    );

    const {
      user: verifiedUser,
      token: newToken,
    } = result.data;

    // OTP successful → token save
    localStorage.setItem(TOKEN_KEY, newToken);

    setUser(verifiedUser);
    setToken(newToken);

    return verifiedUser;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authLoading,

        login,
        signup,
        verifyEmail,
        logout,

        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}