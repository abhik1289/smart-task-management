import { useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  WORKSPACE_MEMBERS,
  type WorkspaceMember,
} from "@/store/createTaskStore";

interface MemberMultiSelectProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function MemberMultiSelect({
  selectedIds,
  onToggle,
}: MemberMultiSelectProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return WORKSPACE_MEMBERS;
    return WORKSPACE_MEMBERS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
    );
  }, [query]);

  const selected = useMemo(
    () => WORKSPACE_MEMBERS.filter((m) => selectedIds.includes(m.id)),
    [selectedIds],
  );

  return (
    <div className="space-y-2">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((m) => (
            <Badge
              key={m.id}
              variant="secondary"
              className="gap-1.5 rounded-full bg-[#f5f5f5] px-2 py-0.5 text-[12px] font-medium text-[#111111] hover:bg-[#f5f5f5]">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#111111] text-[9px] font-semibold text-white">
                {m.avatar}
              </span>
              {m.name}
              <button
                type="button"
                onClick={() => onToggle(m.id)}
                aria-label={`Remove ${m.name}`}
                className="ml-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full text-[#6b7280] hover:bg-[#e5e7eb] hover:text-[#111111]">
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6b7280]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search workspace members…"
          className="h-9 w-full rounded-lg border border-[#e5e7eb] bg-white pl-8 pr-3 text-[13px] text-[#111111] placeholder:text-[#898989] focus:border-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111]"
        />
      </div>

      {/* Member list */}
      <div className="max-h-[180px] overflow-y-auto rounded-lg border border-[#e5e7eb] bg-white">
        {filtered.length === 0 ? (
          <div className="px-3 py-6 text-center text-[13px] text-[#6b7280]">
            No members match “{query}”.
          </div>
        ) : (
          filtered.map((m: WorkspaceMember) => {
            const isSelected = selectedIds.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onToggle(m.id)}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-[#f3f4f6] px-3 py-2 text-left last:border-b-0 hover:bg-[#f8f9fa]",
                  isSelected && "bg-[#f8f9fa]",
                )}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5f5f5] text-[11px] font-semibold text-[#111111]">
                  {m.avatar}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-[#111111]">
                    {m.name}
                  </span>
                  <span className="block truncate text-[11px] text-[#6b7280]">
                    {m.email}
                  </span>
                </span>
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                    isSelected
                      ? "border-[#111111] bg-[#111111] text-white"
                      : "border-[#e5e7eb] bg-white",
                  )}>
                  {isSelected && <Check className="h-3 w-3" />}
                </span>
              </button>
            );
          })
        )}
      </div>
      <p className="text-[11px] text-[#898989]">
        {WORKSPACE_MEMBERS.length} members in this workspace ·{" "}
        {selectedIds.length} selected
      </p>
    </div>
  );
}
