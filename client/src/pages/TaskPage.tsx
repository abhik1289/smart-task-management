import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Eye,
  ListTodo,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import { CreateTaskDialog } from "@/components/models/CreateTaskDialog";
import { useCreateTaskStore } from "@/store/createTaskStore";
import { CreateTaskDialog } from "@/components/models/CreateTaskDialog";

// --- Types -----------------------------------------------------------------

type Priority = "high" | "medium" | "low";

type TaskStatus = "pending" | "review" | "completed";

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  avatar: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string; // ISO yyyy-mm-dd
  tags: string[];
  completed: boolean;
}

// --- Priority styling (DESIGN.md tokens) -----------------------------------

const priorityMeta: Record<
  Priority,
  { label: string; classes: string; dot: string }
> = {
  high: {
    label: "High",
    classes:
      "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20 hover:bg-[#ef4444]/15",
    dot: "bg-[#ef4444]",
  },
  medium: {
    label: "Medium",
    classes:
      "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20 hover:bg-[#f59e0b]/15",
    dot: "bg-[#f59e0b]",
  },
  low: {
    label: "Low",
    classes:
      "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20 hover:bg-[#10b981]/15",
    dot: "bg-[#10b981]",
  },
};

function PriorityBadge({ priority }: { priority: Priority }) {
  const meta = priorityMeta[priority];
  return (
    <Badge
      variant="outline"
      className={`border ${meta.classes} gap-1.5 px-2 py-0.5 text-[11px] font-medium`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </Badge>
  );
}

// --- Dummy data -------------------------------------------------------------

const TASKS: Task[] = [
  {
    id: "tsk_01",
    title: "Design onboarding flow for new members",
    description:
      "Create a 3-step onboarding flow covering workspace invite, profile setup, and first-task creation.",
    assignee: "Maya Lin",
    avatar: "ML",
    priority: "high",
    status: "review",
    dueDate: "2026-07-21",
    tags: ["design", "ux"],
    completed: false,
  },
  {
    id: "tsk_02",
    title: "Implement task filtering API",
    description:
      "Add priority and date query params to GET /tasks so the frontend can power the All Tasks filter strip.",
    assignee: "Arjun Patel",
    avatar: "AP",
    priority: "high",
    status: "pending",
    dueDate: "2026-07-19",
    tags: ["backend", "api"],
    completed: false,
  },
  {
    id: "tsk_03",
    title: "Write release notes for v2.4",
    description:
      "Summarize feature flags, breaking changes, and migration steps.",
    assignee: "Sofia Reyes",
    avatar: "SR",
    priority: "medium",
    status: "pending",
    dueDate: "2026-07-24",
    tags: ["docs"],
    completed: false,
  },
  {
    id: "tsk_04",
    title: "Audit overdue workspace invitations",
    description:
      "Review invites that have been pending for more than 14 days and follow up with owners.",
    assignee: "Noah Becker",
    avatar: "NB",
    priority: "low",
    status: "completed",
    dueDate: "2026-07-12",
    tags: ["ops"],
    completed: true,
  },
  {
    id: "tsk_05",
    title: "Refactor workspace sidebar",
    description:
      "Replace the legacy accordion with the new shadcn sidebar and ensure focus states match DESIGN.md.",
    assignee: "Priya Shah",
    avatar: "PS",
    priority: "medium",
    status: "review",
    dueDate: "2026-07-20",
    tags: ["frontend", "ui"],
    completed: false,
  },
  {
    id: "tsk_06",
    title: "Set up SOC 2 evidence collection",
    description:
      "Configure Drata to auto-pull access logs and code review evidence for the upcoming audit.",
    assignee: "Liam Chen",
    avatar: "LC",
    priority: "high",
    status: "pending",
    dueDate: "2026-07-22",
    tags: ["security", "compliance"],
    completed: false,
  },
  {
    id: "tsk_07",
    title: "Polish empty states on task lists",
    description:
      "Use the friendly-empty-state component and add CTAs when no tasks are present.",
    assignee: "Maya Lin",
    avatar: "ML",
    priority: "low",
    status: "completed",
    dueDate: "2026-07-10",
    tags: ["design", "frontend"],
    completed: true,
  },
  {
    id: "tsk_08",
    title: "Migrate legacy analytics events",
    description:
      "Move the remaining three event types from the v1 schema to v2 and update downstream dashboards.",
    assignee: "Diego Alvarez",
    avatar: "DA",
    priority: "medium",
    status: "review",
    dueDate: "2026-07-23",
    tags: ["data"],
    completed: false,
  },
  {
    id: "tsk_09",
    title: "Draft Q3 roadmap one-pager",
    description:
      "Summarize focus areas, key bets, and the top three customer asks into a one-page leader brief.",
    assignee: "Sofia Reyes",
    avatar: "SR",
    priority: "high",
    status: "pending",
    dueDate: "2026-07-25",
    tags: ["planning"],
    completed: false,
  },
  {
    id: "tsk_10",
    title: "Triage bug backlog for next sprint",
    description:
      "Sort incoming bugs by severity, tag duplicates, and slot the top five into the upcoming sprint.",
    assignee: "Noah Becker",
    avatar: "NB",
    priority: "low",
    status: "completed",
    dueDate: "2026-07-09",
    tags: ["frontend"],
    completed: true,
  },
];

// --- Helpers ---------------------------------------------------------------

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isOverdue(iso: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(iso) < today;
}

// --- Task row --------------------------------------------------------------

function TaskRow({ task }: { task: Task }) {
  const overdue = !task.completed && isOverdue(task.dueDate);
  return (
    <div className="flex items-start gap-4 border-b border-[#f3f4f6] px-5 py-4 last:border-b-0 hover:bg-[#f8f9fa]/60 transition-colors">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f5f5] text-[12px] font-semibold text-[#111111]">
        {task.avatar}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[14px] font-semibold text-[#111111] truncate">
            {task.title}
          </p>
          <PriorityBadge priority={task.priority} />
        </div>
        <p className="mt-1 text-[13px] text-[#6b7280] line-clamp-1">
          {task.description}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#6b7280]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-[#6b7280]" />
            {task.assignee}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 ${
              overdue ? "text-[#ef4444] font-medium" : ""
            }`}>
            <Clock className="h-3 w-3" />
            {formatDate(task.dueDate)}
            {overdue && <span className="ml-1">· Overdue</span>}
          </span>
          {task.tags.map((t) => (
            <span
              key={t}
              className="rounded-md bg-[#f5f5f5] px-1.5 py-0.5 text-[11px] text-[#374151]">
              #{t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Counts ----------------------------------------------------------------

function useCounts(tasks: Task[]) {
  return useMemo(
    () => ({
      all: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      review: tasks.filter((t) => t.status === "review").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    }),
    [tasks],
  );
}

// --- Empty state -----------------------------------------------------------

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f5f5] text-[#6b7280]">
        {icon}
      </div>
      <p className="text-[14px] font-semibold text-[#111111]">{title}</p>
      <p className="mt-1 max-w-sm text-[13px] text-[#6b7280]">{description}</p>
    </div>
  );
}

// --- Filters bar (All Tasks only) -----------------------------------------

function FiltersBar({
  search,
  setSearch,
  priority,
  setPriority,
  date,
  setDate,
}: {
  search: string;
  setSearch: (v: string) => void;
  priority: "all" | Priority;
  setPriority: (v: "all" | Priority) => void;
  date: "all" | "today" | "week" | "overdue";
  setDate: (v: "all" | "today" | "week" | "overdue") => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border border-[#e5e7eb] rounded-lg bg-white px-3 py-2">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6b7280]" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks…"
          className="h-8 border-0 bg-transparent pl-8 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div className="h-5 w-px bg-[#e5e7eb]" />

      <Select
        value={priority}
        onValueChange={(v) => setPriority(v as "all" | Priority)}>
        <SelectTrigger className="h-8 min-w-[130px] border-[#e5e7eb] bg-white">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#6b7280]" />
            <SelectValue placeholder="Priority" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={date}
        onValueChange={(v) =>
          setDate(v as "all" | "today" | "week" | "overdue")
        }>
        <SelectTrigger className="h-8 min-w-[130px] border-[#e5e7eb] bg-white">
          <SelectValue placeholder="Date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All dates</SelectItem>
          <SelectItem value="today">Due today</SelectItem>
          <SelectItem value="week">This week</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
        </SelectContent>
      </Select>

      {(priority !== "all" || date !== "all" || search) && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-[12px] text-[#6b7280] hover:text-[#111111]"
          onClick={() => {
            setSearch("");
            setPriority("all");
            setDate("all");
          }}>
          Clear
        </Button>
      )}
    </div>
  );
}

// --- Page ------------------------------------------------------------------

function TaskPage() {
  const tasks = TASKS;
  const counts = useCounts(tasks);
  const openCreateTask = useCreateTaskStore((s) => s.setOpen);

  // All Tasks filter state
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");
  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "week" | "overdue"
  >("all");

  const filteredAll = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAhead = new Date(today);
    weekAhead.setDate(weekAhead.getDate() + 7);

    return tasks.filter((t) => {
      if (search) {
        const q = search.toLowerCase();
        const matches =
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.assignee.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (priorityFilter !== "all" && t.priority !== priorityFilter)
        return false;
      if (dateFilter !== "all") {
        const due = new Date(t.dueDate);
        if (dateFilter === "overdue") {
          if (!(due < today && !t.completed)) return false;
        }
        if (dateFilter === "today") {
          if (due.getTime() !== today.getTime()) return false;
        }
        if (dateFilter === "week") {
          if (due < today || due > weekAhead) return false;
        }
      }
      return true;
    });
  }, [tasks, search, priorityFilter, dateFilter]);

  const pending = tasks.filter((t) => t.status === "pending");
  const review = tasks.filter((t) => t.status === "review");
  const completed = tasks.filter((t) => t.status === "completed");

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-[28px] font-semibold tracking-[-0.5px] text-[#111111]">
            Tasks
          </h1>
          <p className="mt-1 text-[14px] text-[#6b7280]">
            Plan, prioritize, and ship work across your workspace.
          </p>
        </div>
        <Button
          onClick={() => openCreateTask(true)}
          className="h-10 rounded-md bg-[#111111] px-4 text-[14px] font-semibold text-white hover:bg-[#242424]">
          <Plus className="mr-1.5 h-4 w-4" />
          New task
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="flex flex-col gap-6">
        <TabsList className="w-fit bg-[#f8f9fa] p-1 rounded-full border border-[#e5e7eb]">
          <TabsTrigger
            value="all"
            className="rounded-full px-4 py-1.5 data-[active]:bg-white data-[active]:text-[#111111] data-[active]:shadow-sm">
            <ListTodo className="h-4 w-4" />
            All Tasks
            <span className="ml-1 rounded-full bg-[#f5f5f5] px-1.5 py-0.5 text-[10px] font-semibold text-[#374151] group-data-[active=true]/tabs-trigger:bg-[#111111] group-data-[active=true]/tabs-trigger:text-white">
              {counts.all}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="rounded-full px-4 py-1.5 data-[active]:bg-white data-[active]:text-[#111111] data-[active]:shadow-sm">
            <Clock className="h-4 w-4" />
            Pending
            <span className="ml-1 rounded-full bg-[#f5f5f5] px-1.5 py-0.5 text-[10px] font-semibold text-[#374151] group-data-[active=true]/tabs-trigger:bg-[#111111] group-data-[active=true]/tabs-trigger:text-white">
              {counts.pending}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="review"
            className="rounded-full px-4 py-1.5 data-[active]:bg-white data-[active]:text-[#111111] data-[active]:shadow-sm">
            <Eye className="h-4 w-4" />
            Review
            <span className="ml-1 rounded-full bg-[#f5f5f5] px-1.5 py-0.5 text-[10px] font-semibold text-[#374151] group-data-[active=true]/tabs-trigger:bg-[#111111] group-data-[active=true]/tabs-trigger:text-white">
              {counts.review}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="rounded-full px-4 py-1.5 data-[active]:bg-white data-[active]:text-[#111111] data-[active]:shadow-sm">
            <CheckCircle2 className="h-4 w-4" />
            Completed
            <span className="ml-1 rounded-full bg-[#f5f5f5] px-1.5 py-0.5 text-[10px] font-semibold text-[#374151] group-data-[active=true]/tabs-trigger:bg-[#111111] group-data-[active=true]/tabs-trigger:text-white">
              {counts.completed}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* ALL TASKS */}
        <TabsContent value="all" className="flex flex-col gap-4 outline-none">
          <FiltersBar
            search={search}
            setSearch={setSearch}
            priority={priorityFilter}
            setPriority={setPriorityFilter}
            date={dateFilter}
            setDate={setDateFilter}
          />

          <Card className="overflow-hidden border-[#e5e7eb] shadow-none">
            <CardHeader className="border-b border-[#f3f4f6] bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All tasks</CardTitle>
                  <CardDescription>
                    Showing {filteredAll.length} of {counts.all} tasks
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredAll.length === 0 ? (
                <EmptyState
                  icon={<Search className="h-5 w-5" />}
                  title="No tasks match your filters"
                  description="Try adjusting the priority, date, or search query to find what you're looking for."
                />
              ) : (
                filteredAll.map((t) => <TaskRow key={t.id} task={t} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PENDING */}
        <TabsContent value="pending" className="outline-none">
          <Card className="overflow-hidden border-[#e5e7eb] shadow-none">
            <CardHeader className="border-b border-[#f3f4f6] bg-white">
              <div>
                <CardTitle>Pending</CardTitle>
                <CardDescription>
                  {pending.length} task{pending.length === 1 ? "" : "s"} waiting
                  to be picked up
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {pending.length === 0 ? (
                <EmptyState
                  icon={<Clock className="h-5 w-5" />}
                  title="Nothing pending"
                  description="You're all caught up. New work will land here automatically."
                />
              ) : (
                pending.map((t) => <TaskRow key={t.id} task={t} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* REVIEW */}
        <TabsContent value="review" className="outline-none">
          <Card className="overflow-hidden border-[#e5e7eb] shadow-none">
            <CardHeader className="border-b border-[#f3f4f6] bg-white">
              <div>
                <CardTitle>In review</CardTitle>
                <CardDescription>
                  {review.length} task{review.length === 1 ? "" : "s"} awaiting
                  approval or feedback
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {review.length === 0 ? (
                <EmptyState
                  icon={<Eye className="h-5 w-5" />}
                  title="No tasks in review"
                  description="When teammates submit work for review, those tasks will appear here."
                />
              ) : (
                review.map((t) => <TaskRow key={t.id} task={t} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* COMPLETED */}
        <TabsContent value="completed" className="outline-none">
          <Card className="overflow-hidden border-[#e5e7eb] shadow-none">
            <CardHeader className="border-b border-[#f3f4f6] bg-white">
              <div>
                <CardTitle>Completed</CardTitle>
                <CardDescription>
                  {completed.length} task
                  {completed.length === 1 ? "" : "s"} shipped
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {completed.length === 0 ? (
                <EmptyState
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  title="No completed tasks yet"
                  description="Finish a task and it'll show up here for easy reference."
                />
              ) : (
                completed.map((t) => <TaskRow key={t.id} task={t} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateTaskDialog />
    </div>
  );
}

export default TaskPage;
