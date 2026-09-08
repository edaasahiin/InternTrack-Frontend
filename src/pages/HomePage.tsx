import {
    useEffect,
    useState
} from "react";

import { Link } from "react-router-dom";

import { agent } from "../api/agent";
import { useAuth } from "../context/AuthContext";
import { isAdminOrHR } from "../utils/roleUtils";

import AlertMessage from "../components/AlertMessage";
import LoadingMessage from "../components/LoadingMessage";

import type {
    DashboardStats
} from "../interfaces/dashboard";

import sankoLogo from "../assets/sanko-logo.png";

function HomePage() {
    const { user } = useAuth();

    const canManage =
        isAdminOrHR(user?.role);

    const [stats, setStats] =
        useState<DashboardStats>({
            internCount: 0,
            taskCount: 0,
            completedTaskCount: 0,
            pendingTaskCount: 0,
            departmentCount: 0
        });

    const [isLoading, setIsLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");

    useEffect(() => {
        async function loadDashboard() {
            try {
                const data =
                    await agent.get<DashboardStats>(
                        "/dashboard"
                    );

                setStats(data);
            } catch {
                setMessage(
                    "Dashboard bilgileri yüklenemedi."
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadDashboard();
    }, []);

    return (
        <div>
            <div className="hero">
                <img
                    src={sankoLogo}
                    alt="SANKO Logo"
                    className="company-logo"
                />

                <div>
                    <h1>InternTrack</h1>

                    <p>
                        {canManage
                            ? "Stajyer, departman ve görev yönetimi için geliştirilen takip sistemi."
                            : `Hoş geldin ${user?.name}. Görevlerini ve profilini buradan takip edebilirsin.`}
                    </p>
                </div>
            </div>

            <h2>
                {canManage
                    ? "Genel Durum"
                    : "Görev Durumum"}
            </h2>

            <AlertMessage
                message={message}
                isError={true}
            />

            {isLoading ? (
                <LoadingMessage />
            ) : (
                <div className="dashboard">
                    {canManage && (
                        <div className="dashboard-card">
                            <h3>
                                {stats.internCount}
                            </h3>

                            <p>Stajyer</p>
                        </div>
                    )}

                    <div className="dashboard-card">
                        <h3>
                            {stats.taskCount}
                        </h3>

                        <p>
                            {canManage
                                ? "Toplam Görev"
                                : "Görevlerim"}
                        </p>
                    </div>

                    <div className="dashboard-card">
                        <h3>
                            {
                                stats.completedTaskCount
                            }
                        </h3>

                        <p>
                            Tamamlanan Görev
                        </p>
                    </div>

                    <div className="dashboard-card">
                        <h3>
                            {
                                stats.pendingTaskCount
                            }
                        </h3>

                        <p>
                            Bekleyen Görev
                        </p>
                    </div>

                    {canManage && (
                        <div className="dashboard-card">
                            <h3>
                                {
                                    stats.departmentCount
                                }
                            </h3>

                            <p>Departman</p>
                        </div>
                    )}
                </div>
            )}

            <h2>
                {canManage
                    ? "Yönetim"
                    : "Hızlı Erişim"}
            </h2>

            <div className="dashboard">
                {canManage && (
                    <Link
                        to="/interns"
                        className="dashboard-card-link"
                    >
                        <div className="dashboard-card">
                            <h3>
                                Stajyerler
                            </h3>

                            <p>
                                Stajyer ekleme,
                                listeleme, düzenleme
                                ve silme işlemleri.
                            </p>
                        </div>
                    </Link>
                )}

                <Link
                    to="/tasks"
                    className="dashboard-card-link"
                >
                    <div className="dashboard-card">
                        <h3>
                            {canManage
                                ? "Görevler"
                                : "Görevlerim"}
                        </h3>

                        <p>
                            {canManage
                                ? "Görev oluşturma, durum güncelleme ve silme işlemleri."
                                : "Sana atanmış görevleri görüntüle ve durumlarını takip et."}
                        </p>
                    </div>
                </Link>

                {canManage ? (
                    <Link
                        to="/departments"
                        className="dashboard-card-link"
                    >
                        <div className="dashboard-card">
                            <h3>
                                Departmanlar
                            </h3>

                            <p>
                                Departman ekleme,
                                listeleme ve silme
                                işlemleri.
                            </p>
                        </div>
                    </Link>
                ) : (
                    <Link
                        to="/profile"
                        className="dashboard-card-link"
                    >
                        <div className="dashboard-card">
                            <h3>
                                Profilim
                            </h3>

                            <p>
                                Profil bilgilerini,
                                avatarını ve şifreni
                                yönet.
                            </p>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default HomePage;