import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react";

import authService from "../services/authService";

import type {
    AuthUser,
    UpdateAvatarDto,
    UpdateProfileDto
} from "../interfaces/auth";

interface AuthContextType {
    user: AuthUser | null;

    isAuthenticated: boolean;

    isLoading: boolean;

    login: (
        loginResponse: AuthUser
    ) => void;

    logout: () => Promise<void>;

    updateAvatar: (
        avatar: string | null
    ) => Promise<void>;

    updateProfile: (
        name: string,
        surname: string,
        email: string
    ) => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext =
    createContext<
        AuthContextType | null
    >(null);

export function AuthProvider({
    children
}: AuthProviderProps) {
    const [
        user,
        setUser
    ] = useState<
        AuthUser | null
    >(null);

    const [
        isLoading,
        setIsLoading
    ] = useState(true);

    useEffect(() => {
        async function loadCurrentUser() {
            try {
                const currentUser =
                    await authService
                        .getCurrentUser();

                setUser(
                    currentUser
                );
            } catch {
                setUser(
                    null
                );
            } finally {
                setIsLoading(
                    false
                );
            }
        }

        loadCurrentUser();
    }, []);

    const login = (
        loginResponse: AuthUser
    ) => {
        const userData:
            AuthUser = {
                name:
                    loginResponse.name,

                surname:
                    loginResponse.surname,

                avatar:
                    loginResponse.avatar,

                email:
                    loginResponse.email,

                role:
                    loginResponse.role,

                mustChangePassword:
                    loginResponse
                        .mustChangePassword
            };

        setUser(
            userData
        );
    };

    const updateAvatar =
        async (
            avatar: string | null
        ) => {
            const dto:
                UpdateAvatarDto = {
                    avatar
                };

            await authService
                .updateAvatar(
                    dto
                );

            setUser(
                (
                    currentUser
                ) => {
                    if (
                        !currentUser
                    ) {
                        return null;
                    }

                    return {
                        ...currentUser,
                        avatar
                    };
                }
            );
        };

    const updateProfile =
        async (
            name: string,
            surname: string,
            email: string
        ) => {
            const dto:
                UpdateProfileDto = {
                    name,
                    surname,
                    email
                };

            await authService
                .updateProfile(
                    dto
                );

            setUser(
                (
                    currentUser
                ) => {
                    if (
                        !currentUser
                    ) {
                        return null;
                    }

                    return {
                        ...currentUser,
                        name,
                        surname,
                        email
                    };
                }
            );
        };

    const logout =
        async () => {
            try {
                await authService
                    .logout();
            } finally {
                setUser(
                    null
                );
            }
        };

    const isAuthenticated =
        Boolean(
            user
        );

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                logout,
                updateAvatar,
                updateProfile
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context =
        useContext(
            AuthContext
        );

    if (!context) {
        throw new Error(
            "useAuth, AuthProvider içerisinde kullanılmalıdır."
        );
    }

    return context;
}