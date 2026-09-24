import apiService from "../api/apiService";
import { API_BASE_URL } from "../api/apiConfig";

import type {
    AuthUser,
    LoginDto,
    RegisterDto,
    ChangePasswordDto,
    UpdateAvatarDto,
    UpdateProfileDto
} from "../interfaces/auth";

const authService = {
    getCurrentUser(): Promise<AuthUser> {
        return apiService.get<AuthUser>(
            "/auth/me"
        );
    },

    login(
        dto: LoginDto
    ): Promise<AuthUser> {
        return apiService.post<
            AuthUser,
            LoginDto
        >(
            "/auth/login",
            dto
        );
    },

    register(
        dto: RegisterDto
    ): Promise<void> {
        return apiService.post<
            void,
            RegisterDto
        >(
            "/auth/register",
            dto
        );
    },

    changePassword(
        dto: ChangePasswordDto
    ): Promise<void> {
        return apiService.put<
            void,
            ChangePasswordDto
        >(
            "/auth/change-password",
            dto
        );
    },

    updateAvatar(
        dto: UpdateAvatarDto
    ): Promise<void> {
        return apiService.put<
            void,
            UpdateAvatarDto
        >(
            "/auth/avatar",
            dto
        );
    },

    updateProfile(
        dto: UpdateProfileDto
    ): Promise<void> {
        return apiService.put<
            void,
            UpdateProfileDto
        >(
            "/auth/profile",
            dto
        );
    },

    async logout(): Promise<void> {
        const response =
            await fetch(
                `${API_BASE_URL}/auth/logout`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

        if (!response.ok) {
            throw new Error(
                "Çıkış işlemi gerçekleştirilemedi."
            );
        }
    }
};

export default authService;
