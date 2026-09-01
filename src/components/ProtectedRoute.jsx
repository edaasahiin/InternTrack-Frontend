import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    const {
        isAuthenticated,
        isLoading
    } = useAuth();

    if (isLoading) {
        return <p>Yükleniyor...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;