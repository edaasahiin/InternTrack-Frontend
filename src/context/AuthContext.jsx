import {
    createContext,
    useContext,
    useState
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        sessionStorage.getItem("token")
    );

    const [user, setUser] = useState(() => {
        const storedUser =
            sessionStorage.getItem("user");

        return storedUser
            ? JSON.parse(storedUser)
            : null;
    });

    const login = (loginResponse) => {
        const userData = {
            name: loginResponse.name,
            email: loginResponse.email,
            role: loginResponse.role
        };

        sessionStorage.setItem(
            "token",
            loginResponse.token
        );

        sessionStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setToken(loginResponse.token);
        setUser(userData);
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    const isAuthenticated = Boolean(token);

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isAuthenticated,
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