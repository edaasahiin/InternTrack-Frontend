import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Navigate,
    useNavigate
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import InternsPage from "./pages/InternsPage";
import TasksPage from "./pages/TasksPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function AppContent() {
    const navigate = useNavigate();

    const {
        user,
        isAuthenticated,
        isLoading,
        logout
    } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    if (isLoading) {
        return <p>Yükleniyor...</p>;
    }

    if (!isAuthenticated) {
        return (
            <Routes>
                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />
            </Routes>
        );
    }

    return (
        <>
            <nav>
                <Link to="/">
                    Ana Sayfa
                </Link>

                {" | "}

                <Link to="/interns">
                    Stajyerler
                </Link>

                {" | "}

                <Link to="/tasks">
                    Görevler
                </Link>

                {" | "}

                <Link to="/departments">
                    Departmanlar
                </Link>

                {" | "}

                <span>
                    {user?.name}
                </span>

                {" | "}

                <button
                    onClick={handleLogout}
                >
                    Çıkış Yap
                </button>
            </nav>

            <Routes>
                <Route
                    path="/"
                    element={<HomePage />}
                />

                <Route
                    path="/interns"
                    element={
                        <ProtectedRoute>
                            <InternsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <TasksPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/departments"
                    element={
                        <ProtectedRoute>
                            <DepartmentsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/login"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

                <Route
                    path="/register"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />
            </Routes>
 
 
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;