import {
    useEffect,
    useState,
    type ReactNode
} from "react";

import {
    Link
} from "react-router-dom";

import dashboardService from "../services/dashboardService";

import {
    useAuth
} from "../context/AuthContext";

import {
    isAdminOrHR
} from "../utils/roleUtils";

import AlertMessage from "../components/AlertMessage";
import LoadingMessage from "../components/LoadingMessage";

import type {
    DashboardStats
} from "../interfaces/dashboard";

interface DashboardCardProps {
    to: string;
    icon: ReactNode;
    value: number;
    label: string;
    className?: string;
}

interface QuickActionCardProps {
    to: string;
    icon: ReactNode;
    title: string;
    description: string;
}

const INITIAL_STATS:
    DashboardStats = {
        internCount: 0,
        taskCount: 0,
        toDoTaskCount: 0,
        inProgressTaskCount: 0,
        completedTaskCount: 0,
        overdueTaskCount: 0,
        departmentCount: 0
    };

function DashboardCard({
    to,
    icon,
    value,
    label,
    className = ""
}: DashboardCardProps) {
    return (
        <Link
            to={to}
            className={[
                "stat-card",
                className
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className="stat-icon">
                {icon}
            </div>

            <div>
                <strong>
                    {value}
                </strong>

                <span>
                    {label}
                </span>
            </div>
        </Link>
    );
}

function QuickActionCard({
    to,
    icon,
    title,
    description
}: QuickActionCardProps) {
    return (
        <Link
            to={to}
            className="quick-action-card"
        >
            <div className="quick-action-icon">
                {icon}
            </div>

            <div>
                <strong>
                    {title}
                </strong>

                <p>
                    {description}
                </p>
            </div>

            <span className="quick-action-arrow">
                →
            </span>
        </Link>
    );
}

function HomePage() {
    const { user } =
        useAuth();

    const canManage =
        isAdminOrHR(
            user?.role
        );

    const [
        stats,
        setStats
    ] = useState<DashboardStats>(
        INITIAL_STATS
    );

    const [
        isLoading,
        setIsLoading
    ] = useState(true);

    const [
        message,
        setMessage
    ] = useState("");

    useEffect(() => {
        async function loadDashboard() {
            try {
                const data =
                    await dashboardService
                        .getStats();

                setStats(
                    data
                );
            } catch {
                setMessage(
                    "Dashboard bilgileri yüklenemedi."
                );
            } finally {
                setIsLoading(
                    false
                );
            }
        }

        loadDashboard();
    }, []);

    const taskLabel =
        canManage
            ? "Toplam Görev"
            : "Görevlerim";

    const taskActionTitle =
        canManage
            ? "Görev Yönetimi"
            : "Görevlerim";

    const taskActionDescription =
        canManage
            ? "Görevleri görüntüle, oluştur ve durumlarını takip et."
            : "Sana atanmış görevleri görüntüle ve durumlarını güncelle.";

    return (
        <div className="home-dashboard">
            <section className="dashboard-welcome">
                <div>
                    <span className="welcome-eyebrow">
                        Dashboard
                    </span>

                    <h1>
                        Hoş geldin,{" "}
                        {user?.name}
                    </h1>

                    <p>
                        {canManage
                            ? "Stajyerlerin, görevlerin ve departmanların genel durumunu buradan takip edebilirsin."
                            : "Görevlerinin güncel durumunu ve ilerlemeni buradan takip edebilirsin."}
                    </p>
                </div>

                <div className="welcome-role">
                    <span>
                        Kullanıcı Rolü
                    </span>

                    <strong>
                        {user?.role}
                    </strong>
                </div>
            </section>

            <AlertMessage
                message={
                    message
                }
                isError={true}
            />

            {isLoading ? (
                <LoadingMessage />
            ) : (
                <>
                    <section className="dashboard-section">
                        <div className="section-heading">
                            <div>
                                <span>
                                    Genel Bakış
                                </span>

                                <h2>
                                    Güncel Durum
                                </h2>
                            </div>

                            <Link
                                to="/tasks"
                                className="section-link"
                            >
                                Tüm görevleri görüntüle →
                            </Link>
                        </div>

                        <div className="stat-grid">
                            {canManage && (
                                <DashboardCard
                                    to="/interns"
                                    icon="♙"
                                    value={
                                        stats.internCount
                                    }
                                    label="Stajyer"
                                />
                            )}

                            <DashboardCard
                                to="/tasks"
                                icon="✓"
                                value={
                                    stats.taskCount
                                }
                                label={
                                    taskLabel
                                }
                            />

                            <DashboardCard
                                to="/tasks?filter=todo"
                                icon="○"
                                value={
                                    stats.toDoTaskCount
                                }
                                label="Yapılacak"
                            />

                            <DashboardCard
                                to="/tasks?filter=progress"
                                icon="◔"
                                value={
                                    stats.inProgressTaskCount
                                }
                                label="Devam Eden"
                            />

                            <DashboardCard
                                to="/tasks?filter=done"
                                icon="✓"
                                value={
                                    stats.completedTaskCount
                                }
                                label="Tamamlanan"
                                className="stat-card-success"
                            />

                            <DashboardCard
                                to="/tasks?filter=overdue"
                                icon="!"
                                value={
                                    stats.overdueTaskCount
                                }
                                label="Geciken"
                                className="stat-card-danger"
                            />

                            {canManage && (
                                <DashboardCard
                                    to="/departments"
                                    icon="◫"
                                    value={
                                        stats.departmentCount
                                    }
                                    label="Departman"
                                />
                            )}
                        </div>
                    </section>

                    <section className="dashboard-section">
                        <div className="section-heading">
                            <div>
                                <span>
                                    Hızlı İşlemler
                                </span>

                                <h2>
                                    Kısayollar
                                </h2>
                            </div>
                        </div>

                        <div className="quick-action-grid">
                            <QuickActionCard
                                to="/tasks"
                                icon="✓"
                                title={
                                    taskActionTitle
                                }
                                description={
                                    taskActionDescription
                                }
                            />

                            {canManage && (
                                <QuickActionCard
                                    to="/interns"
                                    icon="♙"
                                    title="Stajyer Yönetimi"
                                    description="Stajyerleri görüntüle, ekle ve bilgilerini düzenle."
                                />
                            )}

                            {canManage && (
                                <QuickActionCard
                                    to="/departments"
                                    icon="◫"
                                    title="Departman Yönetimi"
                                    description="Departmanları görüntüle ve organizasyon yapısını yönet."
                                />
                            )}

                            <QuickActionCard
                                to="/profile"
                                icon="○"
                                title="Profilim"
                                description="Profil bilgilerini, avatarını ve şifreni yönet."
                            />
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

export default HomePage;
