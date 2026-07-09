import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md";
  fullWidth?: boolean;
}

export function Button({
  className = "",
  variant = "default",
  size = "md",
  fullWidth = false,
  type = "button",
  ...props
}: ButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-zinc-950/10 disabled:cursor-not-allowed disabled:opacity-60";
  const variants = {
    default: "bg-zinc-950 text-white hover:bg-zinc-800",
    outline:
      "border border-zinc-200 bg-white text-zinc-900 hover:border-zinc-900 hover:bg-zinc-50",
    ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950",
  };
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm",
  };

  return (
    <button
      type={type}
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`.trim()}
      {...props}
    />
  );
}
