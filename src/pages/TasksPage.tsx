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

function TasksPage() {
    const [tasks, setTasks] =
        useState<TaskItem[]>([]);

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

            <AlertMessage
                message={message}
                isError={isError}
            />

            {isLoading ? (
                <LoadingMessage />
            ) : (
                <TaskList
                    tasks={tasks}
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