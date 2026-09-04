export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    name: string;
    surname: string;
    email: string;
    password: string;
    departmentId: number;
}

export interface AuthUser {
    name: string;
    surname: string;
    avatar: string | null;
    email: string;
    role: string;
}

export interface UpdateAvatarDto {
    avatar: string | null;
}