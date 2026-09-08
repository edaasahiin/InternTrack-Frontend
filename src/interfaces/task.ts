import type { Intern } from "./intern";

export interface TaskItem {
    id: number;
    title: string;
    description?: string | null;
    status: string;
    internId: number;
    intern?: Intern | null;
    createdByUserId: number | null;
    canInternDeleteWhenCompleted: boolean;
    createdAt: string;
    completedAt?: string | null;
}

export interface CreateTaskDto {
    title: string;
    description?: string | null;
    status: string;
    internId: number;
    canInternDeleteWhenCompleted: boolean;
}

export interface UpdateTaskDto {
    title: string;
    description?: string | null;
    status: string;
    internId: number;
    canInternDeleteWhenCompleted: boolean;
}