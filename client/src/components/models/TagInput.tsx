import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface TagInputProps {
  value: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
}

export function TagInput({
  value,
  onAdd,
  onRemove,
  placeholder = "Add a tag and press Enter",
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  function commit() {
    const tag = draft.trim();
    if (!tag) return;
    onAdd(tag);
    setDraft("");
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !draft && value.length > 0) {
      onRemove(value[value.length - 1]);
    }
  }

  return (
    <div className="flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-2 py-1.5 focus-within:border-[#111111] focus-within:ring-1 focus-within:ring-[#111111]">
      {value.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="gap-1 rounded-md bg-[#f5f5f5] px-1.5 py-0.5 text-[12px] font-medium text-[#111111] hover:bg-[#f5f5f5]">
          #{tag}
          <button
            type="button"
            onClick={() => onRemove(tag)}
            aria-label={`Remove tag ${tag}`}
            className="inline-flex h-3 w-3 items-center justify-center rounded text-[#6b7280] hover:text-[#111111]">
            <X className="h-2.5 w-2.5" />
          </button>
        </Badge>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : ""}
        className="min-w-[120px] flex-1 bg-transparent text-[13px] text-[#111111] placeholder:text-[#898989] focus:outline-none"
      />
    </div>
  );
}
