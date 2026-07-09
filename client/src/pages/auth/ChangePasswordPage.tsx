"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "../../components/common/Button";
import { FormCard } from "../../components/common/FormCard";
import { InputField } from "../../components/common/InputField";

const changePasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (data: ChangePasswordValues) => {
    console.info("Password updated", data);
  };

  return (
    <FormCard
      eyebrow="Secure update"
      title="Choose a new password"
      description="Update your password to keep your account secure.">
      <form className="grid gap-3.5" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="New password"
          type="password"
          placeholder="Enter a new password"
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
          {isSubmitting ? "Updating..." : "Change password"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-zinc-500">
        <Link
          to="/sign-in"
          className="font-semibold text-zinc-900 hover:underline">
          Return to sign in
        </Link>
      </p>
    </FormCard>
  );
}
