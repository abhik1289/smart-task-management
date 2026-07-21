import { cn } from "@/lib/utils";
import type { Priority } from "@/store/createTaskStore";

const options: { value: Priority; label: string; dot: string; ring: string }[] =
  [
    {
      value: "high",
      label: "High",
      dot: "bg-[#ef4444]",
      ring: "data-[active=true]:border-[#ef4444] data-[active=true]:bg-[#ef4444]/5",
    },
    {
      value: "medium",
      label: "Medium",
      dot: "bg-[#f59e0b]",
      ring: "data-[active=true]:border-[#f59e0b] data-[active=true]:bg-[#f59e0b]/5",
    },
    {
      value: "low",
      label: "Low",
      dot: "bg-[#10b981]",
      ring: "data-[active=true]:border-[#10b981] data-[active=true]:bg-[#10b981]/5",
    },
  ];

interface PrioritySelectProps {
  value: Priority;
  onChange: (p: Priority) => void;
}

export function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            data-active={active}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] font-medium text-[#374151] transition-colors hover:border-[#d1d5db] hover:bg-[#f8f9fa]",
              o.ring,
            )}>
            <span className={cn("h-2 w-2 rounded-full", o.dot)} />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
