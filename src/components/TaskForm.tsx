import {
    useEffect,
    useState,
    type FormEvent
} from "react";

import ErrorModal from "./ErrorModal";
import { parseDateTime } from "../utils/taskUtils";

import type {
    TaskFormData,
    TaskItem
} from "../interfaces/task";

import type {
    Intern
} from "../interfaces/intern";

type TaskFormMode =
    | "create"
    | "edit";

interface TaskFormProps {
    interns: Intern[];
    canAssignIntern: boolean;
    canChangeActive?: boolean;
    fixedInternId?: number;
    isSubmitting: boolean;
    mode?: TaskFormMode;
    initialTask?: TaskItem | null;

    onSubmit: (
        task: TaskFormData
    ) => Promise<void> | void;
}

const DEFAULT_STATUS = "ToDo";
const DEFAULT_PRIORITY = "Medium";

function toDateTimeLocalValue(
    value?: string | null
): string {
    if (!value) {
        return "";
    }

    const date =
        parseDateTime(value);

    const offset =
        date.getTimezoneOffset();

    const localDate =
        new Date(
            date.getTime() -
                offset * 60 * 1000
        );

    return localDate
        .toISOString()
        .slice(0, 16);
}

function TaskForm({
    interns,
    canAssignIntern,
    canChangeActive = false,
    fixedInternId,
    isSubmitting,
    mode = "create",
    initialTask = null,
    onSubmit
}: TaskFormProps) {
    const isEditMode =
        mode === "edit";

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
    ] = useState(
        DEFAULT_STATUS
    );

    const [
        priority,
        setPriority
    ] = useState(
        DEFAULT_PRIORITY
    );

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

    const [
        isActive,
        setIsActive
    ] = useState(true);

    const [
        validationMessage,
        setValidationMessage
    ] = useState("");

    function resetForm() {
        setTitle("");
        setDescription("");
        setStatus(
            DEFAULT_STATUS
        );
        setPriority(
            DEFAULT_PRIORITY
        );
        setDueDate("");
        setInternId("");
        setCanInternDeleteWhenCompleted(
            false
        );
        setIsActive(true);
        setValidationMessage("");
    }

    function populateForm(
        task: TaskItem
    ) {
        setTitle(task.title);

        setDescription(
            task.description ?? ""
        );

        setStatus(task.status);
        setPriority(task.priority);

        setDueDate(
            toDateTimeLocalValue(
                task.dueDate
            )
        );

        setInternId(
            String(task.internId)
        );

        setCanInternDeleteWhenCompleted(
            task.canInternDeleteWhenCompleted
        );

        setIsActive(
            task.isActive
        );

        setValidationMessage("");
    }

    useEffect(() => {
        if (
            isEditMode &&
            initialTask
        ) {
            populateForm(
                initialTask
            );

            return;
        }

        resetForm();
    }, [
        isEditMode,
        initialTask
    ]);

    function isDueDateInvalid(
        value: string
    ): boolean {
        if (!value) {
            return false;
        }

        const initialDueDate =
            isEditMode
                ? toDateTimeLocalValue(
                    initialTask?.dueDate
                )
                : "";

        const dueDateChanged =
            !isEditMode ||
            value !== initialDueDate;

        if (!dueDateChanged) {
            return false;
        }

        return (
            new Date(
                value
            ).getTime() <
            Date.now()
        );
    }

    function validateDueDate(
        value: string
    ): boolean {
        if (!value) {
            setValidationMessage("");

            return true;
        }

        if (
            isDueDateInvalid(
                value
            )
        ) {
            setValidationMessage(
                "Son teslim tarihi geçmiş bir tarih ve saat olamaz."
            );

            return false;
        }

        setValidationMessage("");

        return true;
    }

    function getSelectedInternId():
        number {
        if (hasFixedIntern) {
            return fixedInternId;
        }

        if (canAssignIntern) {
            return Number(
                internId
            );
        }

        return (
            initialTask?.internId ??
            0
        );
    }

    function createTaskData():
        TaskFormData {
        const task:
            TaskFormData = {
                title:
                    title.trim(),

                description:
                    description.trim(),

                status,

                priority,

                dueDate:
                    dueDate
                        ? new Date(
                            dueDate
                        ).toISOString()
                        : null,

                internId:
                    getSelectedInternId(),

                canInternDeleteWhenCompleted:
                    canAssignIntern
                        ? canInternDeleteWhenCompleted
                        : initialTask
                            ?.canInternDeleteWhenCompleted ??
                            false
            };

        if (
            isEditMode &&
            canChangeActive
        ) {
            task.isActive =
                isActive;
        }

        return task;
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (
            !validateDueDate(
                dueDate
            )
        ) {
            return;
        }

        if (!title.trim()) {
            setValidationMessage(
                "Görev başlığı zorunludur."
            );

            return;
        }

        if (
            canAssignIntern &&
            !hasFixedIntern &&
            !internId
        ) {
            setValidationMessage(
                "Lütfen bir stajyer seçin."
            );

            return;
        }

        setValidationMessage("");

        await onSubmit(
            createTaskData()
        );
    }

    function handleDueDateChange(
        value: string
    ) {
        if (
            isDueDateInvalid(
                value
            )
        ) {
            setValidationMessage(
                "Son teslim tarihi geçmiş bir tarih ve saat olamaz."
            );

            return;
        }

        setDueDate(value);
        setValidationMessage("");
    }

    function getSubmitButtonText():
        string {
        if (isSubmitting) {
            return isEditMode
                ? "Güncelleniyor..."
                : "Ekleniyor...";
        }

        return isEditMode
            ? "Değişiklikleri Kaydet"
            : "Görev Ekle";
    }

    return (
        <>
            <ErrorModal
                message={
                    validationMessage
                }
                onClose={() =>
                    setValidationMessage("")
                }
            />

            <form
                className="task-form"
                onSubmit={
                    handleSubmit
                }
                noValidate
            >
                <div className="task-form-grid">
                    <div className="task-form-field">
                        <label
                            htmlFor="task-title"
                        >
                            Başlık
                        </label>

                        <input
                            id="task-title"
                            type="text"
                            placeholder="Görev başlığı"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <div className="task-form-field">
                        <label
                            htmlFor="task-description"
                        >
                            Açıklama
                        </label>

                        <input
                            id="task-description"
                            type="text"
                            placeholder="Görev açıklaması"
                            value={
                                description
                            }
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <div className="task-form-field">
                        <label
                            htmlFor="task-status"
                        >
                            Görev Durumu
                        </label>

                        <select
                            id="task-status"
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
                    </div>

                    <div className="task-form-field">
                        <label
                            htmlFor="task-priority"
                        >
                            Öncelik
                        </label>

                        <select
                            id="task-priority"
                            value={
                                priority
                            }
                            onChange={(event) =>
                                setPriority(
                                    event.target.value
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
                    </div>

                    {isEditMode && (
                        <div className="task-form-status-action">
                            {status === "ToDo" && (
                                <button
                                    type="button"
                                    className="task-start-button"
                                    onClick={() =>
                                        setStatus(
                                            "InProgress"
                                        )
                                    }
                                >
                                    Başlat
                                </button>
                            )}

                            {status ===
                                "InProgress" && (
                                <button
                                    type="button"
                                    className="task-complete-button"
                                    onClick={() =>
                                        setStatus(
                                            "Done"
                                        )
                                    }
                                >
                                    Tamamlandı
                                </button>
                            )}

                            {status === "Done" && (
                                <span className="task-form-completed-badge">
                                    ✓ Görev Tamamlandı
                                </span>
                            )}
                        </div>
                    )}

                    <div className="task-form-field">
                        <label
                            htmlFor="task-due-date"
                        >
                            Son Teslim Tarihi
                        </label>

                        <input
                            id="task-due-date"
                            type="datetime-local"
                            value={dueDate}
                            onChange={(event) =>
                                handleDueDateChange(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    {canAssignIntern &&
                        !hasFixedIntern && (
                            <div className="task-form-field">
                                <label
                                    htmlFor="task-intern"
                                >
                                    Stajyer
                                </label>

                                <select
                                    id="task-intern"
                                    value={
                                        internId
                                    }
                                    onChange={(event) =>
                                        setInternId(
                                            event.target.value
                                        )
                                    }
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
                            </div>
                        )}

                    {isEditMode &&
                        canChangeActive && (
                            <div className="task-form-field">
                                <label
                                    htmlFor="task-active-status"
                                >
                                    Görev Aktifliği
                                </label>

                                <select
                                    id="task-active-status"
                                    value={
                                        isActive
                                            ? "active"
                                            : "inactive"
                                    }
                                    onChange={(event) =>
                                        setIsActive(
                                            event.target.value ===
                                                "active"
                                        )
                                    }
                                >
                                    <option value="active">
                                        Aktif
                                    </option>

                                    <option value="inactive">
                                        Pasif
                                    </option>
                                </select>
                            </div>
                        )}
                </div>

                {canAssignIntern && (
                    <label className="task-delete-permission task-form-checkbox">
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

                        <span>
                            Tamamlandıktan sonra stajyer silebilir
                        </span>
                    </label>
                )}

                <div className="task-form-footer">
                    <button
                        type="submit"
                        className="task-form-submit-button"
                        disabled={
                            isSubmitting
                        }
                    >
                        {
                            getSubmitButtonText()
                        }
                    </button>
                </div>
            </form>
        </>
    );
}

export default TaskForm;
