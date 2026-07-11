"use client";

import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { FormCard } from "../../components/common/FormCard";
import { InputField } from "../../components/common/InputField";
import { activateAccount } from "../../api/auth";

export default function ActivationPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await activateAccount(otp);
      navigate("/sign-in");
    } catch (err) {
      setError(
        "Unable to activate account. Please confirm your OTP and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      eyebrow="Activate account"
      title="Enter your verification code"
      description="Check your email for the activation code we sent after sign up.">
      <form className="grid gap-3.5" onSubmit={handleSubmit}>
        <InputField
          label="Activation code"
          type="text"
          placeholder="123456"
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
          error={error ?? undefined}
        />

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting || otp.length === 0}>
          {isSubmitting ? "Activating..." : "Activate account"}
        </Button>
      </form>
    </FormCard>
  );
}
