import {
    useEffect,
    useState,
    type FormEvent
} from "react";

import { agent } from "../api/agent";
import { useAuth } from "../context/AuthContext";

import AlertMessage from "./AlertMessage";

import { getErrorMessage } from "../utils/getErrorMessage";
import { isAdminOrHR } from "../utils/roleUtils";

import type {
    CreateTaskDto
} from "../interfaces/task";

import type {
    Intern
} from "../interfaces/intern";

interface TaskFormProps {
    onTaskAdded: (
        status: string
    ) => Promise<void> | void;

    fixedInternId?: number;
}

interface MessageResponse {
    message?: string;
}

function TaskForm({
    onTaskAdded,
    fixedInternId
}: TaskFormProps) {
    const { user } = useAuth();

    const canAssignIntern =
        isAdminOrHR(user?.role);

    const hasFixedIntern =
        fixedInternId !== undefined;

    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [status, setStatus] =
        useState("ToDo");

    const [internId, setInternId] =
        useState("");

    const [
        canInternDeleteWhenCompleted,
        setCanInternDeleteWhenCompleted
    ] = useState(false);

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
            if (
                !canAssignIntern ||
                hasFixedIntern
            ) {
                return;
            }

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
    }, [
        canAssignIntern,
        hasFixedIntern
    ]);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setMessage("");
        setIsError(false);
        setIsSubmitting(true);

        const selectedInternId =
            hasFixedIntern
                ? fixedInternId
                : canAssignIntern
                    ? Number(internId)
                    : 0;

        const createdStatus =
            status;

        const newTask: CreateTaskDto = {
            title: title.trim(),
            description:
                description.trim(),
            status,
            internId:
                selectedInternId,
            canInternDeleteWhenCompleted:
                canAssignIntern
                    ? canInternDeleteWhenCompleted
                    : false
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

            setCanInternDeleteWhenCompleted(
                false
            );

            if (!hasFixedIntern) {
                setInternId("");
            }

            await onTaskAdded(
                createdStatus
            );
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
                        Yapılacak
                    </option>

                    <option value="InProgress">
                        Devam Ediyor
                    </option>

                    <option value="Done">
                        Tamamlandı
                    </option>
                </select>

                {canAssignIntern &&
                    !hasFixedIntern && (
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
                                        key={
                                            intern.id
                                        }
                                        value={
                                            intern.id
                                        }
                                    >
                                        {
                                            intern.name
                                        }{" "}
                                        {
                                            intern.surname
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    )}

                {canAssignIntern && (
                    <label className="task-delete-permission">
                        <input
                            type="checkbox"
                            checked={
                                canInternDeleteWhenCompleted
                            }
                            onChange={(event) =>
                                setCanInternDeleteWhenCompleted(
                                    event.target.checked
                                )
                            }
                        />

                        Tamamlandıktan sonra stajyer silebilir
                    </label>
                )}

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