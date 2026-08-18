import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await signup(name, email, password);

      // ==========================================
      // TEMPORARILY DISABLED - OTP VERIFICATION
      // ==========================================

      /*
      navigate("/verify-email", {
        state: {
          email: email.trim().toLowerCase(),
        },
      });
      */

      // Temporary flow: OTP ke bina signup ke baad login page par jao
      navigate("/login");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="h-full min-h-screen bg-cream flex flex-col px-8 pt-16 pb-10">
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">
        Create your account
      </h1>

      <p className="text-ink-soft text-sm mb-8">
        Join family and friends in completing the Quran.
      </p>

      <form onSubmit={handleSubmit} className="flex-1">
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error}
          </p>
        )}

        <Input
          label="Name"
          type="text"
          placeholder="Your full name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button type="submit" className="w-full mt-2">
          Continue
        </Button>
      </form>

      <p className="text-center text-sm text-ink-soft mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-emerald font-semibold">
          Log In
        </Link>
      </p>
    </div>
  );
}