import type {
    Intern
} from "./intern";

export interface TaskItem {
    id: number;
    title: string;
    description?: string | null;
    status: string;
    priority: string;
    dueDate?: string | null;
    internId: number;
    intern?: Intern | null;
    createdByUserId: number | null;
    canInternDeleteWhenCompleted: boolean;
    createdAt: string;
    completedAt?: string | null;
    isActive: boolean;
}

export interface CreateTaskDto {
    title: string;
    description?: string | null;
    status: string;
    priority: string;
    dueDate?: string | null;
    internId: number;
    canInternDeleteWhenCompleted: boolean;
}

export interface UpdateTaskDto extends CreateTaskDto {
    isActive?: boolean;
}

export type TaskFormData = UpdateTaskDto;
