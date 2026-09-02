import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react";

import { agent } from "../api/agent";
import type { AuthUser } from "../interfaces/auth";

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (loginResponse: AuthUser) => void;
    logout: () => Promise<void>;
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
            email: loginResponse.email,
            role: loginResponse.role
        };

        setUser(userData);
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
                logout
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