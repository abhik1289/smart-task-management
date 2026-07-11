"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { signUp } from "../../api/auth";
import { Button } from "../../components/common/Button";
import { FormCard } from "../../components/common/FormCard";
import { InputField } from "../../components/common/InputField";

const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: SignUpValues) => {
    try {
      await signUp({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      navigate("/activation");
    } catch (error) {
      console.error("Sign up failed", error);
      alert("Sign up failed. Please verify your information and try again.");
    }
  };

  return (
    <FormCard
      eyebrow="Create account"
      title="Create your account"
      description="Start organizing your work in minutes.">
      <form className="grid gap-3.5" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Full name"
          type="text"
          placeholder="Alex Morgan"
          autoComplete="name"
          {...register("fullName")}
          error={errors.fullName?.message}
        />

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
          placeholder="Create a strong password"
          autoComplete="new-password"
          {...register("password")}
          error={errors.password?.message}
        />

        <InputField
          label="Confirm password"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          to="/sign-in"
          className="font-semibold text-zinc-900 hover:underline">
          Sign in
        </Link>
      </p>
    </FormCard>
  );
}
