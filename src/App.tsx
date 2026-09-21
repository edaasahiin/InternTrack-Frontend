import {
    useState
} from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    NavLink,
    Navigate,
    useNavigate,
    type NavLinkRenderProps
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import InternsPage from "./pages/InternsPage";
import InternDetailPage from "./pages/InternDetailPage";
import TasksPage from "./pages/TasksPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import ProfilePage from "./pages/ProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import Modal from "./components/common/Modal";

import {
    useAuth
} from "./context/AuthContext";

import {
    isAdminOrHR
} from "./utils/roleUtils";

import sankoLogo from "./assets/sanko-logo.png";

import "./styles/app-layout.css";

function getSidebarLinkClassName({
    isActive
}: NavLinkRenderProps): string {
    return isActive
        ? "sidebar-link active"
        : "sidebar-link";
}

function AppContent() {
    const navigate =
        useNavigate();

    const [
        isSidebarCollapsed,
        setIsSidebarCollapsed
    ] = useState(false);

    const [
        showLogoutConfirm,
        setShowLogoutConfirm
    ] = useState(false);

    const [
        isLoggingOut,
        setIsLoggingOut
    ] = useState(false);

    const {
        user,
        isAuthenticated,
        isLoading,
        logout
    } = useAuth();

    const canManage =
        isAdminOrHR(
            user?.role
        );

    const defaultAvatar =
        user?.name
            ?.charAt(0)
            .toUpperCase() ||
        "?";

    const currentAvatar =
        user?.avatar ||
        defaultAvatar;

    const taskNavigationLabel =
        canManage
            ? "Görevler"
            : "Görevlerim";

    function handleLogoutClick() {
        setShowLogoutConfirm(
            true
        );
    }

    function handleLogoutCancel() {
        if (isLoggingOut) {
            return;
        }

        setShowLogoutConfirm(
            false
        );
    }

    async function handleLogoutConfirm() {
        try {
            setIsLoggingOut(
                true
            );

            await logout();

            setShowLogoutConfirm(
                false
            );

            navigate(
                "/login"
            );
        } finally {
            setIsLoggingOut(
                false
            );
        }
    }

    function toggleSidebar() {
        setIsSidebarCollapsed(
            (current) =>
                !current
        );
    }

    if (isLoading) {
        return (
            <div className="app-loading">
                Yükleniyor...
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Routes>
                <Route
                    path="/login"
                    element={
                        <LoginPage />
                    }
                />

                <Route
                    path="/register"
                    element={
                        <RegisterPage />
                    }
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

    if (
        user?.mustChangePassword
    ) {
        return (
            <Routes>
                <Route
                    path="/change-password"
                    element={
                        <ChangePasswordPage />
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/change-password"
                            replace
                        />
                    }
                />
            </Routes>
        );
    }

    return (
        <>
            <div
                className={[
                    "app-shell",
                    isSidebarCollapsed
                        ? "sidebar-collapsed"
                        : ""
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                <aside className="app-sidebar">
                    <div className="sidebar-top">
                        <div className="sidebar-brand">
                            <img
                                src={sankoLogo}
                                alt="SANKO Logo"
                                className="sidebar-logo"
                            />

                            {!isSidebarCollapsed && (
                                <div className="sidebar-brand-text">
                                    <strong>
                                        InternTrack
                                    </strong>

                                    <span>
                                        Internship Management
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            className="sidebar-toggle"
                            onClick={
                                toggleSidebar
                            }
                            title={
                                isSidebarCollapsed
                                    ? "Menüyü aç"
                                    : "Menüyü kapat"
                            }
                            aria-label={
                                isSidebarCollapsed
                                    ? "Menüyü aç"
                                    : "Menüyü kapat"
                            }
                        >
                            {isSidebarCollapsed
                                ? "›"
                                : "‹"}
                        </button>
                    </div>

                    <nav className="sidebar-navigation">
                        <NavLink
                            to="/"
                            end
                            title="Dashboard"
                            className={
                                getSidebarLinkClassName
                            }
                        >
                            <span className="sidebar-icon">
                                ⌂
                            </span>

                            {!isSidebarCollapsed && (
                                <span className="sidebar-link-text">
                                    Dashboard
                                </span>
                            )}
                        </NavLink>

                        <NavLink
                            to="/tasks"
                            title={
                                taskNavigationLabel
                            }
                            className={
                                getSidebarLinkClassName
                            }
                        >
                            <span className="sidebar-icon">
                                ✓
                            </span>

                            {!isSidebarCollapsed && (
                                <span className="sidebar-link-text">
                                    {
                                        taskNavigationLabel
                                    }
                                </span>
                            )}
                        </NavLink>

                        {canManage && (
                            <NavLink
                                to="/interns"
                                title="Stajyerler"
                                className={
                                    getSidebarLinkClassName
                                }
                            >
                                <span className="sidebar-icon">
                                    ♙
                                </span>

                                {!isSidebarCollapsed && (
                                    <span className="sidebar-link-text">
                                        Stajyerler
                                    </span>
                                )}
                            </NavLink>
                        )}

                        {canManage && (
                            <NavLink
                                to="/departments"
                                title="Departmanlar"
                                className={
                                    getSidebarLinkClassName
                                }
                            >
                                <span className="sidebar-icon">
                                    ◫
                                </span>

                                {!isSidebarCollapsed && (
                                    <span className="sidebar-link-text">
                                        Departmanlar
                                    </span>
                                )}
                            </NavLink>
                        )}

                        <NavLink
                            to="/profile"
                            title="Profilim"
                            className={
                                getSidebarLinkClassName
                            }
                        >
                            <span className="sidebar-icon">
                                ○
                            </span>

                            {!isSidebarCollapsed && (
                                <span className="sidebar-link-text">
                                    Profilim
                                </span>
                            )}
                        </NavLink>
                    </nav>

                    <div className="sidebar-footer">
                        <div className="sidebar-user">
                            <div className="sidebar-avatar">
                                {
                                    currentAvatar
                                }
                            </div>

                            {!isSidebarCollapsed && (
                                <div className="sidebar-user-info">
                                    <strong>
                                        {user?.name}{" "}
                                        {user?.surname}
                                    </strong>

                                    <span>
                                        {
                                            user?.role
                                        }
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            className="sidebar-logout"
                            onClick={
                                handleLogoutClick
                            }
                            title="Çıkış Yap"
                        >
                            <span>
                                ↪
                            </span>

                            {!isSidebarCollapsed && (
                                <span>
                                    Çıkış Yap
                                </span>
                            )}
                        </button>
                    </div>
                </aside>

                <main className="app-main">
                    <header className="app-topbar">
                        <div>
                            <span className="topbar-label">
                                InternTrack
                            </span>

                            <strong>
                                Staj Yönetim Sistemi
                            </strong>
                        </div>

                        <div className="topbar-right-area">
                            <NavLink
                                to="/profile"
                                className="topbar-profile"
                            >
                                <div className="topbar-avatar">
                                    {
                                        currentAvatar
                                    }
                                </div>

                                <div className="topbar-profile-info">
                                    <strong>
                                        {user?.name}{" "}
                                        {user?.surname}
                                    </strong>

                                    <span>
                                        {
                                            user?.role
                                        }
                                    </span>
                                </div>
                            </NavLink>

                            <div className="topbar-sanko-brand">
                                <img
                                    src={sankoLogo}
                                    alt="SANKO Logo"
                                    className="topbar-sanko-logo"
                                />
                            </div>
                        </div>
                    </header>

                    <div className="app-content">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <HomePage />
                                }
                            />

                            <Route
                                path="/interns"
                                element={
                                    canManage ? (
                                        <InternsPage />
                                    ) : (
                                        <Navigate
                                            to="/"
                                            replace
                                        />
                                    )
                                }
                            />

                            <Route
                                path="/interns/:id"
                                element={
                                    canManage ? (
                                        <InternDetailPage />
                                    ) : (
                                        <Navigate
                                            to="/"
                                            replace
                                        />
                                    )
                                }
                            />

                            <Route
                                path="/tasks"
                                element={
                                    <TasksPage />
                                }
                            />

                            <Route
                                path="/departments"
                                element={
                                    canManage ? (
                                        <DepartmentsPage />
                                    ) : (
                                        <Navigate
                                            to="/"
                                            replace
                                        />
                                    )
                                }
                            />

                            <Route
                                path="/profile"
                                element={
                                    <ProfilePage />
                                }
                            />

                            <Route
                                path="/change-password"
                                element={
                                    <ChangePasswordPage />
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
                    </div>
                </main>
            </div>

            <Modal
                isOpen={
                    showLogoutConfirm
                }
                title="Çıkış Yap"
                onClose={
                    handleLogoutCancel
                }
            >
                <div className="logout-confirm">
                    <div className="logout-confirm-icon">
                        !
                    </div>

                    <h3 className="logout-confirm-title">
                        Çıkış yapmak istediğinize
                        emin misiniz?
                    </h3>

                    <p className="logout-confirm-description">
                        Oturumunuz
                        sonlandırılacak ve
                        giriş ekranına
                        yönlendirileceksiniz.
                    </p>

                    <div className="logout-confirm-actions">
                        <button
                            type="button"
                            className="intern-detail-cancel-button"
                            disabled={
                                isLoggingOut
                            }
                            onClick={
                                handleLogoutCancel
                            }
                        >
                            Vazgeç
                        </button>

                        <button
                            type="button"
                            className="intern-detail-save-button"
                            disabled={
                                isLoggingOut
                            }
                            onClick={
                                handleLogoutConfirm
                            }
                        >
                            {isLoggingOut
                                ? "Çıkış Yapılıyor..."
                                : "Evet, Çıkış Yap"}
                        </button>
                    </div>
                </div>
            </Modal>
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
