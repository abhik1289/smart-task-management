import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title must be at most 120 characters"),
  description: z
    .string()
    .max(5000, "Description is too long")
    .optional()
    .or(z.literal("")),
  assigneeIds: z
    .array(z.string())
    .min(1, "Assign the task to at least one member"),
  priority: z.enum(["high", "medium", "low"]),
  tags: z.array(z.string().min(1).max(24)).max(10, "You can add up to 10 tags"),
  dueDate: z
    .string()
    .optional()
    .refine(
      (v) => !v || !Number.isNaN(Date.parse(v)),
      "Due date must be a valid date",
    ),
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;
