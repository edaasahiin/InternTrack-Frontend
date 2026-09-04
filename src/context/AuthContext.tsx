import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react";

import { agent } from "../api/agent";

import type {
    AuthUser,
    UpdateAvatarDto
} from "../interfaces/auth";

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (loginResponse: AuthUser) => void;
    logout: () => Promise<void>;
    updateAvatar: (
        avatar: string | null
    ) => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext =
    createContext<AuthContextType | null>(null);

export function AuthProvider({
    children
}: AuthProviderProps) {
    const [user, setUser] =
        useState<AuthUser | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);

    useEffect(() => {
        async function loadCurrentUser() {
            try {
                const currentUser =
                    await agent.get<AuthUser>(
                        "/auth/me"
                    );

                setUser(currentUser);
            } catch {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        loadCurrentUser();
    }, []);

    const login = (
        loginResponse: AuthUser
    ) => {
        const userData: AuthUser = {
            name: loginResponse.name,
            surname: loginResponse.surname,
            avatar: loginResponse.avatar,
            email: loginResponse.email,
            role: loginResponse.role
        };

        setUser(userData);
    };

    const updateAvatar = async (
        avatar: string | null
    ) => {
        const dto: UpdateAvatarDto = {
            avatar
        };

        await agent.put<
            unknown,
            UpdateAvatarDto
        >(
            "/auth/avatar",
            dto
        );

        setUser((currentUser) => {
            if (!currentUser) {
                return null;
            }

            return {
                ...currentUser,
                avatar
            };
        });
    };

    const logout = async () => {
        try {
            await agent.post<void>(
                "/auth/logout"
            );
        } finally {
            setUser(null);
        }
    };

    const isAuthenticated =
        Boolean(user);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                logout,
                updateAvatar
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth, AuthProvider içerisinde kullanılmalıdır."
        );
    }

    return context;
}