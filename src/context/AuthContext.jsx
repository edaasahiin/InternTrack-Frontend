import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadCurrentUser() {
            try {
                const currentUser =
                    await api.get("/auth/me");

                setUser(currentUser);
            } catch {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        loadCurrentUser();
    }, []);

    const login = (loginResponse) => {
        const userData = {
            name: loginResponse.name,
            email: loginResponse.email,
            role: loginResponse.role
        };

        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            setUser(null);
        }
    };

    const isAuthenticated = Boolean(user);

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
    return useContext(AuthContext);
}