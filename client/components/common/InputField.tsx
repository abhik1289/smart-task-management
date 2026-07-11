import * as React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
}

export function InputField({
  label,
  error,
  description,
  className = "",
  id,
  ...props
}: InputFieldProps) {
  const inputId = id || React.useId();

  return (
    <label
      className="grid gap-2 text-sm font-semibold text-zinc-900"
      htmlFor={inputId}>
      {label ? <span>{label}</span> : null}
      <input
        id={inputId}
        className={`w-full rounded-xl border px-3.5 py-3 text-sm text-zinc-900 outline-none transition ${error ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]" : "border-zinc-200 focus:border-zinc-900 focus:shadow-[0_0_0_3px_rgba(17,17,17,0.08)]"} ${className}`.trim()}
        {...props}
      />
      {description ? (
        <span className="text-xs font-normal text-zinc-500">{description}</span>
      ) : null}
      {error ? (
        <span className="text-xs font-normal text-red-600">{error}</span>
      ) : null}
    </label>
  );
}
