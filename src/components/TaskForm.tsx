import {
    useState,
    type FormEvent
} from "react";

import type {
    CreateTaskDto
} from "../interfaces/task";

import type {
    Intern
} from "../interfaces/intern";

interface TaskFormProps {
    interns: Intern[];

    canAssignIntern: boolean;

    fixedInternId?: number;

    isSubmitting: boolean;

    onSubmit: (
        task: CreateTaskDto
    ) => Promise<void> | void;
}

function TaskForm({
    interns,
    canAssignIntern,
    fixedInternId,
    isSubmitting,
    onSubmit
}: TaskFormProps) {
    const hasFixedIntern =
        fixedInternId !== undefined;

    const [
        title,
        setTitle
    ] = useState("");

    const [
        description,
        setDescription
    ] = useState("");

    const [
        status,
        setStatus
    ] = useState("ToDo");

    const [
        priority,
        setPriority
    ] = useState("Medium");

    const [
        dueDate,
        setDueDate
    ] = useState("");

    const [
        internId,
        setInternId
    ] = useState("");

    const [
        canInternDeleteWhenCompleted,
        setCanInternDeleteWhenCompleted
    ] = useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const selectedInternId =
            hasFixedIntern
                ? fixedInternId
                : canAssignIntern
                    ? Number(
                        internId
                    )
                    : 0;

        const dueDateUtc =
            dueDate
                ? new Date(
                    dueDate
                ).toISOString()
                : null;

        const newTask:
            CreateTaskDto = {
                title:
                    title.trim(),

                description:
                    description.trim(),

                status,

                priority,

                dueDate:
                    dueDateUtc,

                internId:
                    selectedInternId,

                canInternDeleteWhenCompleted:
                    canAssignIntern
                        ? canInternDeleteWhenCompleted
                        : false
            };

        await onSubmit(
            newTask
        );
    }

    return (
        <form
            onSubmit={
                handleSubmit
            }
        >
            <input
                placeholder="Görev Başlığı"
                value={
                    title
                }
                onChange={(event) =>
                    setTitle(
                        event
                            .target
                            .value
                    )
                }
                required
            />

            <input
                placeholder="Açıklama"
                value={
                    description
                }
                onChange={(event) =>
                    setDescription(
                        event
                            .target
                            .value
                    )
                }
            />

            <select
                value={
                    status
                }
                onChange={(event) =>
                    setStatus(
                        event
                            .target
                            .value
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

            <select
                value={
                    priority
                }
                onChange={(event) =>
                    setPriority(
                        event
                            .target
                            .value
                    )
                }
            >
                <option value="Low">
                    Düşük Öncelik
                </option>

                <option value="Medium">
                    Orta Öncelik
                </option>

                <option value="High">
                    Yüksek Öncelik
                </option>
            </select>

            <div className="task-due-date-field">
                <label
                    htmlFor="task-due-date"
                >
                    Son Teslim Tarihi
                </label>

                <input
                    id="task-due-date"
                    type="datetime-local"
                    value={
                        dueDate
                    }
                    onChange={(event) =>
                        setDueDate(
                            event
                                .target
                                .value
                        )
                    }
                />
            </div>

            {canAssignIntern &&
                !hasFixedIntern && (
                    <select
                        value={
                            internId
                        }
                        onChange={(event) =>
                            setInternId(
                                event
                                    .target
                                    .value
                            )
                        }
                        required
                    >
                        <option value="">
                            Stajyer Seç
                        </option>

                        {interns.map(
                            (
                                intern
                            ) => (
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
                                event
                                    .target
                                    .checked
                            )
                        }
                    />

                    Tamamlandıktan sonra stajyer silebilir
                </label>
            )}

            <button
                type="submit"
                disabled={
                    isSubmitting
                }
            >
                {isSubmitting
                    ? "Ekleniyor..."
                    : "Görev Ekle"}
            </button>
        </form>
    );
}

export default TaskForm;