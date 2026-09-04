import {
    useEffect,
    useState
} from "react";

import { Link } from "react-router-dom";

import { agent } from "../api/agent";

import AlertMessage from "../components/AlertMessage";
import LoadingMessage from "../components/LoadingMessage";

import type {
    DashboardStats
} from "../interfaces/dashboard";

import sankoLogo from "../assets/sanko-logo.png";

function HomePage() {
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
                        Stajyer, departman ve görev
                        yönetimi için geliştirilen
                        takip sistemi.
                    </p>
                </div>
            </div>

            <h2>Genel Durum</h2>

            <AlertMessage
                message={message}
                isError={true}
            />

            {isLoading ? (
                <LoadingMessage />
            ) : (
                <div className="dashboard">
                    <div className="dashboard-card">
                        <h3>
                            {stats.internCount}
                        </h3>
                        <p>Stajyer</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>
                            {stats.taskCount}
                        </h3>
                        <p>Toplam Görev</p>
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

                    <div className="dashboard-card">
                        <h3>
                            {
                                stats.departmentCount
                            }
                        </h3>
                        <p>Departman</p>
                    </div>
                </div>
            )}

            <h2>Yönetim</h2>

            <div className="dashboard">
                <Link
                    to="/interns"
                    className="dashboard-card-link"
                >
                    <div className="dashboard-card">
                        <h3>Stajyerler</h3>

                        <p>
                            Stajyer ekleme,
                            listeleme ve silme
                            işlemleri.
                        </p>
                    </div>
                </Link>

                <Link
                    to="/tasks"
                    className="dashboard-card-link"
                >
                    <div className="dashboard-card">
                        <h3>Görevler</h3>

                        <p>
                            Görev oluşturma,
                            durum güncelleme ve
                            silme işlemleri.
                        </p>
                    </div>
                </Link>

                <Link
                    to="/departments"
                    className="dashboard-card-link"
                >
                    <div className="dashboard-card">
                        <h3>Departmanlar</h3>

                        <p>
                            Departman ekleme,
                            listeleme ve silme
                            işlemleri.
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default HomePage;