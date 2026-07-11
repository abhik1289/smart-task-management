"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/common/Button";
import { FormCard } from "@/components/common/FormCard";
import { InputField } from "@/components/common/InputField";
import { login } from "../../api/auth";

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: SignInValues) => {
    try {
      await login(data);
      navigate("/");
    } catch (error) {
      console.error("Sign in failed", error);
      alert("Sign in failed. Please check your credentials and try again.");
    }
  };

  return (
    <FormCard
      eyebrow="Secure access"
      title="Welcome back"
      description="Sign in to continue to your workspace.">
      <div className="mb-4 grid gap-2.5">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 py-3 font-semibold text-zinc-900 transition hover:border-zinc-900 hover:shadow-[0_8px_20px_rgba(17,17,17,0.05)]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-[0.78rem] font-bold">
            G
          </span>
          Continue with Google
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2.5 text-[0.82rem] uppercase tracking-[0.12em] text-zinc-500">
        <span className="h-px flex-1 bg-zinc-200" />
        <span>or continue with email</span>
        <span className="h-px flex-1 bg-zinc-200" />
      </div>

      <form className="grid gap-3.5" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Email address"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <InputField
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          {...register("password")}
          error={errors.password?.message}
        />

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link
          to="/forgot-password"
          className="font-semibold text-zinc-900 hover:underline">
          Forgot password?
        </Link>
        <Link
          to="/sign-up"
          className="font-semibold text-zinc-900 hover:underline">
          Create account
        </Link>
      </div>
    </FormCard>
  );
}
