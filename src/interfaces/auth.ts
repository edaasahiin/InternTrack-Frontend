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
    mustChangePassword: boolean;
}

export interface UpdateAvatarDto {
    avatar: string | null;
}

export interface UpdateProfileDto {
    name: string;
    surname: string;
    email: string;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}