import type { Intern } from "./intern";

export interface TaskItem {
    id: number;
    title: string;
    description?: string | null;
    status: string;
    internId: number;
    intern?: Intern | null;
}

export interface CreateTaskDto {
    title: string;
    description?: string | null;
    status: string;
    internId: number;
}

export interface UpdateTaskDto {
    title: string;
    description?: string | null;
    status: string;
    internId: number;
}