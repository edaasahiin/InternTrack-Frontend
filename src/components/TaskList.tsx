import Table from "./common/Table";

import type {
    TableColumn
} from "./common/Table";

import type {
    TaskItem
} from "../interfaces/task";

import {
    formatTaskDate,
    formatTaskTime,
    getTaskPriorityText,
    getTaskStatusText,
    getTextPreview,
    isTaskOverdue
} from "../utils/taskUtils";

interface TaskListProps {
    tasks: TaskItem[];

    canManageTasks: boolean;

    canToggleActive?: boolean;

    onEdit: (
        task: TaskItem
    ) => void;

    onToggleActive?: (
        task: TaskItem
    ) => Promise<void> | void;
}

function TaskList({
    tasks,
    canManageTasks,
    canToggleActive = false,
    onEdit,
    onToggleActive
}: TaskListProps) {
    function isEditDisabled(
        task: TaskItem
    ) {
        return (
            !canManageTasks &&
            isTaskOverdue(task)
        );
    }

    const columns:
        TableColumn<TaskItem>[] = [
            {
                key: "title",

                header: "Başlık",

                render: (task) => (
                    <div className="task-main-info">
                        <strong
                            className="task-title-cell"
                            title={
                                task.title
                            }
                        >
                            {getTextPreview(
                                task.title,
                                14
                            )}
                        </strong>

                        <span
                            className="task-description-under-title"
                            title={
                                task.description ||
                                ""
                            }
                        >
                            {getTextPreview(
                                task.description,
                                16
                            )}
                        </span>
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
                            {getTaskStatusText(
                                task.status
                            )}
                        </span>

                        {isTaskOverdue(
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
                key: "activeStatus",

                header: "Görev Aktifliği",

                render: (task) => (
                    <span
                        className={
                            task.isActive
                                ? "task-active-badge"
                                : "task-inactive-badge"
                        }
                    >
                        {task.isActive
                            ? "Aktif"
                            : "Pasif"}
                    </span>
                )
            },

            {
                key: "priority",

                header: "Öncelik",

                render: (task) => (
                    <span
                        className={`priority-badge priority-${task.priority.toLowerCase()}`}
                    >
                        {getTaskPriorityText(
                            task.priority
                        )}
                    </span>
                )
            },

            {
                key: "intern",

                header: "Stajyer",

                render: (task) => {
                    if (!task.intern) {
                        return "-";
                    }

                    const fullName =
                        `${task.intern.name} ${task.intern.surname}`;

                    const email =
                        task.intern.email ??
                        "";

                    return (
                        <div className="task-intern-info">
                            <span
                                className="task-intern-name"
                                title={
                                    fullName
                                }
                            >
                                {getTextPreview(
                                    fullName,
                                    16
                                )}
                            </span>

                            <span
                                className="task-intern-email"
                                title={
                                    email
                                }
                            >
                                {getTextPreview(
                                    email,
                                    18
                                )}
                            </span>
                        </div>
                    );
                }
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

                    return (
                        <div className="task-date-cell">
                            <span>
                                {formatTaskDate(
                                    task.dueDate
                                )}
                            </span>

                            <span>
                                {formatTaskTime(
                                    task.dueDate
                                )}
                            </span>
                        </div>
                    );
                }
            },

            {
                key: "actions",

                header: "İşlemler",

                render: (task) => {
                    const editDisabled =
                        isEditDisabled(
                            task
                        );

                    return (
                        <div className="task-table-actions">
                            <button
                                type="button"
                                className="task-edit-button"
                                disabled={
                                    editDisabled
                                }
                                title={
                                    editDisabled
                                        ? "Son teslim tarihi geçmiş görevler stajyer tarafından düzenlenemez."
                                        : "Görevi düzenle"
                                }
                                onClick={() => {
                                    if (
                                        editDisabled
                                    ) {
                                        return;
                                    }

                                    onEdit(
                                        task
                                    );
                                }}
                            >
                                Düzenle
                            </button>

                            {canToggleActive && onToggleActive && (
                                <button
                                    type="button"
                                    className={
                                        task.isActive
                                            ? "task-delete-button"
                                            : "task-restore-button"
                                    }
                                    onClick={() =>
                                        onToggleActive(
                                            task
                                        )
                                    }
                                >
                                    {task.isActive
                                        ? "Pasif Et"
                                        : "Aktif Et"}
                                </button>
                            )}
                        </div>
                    );
                }
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
                    [
                        !task.isActive
                            ? "task-row-inactive"
                            : "",

                        isTaskOverdue(task)
                            ? "task-row-overdue"
                            : ""
                    ]
                        .filter(Boolean)
                        .join(" ")
                }
            />
        </div>
    );
}

export default TaskList;