import { apiRequest } from "./apiClient";

// Signup
export function signup(name, email, password) {
  return apiRequest("/auth/signup", {
    method: "POST",
    body: {
      name,
      email,
      password,
    },
  });
}

// Verify Email OTP
export function verifyEmail(email, otp) {
  return apiRequest("/auth/verify-email", {
    method: "POST",
    body: {
      email,
      otp,
    },
  });
}

// Login
export function login(email, password) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: {
      email,
      password,
    },
  });
}

// Get current user
export function getMe(token) {
  return apiRequest("/auth/me", {
    token,
  });
}