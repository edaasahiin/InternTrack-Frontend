import type { TaskItem } from "../interfaces/task";
import { isTaskOverdue } from "./taskUtils";

export type TaskFilter = "All" | "ToDo" | "InProgress" | "Done" | "Overdue";

export function getDashboardTaskFilter(value: string | null): TaskFilter {
    switch (value) {
        case "todo":
            return "ToDo";
        case "progress":
            return "InProgress";
        case "done":
            return "Done";
        case "overdue":
            return "Overdue";
        default:
            return "All";
    }
}

export function matchesTaskFilter(task: TaskItem, filter: TaskFilter): boolean {
    switch (filter) {
        case "ToDo":
        case "InProgress":
            return task.status === filter && !isTaskOverdue(task);
        case "Done":
            return task.status === "Done";
        case "Overdue":
            return isTaskOverdue(task);
        default:
            return true;
    }
}
