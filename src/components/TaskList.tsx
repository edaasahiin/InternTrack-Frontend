import { useState } from "react";

import { agent } from "../api/agent";
import AlertMessage from "./AlertMessage";
import { getErrorMessage } from "../utils/getErrorMessage";

import type {
    TaskItem,
    UpdateTaskDto
} from "../interfaces/task";

type TaskGroup =
    | "todo"
    | "progress"
    | "done";

interface TaskListProps {
    tasks: TaskItem[];
    onTaskChanged: () => Promise<void> | void;
    canDelete: boolean;
    initialOpenGroup?: TaskGroup | null;
}

interface MessageResponse {
    message?: string;
}

function TaskList({
    tasks,
    onTaskChanged,
    canDelete,
    initialOpenGroup = null
}: TaskListProps) {
    const [message, setMessage] =
        useState("");

    const [isError, setIsError] =
        useState(false);

    const [
        expandedTaskId,
        setExpandedTaskId
    ] = useState<number | null>(null);

    const [
        isCelebrating,
        setIsCelebrating
    ] = useState(false);

    const [
        openGroups,
        setOpenGroups
    ] = useState({
        todo:
            initialOpenGroup ===
            "todo",

        progress:
            initialOpenGroup ===
            "progress",

        done:
            initialOpenGroup ===
            "done"
    });

    const todoTasks =
        tasks.filter(
            (task) =>
                task.status === "ToDo"
        );

    const inProgressTasks =
        tasks.filter(
            (task) =>
                task.status === "InProgress"
        );

    const doneTasks =
        tasks.filter(
            (task) =>
                task.status === "Done"
        );

    function toggleTask(
        taskId: number
    ) {
        setExpandedTaskId(
            expandedTaskId === taskId
                ? null
                : taskId
        );
    }

    function toggleGroup(
        group: TaskGroup
    ) {
        setOpenGroups(
            (current) => ({
                ...current,
                [group]:
                    !current[group]
            })
        );
    }

    function parseDateTime(
        value: string
    ) {
        const hasTimezone =
            value.endsWith("Z") ||
            /[+-]\d{2}:\d{2}$/.test(
                value
            );

        return new Date(
            hasTimezone
                ? value
                : `${value}Z`
        );
    }

    function formatDate(
        value: string
    ) {
        return parseDateTime(
            value
        ).toLocaleDateString(
            "tr-TR"
        );
    }

    function formatTime(
        value: string
    ) {
        return parseDateTime(
            value
        ).toLocaleTimeString(
            "tr-TR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }

    function getStatusText(
        status: string
    ) {
        switch (status) {
            case "ToDo":
                return "Yapılacak";

            case "InProgress":
                return "Devam Ediyor";

            case "Done":
                return "Tamamlandı";

            default:
                return status;
        }
    }

    async function deleteTask(
        id: number
    ) {
        setMessage("");
        setIsError(false);

        try {
            await agent.delete<void>(
                `/tasks/${id}`
            );

            setExpandedTaskId(null);

            setMessage(
                "Görev başarıyla silindi."
            );

            await onTaskChanged();
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(error)
            );
        }
    }

    async function completeTask(
        task: TaskItem
    ) {
        setMessage("");
        setIsError(false);

        const updatedTask: UpdateTaskDto = {
            title: task.title,
            description: task.description,
            status: "Done",
            internId: task.internId,
            canInternDeleteWhenCompleted:
                task.canInternDeleteWhenCompleted
        };

        try {
            await agent.put<
                MessageResponse,
                UpdateTaskDto
            >(
                `/tasks/${task.id}`,
                updatedTask
            );

            setIsCelebrating(true);

            setMessage(
                "🎉 Tebrikler! Görev tamamlandı."
            );

            setOpenGroups(
                (current) => ({
                    ...current,
                    done: true
                })
            );

            await onTaskChanged();

            window.setTimeout(() => {
                setIsCelebrating(false);
            }, 2200);
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(error)
            );
        }
    }

    function renderTask(
        task: TaskItem
    ) {
        const isExpanded =
            expandedTaskId === task.id;

        const createdByIntern =
            task.createdByUserId != null &&
            task.createdByUserId ===
                task.intern?.userId;

        const isCompleted =
            task.status === "Done";

        const canDeleteThisTask =
            canDelete ||
            createdByIntern ||
            (
                isCompleted &&
                task.canInternDeleteWhenCompleted
            );

        return (
            <div
                className="task-card"
                key={task.id}
            >
                <button
                    type="button"
                    className="task-card-header"
                    aria-expanded={
                        isExpanded
                    }
                    onClick={() =>
                        toggleTask(
                            task.id
                        )
                    }
                >
                    <strong>
                        {task.title}

                        {task.status ===
                            "Done" && (
                            <span className="task-done-icon">
                                ✅
                            </span>
                        )}
                    </strong>

                    <span className="task-card-arrow">
                        {isExpanded
                            ? "▲"
                            : "▼"}
                    </span>
                </button>

                {isExpanded && (
                    <div className="task-card-details">
                        <p>
                            <strong>
                                Açıklama:
                            </strong>

                            <span>
                                {task.description ||
                                    "Açıklama yok."}
                            </span>
                        </p>

                        <p>
                            <strong>
                                Durum:
                            </strong>

                            <span>
                                {getStatusText(
                                    task.status
                                )}
                            </span>
                        </p>

                        <p>
                            <strong>
                                Stajyer:
                            </strong>

                            <span>
                                {task.intern
                                    ? `${task.intern.name} ${task.intern.surname}`
                                    : "Belirtilmemiş"}
                            </span>
                        </p>

                        <p>
                            <strong>
                                Oluşturulma Tarihi:
                            </strong>

                            <span>
                                {formatDate(
                                    task.createdAt
                                )}
                            </span>
                        </p>

                        <p>
                            <strong>
                                Oluşturulma Saati:
                            </strong>

                            <span>
                                {formatTime(
                                    task.createdAt
                                )}
                            </span>
                        </p>

                        {task.completedAt && (
                            <>
                                <p>
                                    <strong>
                                        Tamamlanma Tarihi:
                                    </strong>

                                    <span>
                                        {formatDate(
                                            task.completedAt
                                        )}
                                    </span>
                                </p>

                                <p>
                                    <strong>
                                        Tamamlanma Saati:
                                    </strong>

                                    <span>
                                        {formatTime(
                                            task.completedAt
                                        )}
                                    </span>
                                </p>
                            </>
                        )}

                        {canDelete && (
                            <p>
                                <strong>
                                    Stajyer silme izni:
                                </strong>

                                <span>
                                    {task.canInternDeleteWhenCompleted
                                        ? "Tamamlandıktan sonra silebilir."
                                        : "İzin verilmedi."}
                                </span>
                            </p>
                        )}

                        <div className="task-card-actions">
                            {task.status !==
                                "Done" && (
                                <button
                                    type="button"
                                    className="task-complete-button"
                                    onClick={() =>
                                        completeTask(
                                            task
                                        )
                                    }
                                >
                                    Tamamlandı
                                </button>
                            )}

                            {canDeleteThisTask && (
                                <button
                                    type="button"
                                    className="task-delete-button"
                                    onClick={() =>
                                        deleteTask(
                                            task.id
                                        )
                                    }
                                >
                                    Sil
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            {isCelebrating && (
                <div
                    className="celebration-overlay"
                    aria-live="polite"
                >
                    <div className="celebration-box">
                        <div className="celebration-title">
                            🎉 Görev tamamlandı!
                        </div>

                        <div className="celebration-subtitle">
                            Harika iş! ✨
                        </div>

                        <span className="celebration-confetti celebration-confetti-1">
                            🎉
                        </span>

                        <span className="celebration-confetti celebration-confetti-2">
                            ✨
                        </span>

                        <span className="celebration-confetti celebration-confetti-3">
                            ⭐
                        </span>

                        <span className="celebration-confetti celebration-confetti-4">
                            🎊
                        </span>

                        <span className="celebration-confetti celebration-confetti-5">
                            🌟
                        </span>

                        <span className="celebration-confetti celebration-confetti-6">
                            ✨
                        </span>
                    </div>
                </div>
            )}

            <h3>Görev Listesi</h3>

            <AlertMessage
                message={message}
                isError={isError}
            />

            <div className="task-groups">
                <section className="task-group task-group-todo">
                    <button
                        type="button"
                        className="task-group-header"
                        aria-expanded={
                            openGroups.todo
                        }
                        onClick={() =>
                            toggleGroup(
                                "todo"
                            )
                        }
                    >
                        <span className="task-group-title">
                            Yapılacaklar
                        </span>

                        <span className="task-group-right">
                            <span className="task-group-count">
                                {
                                    todoTasks.length
                                }
                            </span>

                            <span className="task-group-arrow">
                                {openGroups.todo
                                    ? "▲"
                                    : "▼"}
                            </span>
                        </span>
                    </button>

                    {openGroups.todo && (
                        <div className="task-group-content">
                            {todoTasks.length >
                            0 ? (
                                todoTasks.map(
                                    renderTask
                                )
                            ) : (
                                <p className="task-group-empty">
                                    Bu bölümde görev yok.
                                </p>
                            )}
                        </div>
                    )}
                </section>

                <section className="task-group task-group-progress">
                    <button
                        type="button"
                        className="task-group-header"
                        aria-expanded={
                            openGroups.progress
                        }
                        onClick={() =>
                            toggleGroup(
                                "progress"
                            )
                        }
                    >
                        <span className="task-group-title">
                            Devam Edenler
                        </span>

                        <span className="task-group-right">
                            <span className="task-group-count">
                                {
                                    inProgressTasks.length
                                }
                            </span>

                            <span className="task-group-arrow">
                                {openGroups.progress
                                    ? "▲"
                                    : "▼"}
                            </span>
                        </span>
                    </button>

                    {openGroups.progress && (
                        <div className="task-group-content">
                            {inProgressTasks.length >
                            0 ? (
                                inProgressTasks.map(
                                    renderTask
                                )
                            ) : (
                                <p className="task-group-empty">
                                    Bu bölümde görev yok.
                                </p>
                            )}
                        </div>
                    )}
                </section>

                <section className="task-group task-group-done">
                    <button
                        type="button"
                        className="task-group-header"
                        aria-expanded={
                            openGroups.done
                        }
                        onClick={() =>
                            toggleGroup(
                                "done"
                            )
                        }
                    >
                        <span className="task-group-title">
                            Tamamlananlar
                        </span>

                        <span className="task-group-right">
                            <span className="task-group-count">
                                {
                                    doneTasks.length
                                }
                            </span>

                            <span className="task-group-arrow">
                                {openGroups.done
                                    ? "▲"
                                    : "▼"}
                            </span>
                        </span>
                    </button>

                    {openGroups.done && (
                        <div className="task-group-content">
                            {doneTasks.length >
                            0 ? (
                                doneTasks.map(
                                    renderTask
                                )
                            ) : (
                                <p className="task-group-empty">
                                    Bu bölümde görev yok.
                                </p>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default TaskList;