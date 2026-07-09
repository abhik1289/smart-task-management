import * as React from "react";

interface FormCardProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function FormCard({
  eyebrow,
  title,
  description,
  children,
  footer,
}: FormCardProps) {
  return (
    <div className="w-full rounded-[20px] border border-zinc-200 bg-white p-6 shadow-[0_10px_30px_rgba(17,17,17,0.04)] sm:p-8">
      {eyebrow ? (
        <div className="mb-2 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-zinc-500">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="mb-2 text-2xl font-semibold tracking-[-0.03em] text-zinc-950">
        {title}
      </h2>
      {description ? (
        <p className="mb-5 text-sm text-zinc-500">{description}</p>
      ) : null}
      {children}
      {footer ? <div className="mt-4">{footer}</div> : null}
    </div>
  );
}
