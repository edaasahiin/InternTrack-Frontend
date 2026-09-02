export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    name: string;
    email: string;
    password: string;
    departmentId: number;
}

export interface AuthUser {
    name: string;
    email: string;
    role: string;
}