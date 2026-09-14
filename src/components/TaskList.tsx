import Table from "./common/Table";

import type {
    TableColumn
} from "./common/Table";

import type {
    TaskItem
} from "../interfaces/task";

interface TaskListProps {
    tasks: TaskItem[];

    canDelete: boolean;

    onDelete: (
        task: TaskItem
    ) => Promise<void> | void;

    onStatusChange: (
        task: TaskItem,
        newStatus: string
    ) => Promise<void> | void;

    onPriorityChange: (
        task: TaskItem,
        newPriority: string
    ) => Promise<void> | void;

    onDueDateChange: (
        task: TaskItem,
        newDueDate: string
    ) => Promise<void> | void;
}

function TaskList({
    tasks,
    canDelete,
    onDelete,
    onStatusChange,
    onPriorityChange,
    onDueDateChange
}: TaskListProps) {
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
        date?: string | null
    ) {
        if (!date) {
            return "-";
        }

        return parseDateTime(
            date
        ).toLocaleDateString(
            "tr-TR"
        );
    }

    function formatTime(
        date?: string | null
    ) {
        if (!date) {
            return "-";
        }

        return parseDateTime(
            date
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
        if (status === "ToDo") {
            return "Yapılacak";
        }

        if (
            status ===
            "InProgress"
        ) {
            return "Devam Ediyor";
        }

        if (status === "Done") {
            return "Tamamlandı";
        }

        return status;
    }

    function getPriorityText(
        priority: string
    ) {
        if (priority === "Low") {
            return "Düşük";
        }

        if (
            priority ===
            "Medium"
        ) {
            return "Orta";
        }

        if (
            priority ===
            "High"
        ) {
            return "Yüksek";
        }

        return priority;
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

    function canInternEditTask(
        task: TaskItem
    ) {
        return (
            !canDelete &&
            task.createdByUserId != null &&
            task.createdByUserId ===
                task.intern?.userId
        );
    }

    function canDeleteTask(
        task: TaskItem
    ) {
        const createdByIntern =
            task.createdByUserId != null &&
            task.createdByUserId ===
                task.intern?.userId;

        const completed =
            task.status === "Done";

        return (
            canDelete ||
            createdByIntern ||
            (
                completed &&
                task.canInternDeleteWhenCompleted
            )
        );
    }

    function toDateTimeLocalValue(
        value?: string | null
    ) {
        if (!value) {
            return "";
        }

        const date =
            parseDateTime(
                value
            );

        const offset =
            date.getTimezoneOffset();

        const localDate =
            new Date(
                date.getTime() -
                    offset *
                        60 *
                        1000
            );

        return localDate
            .toISOString()
            .slice(
                0,
                16
            );
    }

    const columns:
        TableColumn<TaskItem>[] = [
            {
                key: "title",

                header: "Başlık",

                render: (task) => (
                    <div className="task-title-cell">
                        <strong>
                            {task.title}
                        </strong>

                        {task.description && (
                            <span
                                className="task-description-preview"
                                title={
                                    task.description
                                }
                            >
                                {
                                    task.description
                                }
                            </span>
                        )}
                    </div>
                )
            },

            {
                key: "status",

                header: "Durum",

                render: (task) => (
                    <div className="task-status-cell">
                        <span
                            className={`task-status-badge status-${task.status.toLowerCase()}`}
                        >
                            {getStatusText(
                                task.status
                            )}
                        </span>

                        {isOverdue(
                            task
                        ) && (
                            <span className="task-overdue-badge">
                                Gecikti
                            </span>
                        )}
                    </div>
                )
            },

            {
                key: "priority",

                header: "Öncelik",

                render: (task) =>
                    canInternEditTask(
                        task
                    ) ? (
                        <select
                            className={`task-priority-select priority-${task.priority.toLowerCase()}`}
                            value={
                                task.priority
                            }
                            onChange={(event) =>
                                onPriorityChange(
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
                            className={`priority-badge priority-${task.priority.toLowerCase()}`}
                        >
                            {getPriorityText(
                                task.priority
                            )}
                        </span>
                    )
            },

            {
                key: "intern",

                header: "Stajyer",

                render: (task) =>
                    task.intern
                        ? `${task.intern.name} ${task.intern.surname}`
                        : "-"
            },

            {
                key: "dueDate",

                header: "Son Tarih",

                render: (task) => {
                    if (
                        !task.dueDate
                    ) {
                        return "-";
                    }

                    if (
                        canInternEditTask(
                            task
                        )
                    ) {
                        return (
                            <input
                                className="task-table-due-date"
                                type="datetime-local"
                                value={
                                    toDateTimeLocalValue(
                                        task.dueDate
                                    )
                                }
                                onChange={(event) =>
                                    onDueDateChange(
                                        task,
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />
                        );
                    }

                    return (
                        <div className="task-date-cell">
                            <span>
                                {formatDate(
                                    task.dueDate
                                )}
                            </span>

                            <span>
                                {formatTime(
                                    task.dueDate
                                )}
                            </span>
                        </div>
                    );
                }
            },

            {
                key: "createdAt",

                header:
                    "Oluşturulma",

                render: (task) => (
                    <div className="task-date-cell">
                        <span>
                            {formatDate(
                                task.createdAt
                            )}
                        </span>

                        <span>
                            {formatTime(
                                task.createdAt
                            )}
                        </span>
                    </div>
                )
            },

            {
                key: "actions",

                header: "İşlemler",

                render: (task) => (
                    <div className="task-table-actions">
                        {task.status ===
                            "ToDo" && (
                            <button
                                type="button"
                                className="task-start-button"
                                onClick={() =>
                                    onStatusChange(
                                        task,
                                        "InProgress"
                                    )
                                }
                            >
                                Başlat
                            </button>
                        )}

                        {task.status ===
                            "InProgress" && (
                            <button
                                type="button"
                                className="task-complete-button"
                                onClick={() =>
                                    onStatusChange(
                                        task,
                                        "Done"
                                    )
                                }
                            >
                                Tamamlandı
                            </button>
                        )}

                        {canDeleteTask(
                            task
                        ) && (
                            <button
                                type="button"
                                className="task-delete-button"
                                onClick={() =>
                                    onDelete(
                                        task
                                    )
                                }
                            >
                                Sil
                            </button>
                        )}
                    </div>
                )
            }
        ];

    return (
        <div>
            <h3>
                Görev Listesi
            </h3>

            <Table<TaskItem>
                data={tasks}
                columns={columns}
                getRowKey={(task) =>
                    task.id
                }
                emptyMessage="Bu filtreye uygun görev bulunamadı."
                rowClassName={(task) =>
                    isOverdue(
                        task
                    )
                        ? "task-row-overdue"
                        : ""
                }
            />
        </div>
    );
}

export default TaskList;