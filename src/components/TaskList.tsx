import { useState } from "react";

import { agent } from "../api/agent";
import AlertMessage from "./AlertMessage";
import { getErrorMessage } from "../utils/getErrorMessage";

import type {
    TaskItem,
    UpdateTaskDto
} from "../interfaces/task";

interface TaskListProps {
    tasks: TaskItem[];
    onTaskChanged: () => Promise<void> | void;
    canDelete: boolean;
}

interface MessageResponse {
    message?: string;
}

function TaskList({
    tasks,
    onTaskChanged,
    canDelete
}: TaskListProps) {
    const [message, setMessage] =
        useState("");

    const [isError, setIsError] =
        useState(false);

    async function deleteTask(
        id: number
    ) {
        setMessage("");
        setIsError(false);

        try {
            await agent.delete<void>(
                `/tasks/${id}`
            );

            setIsError(false);

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
            internId: task.internId
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

            setIsError(false);

            setMessage(
                data?.message ||
                "Görev güncellendi."
            );

            await onTaskChanged();
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(error)
            );
        }
    }

    return (
        <div>
            <h3>Görev Listesi</h3>

            <AlertMessage
                message={message}
                isError={isError}
            />

            {tasks.length === 0 ? (
                <p>Henüz görev yok.</p>
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

                        {" - "}
                        {task.intern?.name}

                        {task.status !== "Done" && (
                            <button
                                onClick={() =>
                                    completeTask(
                                        task
                                    )
                                }
                            >
                                Tamamlandı
                            </button>
                        )}

                        {canDelete && (
                            <button
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
                ))
            )}
        </div>
    );
}

export default TaskList;