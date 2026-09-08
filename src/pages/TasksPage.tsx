import {
    useEffect,
    useState
} from "react";

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
    | "Done";

type TaskGroup =
    | "todo"
    | "progress"
    | "done";

function TasksPage() {
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
        initialOpenGroup,
        setInitialOpenGroup
    ] = useState<TaskGroup | null>(
        null
    );

    const [
        taskListVersion,
        setTaskListVersion
    ] = useState(0);

    const { user } = useAuth();

    const canManageTasks =
        isAdminOrHR(user?.role);

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

            setTasks(data ?? []);
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
            setInitialOpenGroup(
                "todo"
            );
        } else if (
            status === "InProgress"
        ) {
            setInitialOpenGroup(
                "progress"
            );
        } else if (
            status === "Done"
        ) {
            setInitialOpenGroup(
                "done"
            );
        }

        setTaskListVersion(
            (current) =>
                current + 1
        );
    }

    useEffect(() => {
        loadTasks();
    }, []);

    const filteredTasks =
        tasks.filter((task) => {
            const matchesStatus =
                filter === "All" ||
                task.status === filter;

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
        });

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
                        value={searchText}
                        onChange={(event) =>
                            setSearchText(
                                event.target.value
                            )
                        }
                    />

                    <select
                        id="task-filter"
                        value={filter}
                        onChange={(event) =>
                            setFilter(
                                event.target.value as TaskFilter
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
                    initialOpenGroup={
                        initialOpenGroup
                    }
                />
            )}
        </div>
    );
}

export default TasksPage;