import {
    useEffect,
    useState,
    type FormEvent
} from "react";

import { agent } from "../api/agent";
import AlertMessage from "./AlertMessage";
import { getErrorMessage } from "../utils/getErrorMessage";

import type {
    CreateTaskDto
} from "../interfaces/task";

import type {
    Intern
} from "../interfaces/intern";

interface TaskFormProps {
    onTaskAdded: () => Promise<void> | void;
}

interface MessageResponse {
    message?: string;
}

function TaskForm({
    onTaskAdded
}: TaskFormProps) {
    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [status, setStatus] =
        useState("ToDo");

    const [internId, setInternId] =
        useState("");

    const [interns, setInterns] =
        useState<Intern[]>([]);

    const [message, setMessage] =
        useState("");

    const [isError, setIsError] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    useEffect(() => {
        async function loadInterns() {
            try {
                const data =
                    await agent.get<Intern[]>(
                        "/interns"
                    );

                setInterns(data ?? []);
            } catch (error) {
                setIsError(true);
                setMessage(
                    getErrorMessage(error)
                );
            }
        }

        loadInterns();
    }, []);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setMessage("");
        setIsError(false);
        setIsSubmitting(true);

        const newTask: CreateTaskDto = {
            title,
            description,
            status,
            internId: Number(internId)
        };

        try {
            const data =
                await agent.post<
                    MessageResponse,
                    CreateTaskDto
                >(
                    "/tasks",
                    newTask
                );

            setIsError(false);

            setMessage(
                data?.message ||
                "Görev başarıyla eklendi."
            );

            setTitle("");
            setDescription("");
            setStatus("ToDo");
            setInternId("");

            await onTaskAdded();
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(error)
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <h3>Görev Ekle</h3>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Görev Başlığı"
                    value={title}
                    onChange={(event) =>
                        setTitle(
                            event.target.value
                        )
                    }
                    required
                />

                <input
                    placeholder="Açıklama"
                    value={description}
                    onChange={(event) =>
                        setDescription(
                            event.target.value
                        )
                    }
                />

                <select
                    value={status}
                    onChange={(event) =>
                        setStatus(
                            event.target.value
                        )
                    }
                >
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

                <select
                    value={internId}
                    onChange={(event) =>
                        setInternId(
                            event.target.value
                        )
                    }
                    required
                >
                    <option value="">
                        Stajyer Seç
                    </option>

                    {interns.map(
                        (intern) => (
                            <option
                                key={intern.id}
                                value={intern.id}
                            >
                                {intern.name}
                            </option>
                        )
                    )}
                </select>

                <button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Ekleniyor..."
                        : "Görev Ekle"}
                </button>
            </form>

            <AlertMessage
                message={message}
                isError={isError}
            />
        </div>
    );
}

export default TaskForm;