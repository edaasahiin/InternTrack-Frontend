import {
    useEffect,
    useState
} from "react";

import {
    useSearchParams
} from "react-router-dom";

import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import AlertMessage from "../components/AlertMessage";
import LoadingMessage from "../components/LoadingMessage";

import { agent } from "../api/agent";
import { useAuth } from "../context/AuthContext";
import { isAdminOrHR } from "../utils/roleUtils";
import { getErrorMessage } from "../utils/getErrorMessage";

import type {
    TaskItem
} from "../interfaces/task";

type TaskFilter =
    | "All"
    | "ToDo"
    | "InProgress"
    | "Done"
    | "Overdue";

type TaskGroup =
    | "todo"
    | "progress"
    | "overdue"
    | "done";

function TasksPage() {
    const [searchParams] =
        useSearchParams();

    const [tasks, setTasks] =
        useState<TaskItem[]>([]);

    const [filter, setFilter] =
        useState<TaskFilter>("All");

    const [searchText, setSearchText] =
        useState("");

    const [isLoading, setIsLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");

    const [isError, setIsError] =
        useState(false);

    const [
        initialOpenGroups,
        setInitialOpenGroups
    ] = useState<TaskGroup[]>([]);

    const [
        taskListVersion,
        setTaskListVersion
    ] = useState(0);

    const { user } =
        useAuth();

    const canManageTasks =
        isAdminOrHR(user?.role);

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

    async function loadTasks(
        showLoading = true
    ) {
        if (showLoading) {
            setIsLoading(true);
        }

        setMessage("");
        setIsError(false);

        try {
            const data =
                await agent.get<TaskItem[]>(
                    "/tasks"
                );

            setTasks(
                data ?? []
            );
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(error)
            );
        } finally {
            if (showLoading) {
                setIsLoading(false);
            }
        }
    }

    async function handleTaskAdded(
        status: string
    ) {
        await loadTasks(false);

        if (status === "ToDo") {
            setFilter("ToDo");

            setInitialOpenGroups([
                "todo"
            ]);
        } else if (
            status === "InProgress"
        ) {
            setFilter(
                "InProgress"
            );

            setInitialOpenGroups([
                "progress"
            ]);
        } else if (
            status === "Done"
        ) {
            setFilter("Done");

            setInitialOpenGroups([
                "done"
            ]);
        }

        setTaskListVersion(
            (current) =>
                current + 1
        );
    }

    useEffect(() => {
        loadTasks();
    }, []);

    useEffect(() => {
        const dashboardFilter =
            searchParams.get(
                "filter"
            );

        if (
            dashboardFilter ===
            "todo"
        ) {
            setFilter("ToDo");

            setInitialOpenGroups([
                "todo"
            ]);
        } else if (
            dashboardFilter ===
            "progress"
        ) {
            setFilter(
                "InProgress"
            );

            setInitialOpenGroups([
                "progress"
            ]);
        } else if (
            dashboardFilter ===
            "done"
        ) {
            setFilter("Done");

            setInitialOpenGroups([
                "done"
            ]);
        } else if (
            dashboardFilter ===
            "overdue"
        ) {
            setFilter(
                "Overdue"
            );

            setInitialOpenGroups([
                "overdue"
            ]);
        } else {
            setFilter("All");

            setInitialOpenGroups(
                []
            );
        }

        setTaskListVersion(
            (current) =>
                current + 1
        );
    }, [searchParams]);

    const filteredTasks =
        tasks.filter(
            (task) => {
                let matchesStatus =
                    true;

                if (
                    filter === "ToDo"
                ) {
                    matchesStatus =
                        task.status ===
                            "ToDo" &&
                        !isOverdue(
                            task
                        );
                } else if (
                    filter ===
                    "InProgress"
                ) {
                    matchesStatus =
                        task.status ===
                            "InProgress" &&
                        !isOverdue(
                            task
                        );
                } else if (
                    filter === "Done"
                ) {
                    matchesStatus =
                        task.status ===
                        "Done";
                } else if (
                    filter ===
                    "Overdue"
                ) {
                    matchesStatus =
                        isOverdue(
                            task
                        );
                }

                const matchesSearch =
                    task.title
                        .toLowerCase()
                        .includes(
                            searchText
                                .trim()
                                .toLowerCase()
                        );

                return (
                    matchesStatus &&
                    matchesSearch
                );
            }
        );

    useEffect(() => {
        if (isLoading) {
            return;
        }

        const dashboardFilter =
            searchParams.get(
                "filter"
            );

        let targetId:
            string | null = null;

        if (
            dashboardFilter ===
            "todo"
        ) {
            targetId =
                "task-group-todo";
        } else if (
            dashboardFilter ===
            "progress"
        ) {
            targetId =
                "task-group-progress";
        } else if (
            dashboardFilter ===
            "done"
        ) {
            targetId =
                "task-group-done";
        } else if (
            dashboardFilter ===
            "overdue"
        ) {
            targetId =
                "task-group-overdue";
        }

        if (!targetId) {
            return;
        }

        const timer =
            window.setTimeout(
                () => {
                    document
                        .getElementById(
                            targetId
                        )
                        ?.scrollIntoView({
                            behavior:
                                "smooth",

                            block:
                                "start"
                        });
                },
                150
            );

        return () => {
            window.clearTimeout(
                timer
            );
        };
    }, [
        isLoading,
        searchParams,
        taskListVersion
    ]);

    function handleFilterChange(
        newFilter: TaskFilter
    ) {
        setFilter(
            newFilter
        );

        if (
            newFilter === "ToDo"
        ) {
            setInitialOpenGroups([
                "todo"
            ]);
        } else if (
            newFilter ===
            "InProgress"
        ) {
            setInitialOpenGroups([
                "progress"
            ]);
        } else if (
            newFilter === "Done"
        ) {
            setInitialOpenGroups([
                "done"
            ]);
        } else if (
            newFilter ===
            "Overdue"
        ) {
            setInitialOpenGroups([
                "overdue"
            ]);
        } else {
            setInitialOpenGroups(
                []
            );
        }

        setTaskListVersion(
            (current) =>
                current + 1
        );
    }

    return (
        <div>
            <h2>
                {canManageTasks
                    ? "Görevler"
                    : "Görevlerim"}
            </h2>

            <div className="task-search-section">
                <h3>
                    Görev Ara
                </h3>

                <div className="task-filter">
                    <input
                        id="task-search"
                        type="text"
                        placeholder="Görev başlığı yazın"
                        value={
                            searchText
                        }
                        onChange={(event) =>
                            setSearchText(
                                event
                                    .target
                                    .value
                            )
                        }
                    />

                    <select
                        id="task-filter"
                        value={filter}
                        onChange={(event) =>
                            handleFilterChange(
                                event
                                    .target
                                    .value as TaskFilter
                            )
                        }
                    >
                        <option value="All">
                            Tümü
                        </option>

                        <option value="ToDo">
                            Yapılacak
                        </option>

                        <option value="InProgress">
                            Devam Ediyor
                        </option>

                        <option value="Overdue">
                            Geciken
                        </option>

                        <option value="Done">
                            Tamamlandı
                        </option>
                    </select>
                </div>
            </div>

            <TaskForm
                onTaskAdded={
                    handleTaskAdded
                }
            />

            <AlertMessage
                message={message}
                isError={isError}
            />

            {isLoading ? (
                <LoadingMessage />
            ) : (
                <TaskList
                    key={
                        taskListVersion
                    }
                    tasks={
                        filteredTasks
                    }
                    onTaskChanged={() =>
                        loadTasks(false)
                    }
                    canDelete={
                        canManageTasks
                    }
                    initialOpenGroups={
                        initialOpenGroups
                    }
                />
            )}
        </div>
    );
}

export default TasksPage;