import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import { agent } from "../api/agent";

import AlertMessage from "../components/AlertMessage";
import LoadingMessage from "../components/LoadingMessage";

import { getErrorMessage } from "../utils/getErrorMessage";

import type { Intern } from "../interfaces/intern";
import type { TaskItem } from "../interfaces/task";

function InternDetailPage() {
    const { id } = useParams();

    const [intern, setIntern] =
        useState<Intern | null>(null);

    const [tasks, setTasks] =
        useState<TaskItem[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");

    const [isError, setIsError] =
        useState(false);

    useEffect(() => {
        async function loadInternDetail() {
            if (!id) {
                setIsError(true);
                setMessage(
                    "Stajyer bilgisi bulunamadı."
                );
                setIsLoading(false);
                return;
            }

            try {
                const internData =
                    await agent.get<Intern>(
                        `/interns/${id}`
                    );

                const taskData =
                    await agent.get<TaskItem[]>(
                        `/tasks`
                    );

                const internTasks =
                    taskData.filter(
                        (task) =>
                            task.internId ===
                            internData.id
                    );

                setIntern(internData);
                setTasks(internTasks);
            } catch (error) {
                setIsError(true);

                setMessage(
                    getErrorMessage(error)
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadInternDetail();
    }, [id]);

    if (isLoading) {
        return <LoadingMessage />;
    }

    return (
        <div>
            <Link
                to="/interns"
                className="detail-back-link"
            >
                ← Stajyerlere Dön
            </Link>

            <h2>Stajyer Detayı</h2>

            <AlertMessage
                message={message}
                isError={isError}
            />

            {intern && (
                <>
                    <div className="intern-detail-card">
                        <h3>
                            {intern.name} {intern.surname}
                        </h3>

                        <p>
                            <strong>Email:</strong>{" "}
                            {intern.email}
                        </p>

                        <p>
                            <strong>Departman:</strong>{" "}
                            {intern.department?.name ||
                                "Belirtilmemiş"}
                        </p>
                    </div>

                    <h3>Görevleri</h3>

                    {tasks.length === 0 ? (
                        <p>
                            Bu stajyere atanmış görev yok.
                        </p>
                    ) : (
                        tasks.map((task) => (
                            <div
                                className="task-card"
                                key={task.id}
                            >
                                <strong>
                                    {task.title}
                                </strong>

                                {" - "}
                                {task.status}

                                {task.description && (
                                    <p>
                                        {task.description}
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </>
            )}
        </div>
    );
}

export default InternDetailPage;