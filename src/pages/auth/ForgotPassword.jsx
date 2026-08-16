import { useState } from "react";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="h-full min-h-screen bg-cream flex flex-col items-center justify-center text-center px-8">
        <div className="w-16 h-16 rounded-full bg-emerald-soft flex items-center justify-center mb-5">
          <MailCheck size={28} className="text-emerald-deep" />
        </div>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">Check your email</h2>
        <p className="text-ink-soft text-sm mb-8 max-w-[28ch]">
          We've sent password reset instructions to your inbox.
        </p>
        <Link to="/login">
          <Button variant="outline">Back to Log In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full min-h-screen bg-cream flex flex-col px-8 pt-16 pb-10">
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Reset your password</h1>
      <p className="text-ink-soft text-sm mb-8">Enter your email and we'll send you reset instructions.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="flex-1"
      >
        <Input label="Email" type="email" placeholder="you@example.com" required />
        <Button type="submit" className="w-full">
          Send Instructions
        </Button>
      </form>
      <Link to="/login" className="text-center text-sm text-emerald font-semibold mt-6">
        Back to Log In
      </Link>
    </div>
  );
}
