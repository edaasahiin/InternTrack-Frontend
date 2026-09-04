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

    const { user } = useAuth();

    const canManageTasks =
        isAdminOrHR(user?.role);

    async function loadTasks() {
        setIsLoading(true);
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
            setIsLoading(false);
        }
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
            <h2>Görevler</h2>

            {canManageTasks && (
                <TaskForm
                    onTaskAdded={
                        loadTasks
                    }
                />
            )}

            <div className="task-filter">
                <label htmlFor="task-search">
                    Görev Ara
                </label>

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

                <label htmlFor="task-filter">
                    Durum
                </label>

                <select
                    id="task-filter"
                    value={filter}
                    onChange={(event) => {
                        setFilter(
                            event.target.value as TaskFilter
                        );
                    }}
                >
                    <option value="All">
                        Tümü
                    </option>

                    <option value="ToDo">
                        ToDo
                    </option>

                    <option value="InProgress">
                        In Progress
                    </option>

                    <option value="Done">
                        Done
                    </option>
                </select>
            </div>

            <AlertMessage
                message={message}
                isError={isError}
            />

            {isLoading ? (
                <LoadingMessage />
            ) : (
                <TaskList
                    tasks={filteredTasks}
                    onTaskChanged={
                        loadTasks
                    }
                    canDelete={
                        canManageTasks
                    }
                />
            )}
        </div>
    );
}

export default TasksPage;