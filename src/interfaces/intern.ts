import type { Department } from "./department";

export interface Intern {
    id: number;
    name: string;
    surname: string;
    email: string;
    departmentId: number;
    department?: Department | null;
    userId: number;
}

export interface CreateInternDto {
    name: string;
    surname: string;
    email: string;
    departmentId: number;
}