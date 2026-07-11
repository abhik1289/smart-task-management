"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/common/Button";
import { FormCard } from "@/components/common/FormCard";
import { InputField } from "@/components/common/InputField";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgotPasswordValues) => {
    console.info("Password reset requested", data);
  };

  return (
    <FormCard
      eyebrow="Recover access"
      title="Reset your password"
      description="Enter your email and we will send a recovery link.">
      <form className="grid gap-3.5" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Email address"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-zinc-500">
        Back to{" "}
        <Link
          to="/sign-in"
          className="font-semibold text-zinc-900 hover:underline">
          sign in
        </Link>
      </p>
    </FormCard>
  );
}
