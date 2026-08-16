import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await login(email, password);

      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-full min-h-screen bg-cream flex flex-col px-8 pt-16 pb-10">
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">
        Welcome back
      </h1>

      <p className="text-ink-soft text-sm mb-8">
        Log in to continue your Khatm.
      </p>

      <form onSubmit={handleSubmit} className="flex-1">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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
          placeholder="Your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="text-right -mt-2 mb-6">
          <Link
            to="/forgot-password"
            className="text-sm text-emerald font-semibold"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full">
          Log In
        </Button>
      </form>

      <p className="text-center text-sm text-ink-soft mt-6">
        Don't have an account?{" "}
        <Link to="/signup" className="text-emerald font-semibold">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
