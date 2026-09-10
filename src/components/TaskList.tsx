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
    | "done"
    | "overdue";

interface TaskListProps {
    tasks: TaskItem[];

    onTaskChanged:
        () => Promise<void> | void;

    canDelete: boolean;

    initialOpenGroups?:
        TaskGroup[];
}

interface MessageResponse {
    message?: string;
}

function TaskList({
    tasks,
    onTaskChanged,
    canDelete,
    initialOpenGroups = []
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
            initialOpenGroups.includes(
                "todo"
            ),

        progress:
            initialOpenGroups.includes(
                "progress"
            ),

        done:
            initialOpenGroups.includes(
                "done"
            ),

        overdue:
            initialOpenGroups.includes(
                "overdue"
            )
    });

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

    function isOverdue(
        task: TaskItem
    ) {
        if (
            !task.dueDate ||
            task.status === "Done"
        ) {
            return false;
        }

        return (
            parseDateTime(
                task.dueDate
            ).getTime() <
            Date.now()
        );
    }

    const todoTasks =
        tasks.filter(
            (task) =>
                task.status ===
                    "ToDo" &&
                !isOverdue(task)
        );

    const inProgressTasks =
        tasks.filter(
            (task) =>
                task.status ===
                    "InProgress" &&
                !isOverdue(task)
        );

    const doneTasks =
        tasks.filter(
            (task) =>
                task.status ===
                "Done"
        );

    const overdueTasks =
        tasks.filter(
            (task) =>
                isOverdue(task)
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

    function getPriorityText(
        priority: string
    ) {
        switch (priority) {
            case "Low":
                return "Düşük";

            case "Medium":
                return "Orta";

            case "High":
                return "Yüksek";

            default:
                return priority;
        }
    }

    function toDateTimeLocalValue(
        value?: string | null
    ) {
        if (!value) {
            return "";
        }

        const date =
            parseDateTime(value);

        const offset =
            date.getTimezoneOffset();

        const localDate =
            new Date(
                date.getTime() -
                offset * 60 * 1000
            );

        return localDate
            .toISOString()
            .slice(0, 16);
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

            setExpandedTaskId(
                null
            );

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

    async function updatePriority(
        task: TaskItem,
        newPriority: string
    ) {
        setMessage("");
        setIsError(false);

        const updatedTask:
            UpdateTaskDto = {
                title:
                    task.title,

                description:
                    task.description,

                status:
                    task.status,

                priority:
                    newPriority,

                dueDate:
                    task.dueDate,

                internId:
                    task.internId,

                canInternDeleteWhenCompleted:
                    task.canInternDeleteWhenCompleted
            };

        try {
            const data =
                await agent.put<
                    MessageResponse,
                    UpdateTaskDto
                >(
                    `/tasks/${task.id}`,
                    updatedTask
                );

            setMessage(
                data?.message ||
                "Görev önceliği güncellendi."
            );

            await onTaskChanged();
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(error)
            );
        }
    }

    async function updateDueDate(
        task: TaskItem,
        newDueDate: string
    ) {
        setMessage("");
        setIsError(false);

        const dueDateUtc =
            newDueDate
                ? new Date(
                    newDueDate
                ).toISOString()
                : null;

        const updatedTask:
            UpdateTaskDto = {
                title:
                    task.title,

                description:
                    task.description,

                status:
                    task.status,

                priority:
                    task.priority,

                dueDate:
                    dueDateUtc,

                internId:
                    task.internId,

                canInternDeleteWhenCompleted:
                    task.canInternDeleteWhenCompleted
            };

        try {
            const data =
                await agent.put<
                    MessageResponse,
                    UpdateTaskDto
                >(
                    `/tasks/${task.id}`,
                    updatedTask
                );

            setMessage(
                data?.message ||
                "Son teslim tarihi güncellendi."
            );

            await onTaskChanged();
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(error)
            );
        }
    }

    async function changeTaskStatus(
        task: TaskItem,
        newStatus: string
    ) {
        setMessage("");
        setIsError(false);

        const updatedTask:
            UpdateTaskDto = {
                title:
                    task.title,

                description:
                    task.description,

                status:
                    newStatus,

                priority:
                    task.priority,

                dueDate:
                    task.dueDate,

                internId:
                    task.internId,

                canInternDeleteWhenCompleted:
                    task.canInternDeleteWhenCompleted
            };

        try {
            const data =
                await agent.put<
                    MessageResponse,
                    UpdateTaskDto
                >(
                    `/tasks/${task.id}`,
                    updatedTask
                );

            if (
                newStatus ===
                "InProgress"
            ) {
                setMessage(
                    data?.message ||
                    "Görev başlatıldı."
                );

                setOpenGroups(
                    (current) => ({
                        ...current,

                        progress: true
                    })
                );
            }

            if (
                newStatus ===
                "Done"
            ) {
                setIsCelebrating(
                    true
                );

                setMessage(
                    "🎉 Tebrikler! Görev tamamlandı."
                );

                setOpenGroups(
                    (current) => ({
                        ...current,

                        done: true
                    })
                );
            }

            await onTaskChanged();

            if (
                newStatus ===
                "Done"
            ) {
                window.setTimeout(
                    () => {
                        setIsCelebrating(
                            false
                        );
                    },
                    2200
                );
            }
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
            expandedTaskId ===
            task.id;

        const createdByIntern =
            task.createdByUserId !=
                null &&
            task.createdByUserId ===
                task.intern?.userId;

        const isCompleted =
            task.status ===
            "Done";

        const taskIsOverdue =
            isOverdue(task);

        const canDeleteThisTask =
            canDelete ||
            createdByIntern ||
            (
                isCompleted &&
                task.canInternDeleteWhenCompleted
            );

        const canEditOwnTask =
            !canDelete &&
            createdByIntern;

        return (
            <div
                className={`task-card ${
                    taskIsOverdue
                        ? "task-overdue"
                        : ""
                }`}
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

                        {taskIsOverdue && (
                            <span className="task-overdue-badge">
                                Gecikti
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
                                Öncelik:
                            </strong>

                            <span>
                                {canEditOwnTask ? (
                                    <select
                                        className={`task-priority-select priority-${task.priority.toLowerCase()}`}
                                        value={
                                            task.priority
                                        }
                                        onChange={(event) =>
                                            updatePriority(
                                                task,
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    >
                                        <option value="Low">
                                            Düşük
                                        </option>

                                        <option value="Medium">
                                            Orta
                                        </option>

                                        <option value="High">
                                            Yüksek
                                        </option>
                                    </select>
                                ) : (
                                    <span
                                        className={`task-priority-badge priority-${task.priority.toLowerCase()}`}
                                    >
                                        {getPriorityText(
                                            task.priority
                                        )}
                                    </span>
                                )}
                            </span>
                        </p>

                        {task.dueDate && (
                            <p>
                                <strong>
                                    Son Teslim:
                                </strong>

                                <span>
                                    {canEditOwnTask ? (
                                        <input
                                            className="task-due-date-input"
                                            type="datetime-local"
                                            value={
                                                toDateTimeLocalValue(
                                                    task.dueDate
                                                )
                                            }
                                            onChange={(event) =>
                                                updateDueDate(
                                                    task,
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        />
                                    ) : (
                                        <>
                                            {formatDate(
                                                task.dueDate
                                            )}

                                            {" - "}

                                            {formatTime(
                                                task.dueDate
                                            )}

                                            {taskIsOverdue && (
                                                <span className="task-overdue-text">
                                                    {" "}
                                                    (Gecikti)
                                                </span>
                                            )}
                                        </>
                                    )}
                                </span>
                            </p>
                        )}

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
                            {task.status ===
                                "ToDo" && (
                                <button
                                    type="button"
                                    className="task-start-button"
                                    onClick={() =>
                                        changeTaskStatus(
                                            task,
                                            "InProgress"
                                        )
                                    }
                                >
                                    Görevi Başlat
                                </button>
                            )}

                            {task.status ===
                                "InProgress" && (
                                <button
                                    type="button"
                                    className="task-complete-button"
                                    onClick={() =>
                                        changeTaskStatus(
                                            task,
                                            "Done"
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

            <h3>
                Görev Listesi
            </h3>

            <AlertMessage
                message={message}
                isError={isError}
            />

            <div className="task-groups">
                <section
                    id="task-group-todo"
                    className="task-group task-group-todo"
                >
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

                <section
                    id="task-group-progress"
                    className="task-group task-group-progress"
                >
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

                <section
                    id="task-group-done"
                    className="task-group task-group-done"
                >
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

                <section
                    id="task-group-overdue"
                    className="task-group task-group-overdue"
                >
                    <button
                        type="button"
                        className="task-group-header"
                        aria-expanded={
                            openGroups.overdue
                        }
                        onClick={() =>
                            toggleGroup(
                                "overdue"
                            )
                        }
                    >
                        <span className="task-group-title">
                            Gecikenler
                        </span>

                        <span className="task-group-right">
                            <span className="task-group-count">
                                {
                                    overdueTasks.length
                                }
                            </span>

                            <span className="task-group-arrow">
                                {openGroups.overdue
                                    ? "▲"
                                    : "▼"}
                            </span>
                        </span>
                    </button>

                    {openGroups.overdue && (
                        <div className="task-group-content">
                            {overdueTasks.length >
                            0 ? (
                                overdueTasks.map(
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