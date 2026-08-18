import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../context/AuthContext";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const { verifyEmail } = useAuth();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email) {
      setError("Email information is missing. Please sign up again.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      await verifyEmail(email, otp);

      // OTP verified successfully
      navigate("/home", { replace: true });
    } catch (err) {
      setError(
        err.message || "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full min-h-screen bg-cream flex flex-col px-8 pt-16 pb-10">
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">
        Verify your email
      </h1>

      <p className="text-ink-soft text-sm mb-8">
        We sent a 6-digit verification code to{" "}
        <span className="font-semibold">
          {email || "your email"}
        </span>
      </p>

      <form onSubmit={handleSubmit} className="flex-1">
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error}
          </p>
        )}

        <Input
          label="Verification Code"
          type="text"
          placeholder="Enter 6-digit OTP"
          required
          value={otp}
          maxLength={6}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, ""))
          }
        />

        <Button
          type="submit"
          className="w-full mt-2"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify Email"}
        </Button>
      </form>
    </div>
  );
}