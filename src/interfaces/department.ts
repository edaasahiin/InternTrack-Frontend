export interface Department {
    id: number;
    name: string;
    isActive: boolean;
}

export interface CreateDepartmentDto {
    name: string;
}