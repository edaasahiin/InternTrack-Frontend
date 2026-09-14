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

import Modal from "../components/common/Modal";
import SearchToolbar from "../components/common/SearchToolbar";

import taskService from "../services/taskService";
import internService from "../services/internService";

import {
    useAuth
} from "../context/AuthContext";

import {
    isAdminOrHR
} from "../utils/roleUtils";

import {
    getErrorMessage
} from "../utils/getErrorMessage";

import type {
    TaskItem,
    CreateTaskDto,
    UpdateTaskDto
} from "../interfaces/task";

import type {
    Intern
} from "../interfaces/intern";

type TaskFilter =
    | "All"
    | "ToDo"
    | "InProgress"
    | "Done"
    | "Overdue";

function TasksPage() {
    const [
        searchParams
    ] = useSearchParams();

    const [
        tasks,
        setTasks
    ] = useState<TaskItem[]>([]);

    const [
        interns,
        setInterns
    ] = useState<Intern[]>([]);

    const [
        filter,
        setFilter
    ] = useState<TaskFilter>(
        "All"
    );

    const [
        searchText,
        setSearchText
    ] = useState("");

    const [
        isLoading,
        setIsLoading
    ] = useState(true);

    const [
        isLoadingInterns,
        setIsLoadingInterns
    ] = useState(false);

    const [
        isSubmitting,
        setIsSubmitting
    ] = useState(false);

    const [
        message,
        setMessage
    ] = useState("");

    const [
        isError,
        setIsError
    ] = useState(false);

    const [
        showTaskForm,
        setShowTaskForm
    ] = useState(false);

    const [
        isCelebrating,
        setIsCelebrating
    ] = useState(false);

    const { user } =
        useAuth();

    const canManageTasks =
        isAdminOrHR(
            user?.role
        );

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

    function createUpdateDto(
        task: TaskItem,
        changes: Partial<
            UpdateTaskDto
        > = {}
    ): UpdateTaskDto {
        return {
            title:
                task.title,

            description:
                task.description,

            status:
                task.status,

            priority:
                task.priority,

            dueDate:
                task.dueDate,

            internId:
                task.internId,

            canInternDeleteWhenCompleted:
                task.canInternDeleteWhenCompleted,

            ...changes
        };
    }

    async function loadTasks(
        showLoading = true
    ) {
        if (showLoading) {
            setIsLoading(
                true
            );
        }

        try {
            const data =
                await taskService.getAll();

            setTasks(
                data ?? []
            );
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(
                    error
                )
            );
        } finally {
            if (showLoading) {
                setIsLoading(
                    false
                );
            }
        }
    }

    async function loadInterns() {
        if (!canManageTasks) {
            return;
        }

        setIsLoadingInterns(
            true
        );

        setMessage("");
        setIsError(false);

        try {
            const data =
                await internService.getAll();

            setInterns(
                data ?? []
            );
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(
                    error
                )
            );
        } finally {
            setIsLoadingInterns(
                false
            );
        }
    }

    async function openTaskForm() {
        setMessage("");
        setIsError(false);

        setShowTaskForm(
            true
        );

        if (
            canManageTasks &&
            interns.length === 0
        ) {
            await loadInterns();
        }
    }

    function closeTaskForm() {
        setShowTaskForm(
            false
        );
    }

    async function handleAddTask(
        newTask: CreateTaskDto
    ) {
        setMessage("");
        setIsError(false);
        setIsSubmitting(true);

        try {
            const data =
                await taskService.create(
                    newTask
                );

            await loadTasks(
                false
            );

            setMessage(
                data?.message ||
                "Görev başarıyla eklendi."
            );

            closeTaskForm();
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(
                    error
                )
            );
        } finally {
            setIsSubmitting(
                false
            );
        }
    }

    async function handleDeleteTask(
        task: TaskItem
    ) {
        setMessage("");
        setIsError(false);

        try {
            await taskService.delete(
                task.id
            );

            await loadTasks(
                false
            );

            setMessage(
                "Görev başarıyla silindi."
            );
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(
                    error
                )
            );
        }
    }

    async function handleStatusChange(
        task: TaskItem,
        newStatus: string
    ) {
        setMessage("");
        setIsError(false);

        const updatedTask =
            createUpdateDto(
                task,
                {
                    status:
                        newStatus
                }
            );

        try {
            const data =
                await taskService.update(
                    task.id,
                    updatedTask
                );

            await loadTasks(
                false
            );

            if (
                newStatus ===
                "InProgress"
            ) {
                setMessage(
                    data?.message ||
                    "Görev başlatıldı."
                );
            }

            if (
                newStatus ===
                "Done"
            ) {
                setMessage(
                    data?.message ||
                    "Görev tamamlandı."
                );

                setIsCelebrating(
                    true
                );

                window.setTimeout(
                    () => {
                        setIsCelebrating(
                            false
                        );
                    },
                    2200
                );
            }
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(
                    error
                )
            );
        }
    }

    async function handlePriorityChange(
        task: TaskItem,
        newPriority: string
    ) {
        setMessage("");
        setIsError(false);

        const updatedTask =
            createUpdateDto(
                task,
                {
                    priority:
                        newPriority
                }
            );

        try {
            const data =
                await taskService.update(
                    task.id,
                    updatedTask
                );

            await loadTasks(
                false
            );

            setMessage(
                data?.message ||
                "Görev önceliği güncellendi."
            );
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(
                    error
                )
            );
        }
    }

    async function handleDueDateChange(
        task: TaskItem,
        newDueDate: string
    ) {
        setMessage("");
        setIsError(false);

        const dueDateUtc =
            newDueDate
                ? new Date(
                    newDueDate
                ).toISOString()
                : null;

        const updatedTask =
            createUpdateDto(
                task,
                {
                    dueDate:
                        dueDateUtc
                }
            );

        try {
            const data =
                await taskService.update(
                    task.id,
                    updatedTask
                );

            await loadTasks(
                false
            );

            setMessage(
                data?.message ||
                "Son teslim tarihi güncellendi."
            );
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(
                    error
                )
            );
        }
    }

    function handleFilterChange(
        newFilter: TaskFilter
    ) {
        setFilter(
            newFilter
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
            setFilter(
                "ToDo"
            );
        } else if (
            dashboardFilter ===
            "progress"
        ) {
            setFilter(
                "InProgress"
            );
        } else if (
            dashboardFilter ===
            "done"
        ) {
            setFilter(
                "Done"
            );
        } else if (
            dashboardFilter ===
            "overdue"
        ) {
            setFilter(
                "Overdue"
            );
        } else {
            setFilter(
                "All"
            );
        }

        if (!dashboardFilter) {
            return;
        }

        const timer =
            window.setTimeout(
                () => {
                    document
                        .getElementById(
                            "task-table-section"
                        )
                        ?.scrollIntoView(
                            {
                                behavior:
                                    "smooth",

                                block:
                                    "start"
                            }
                        );
                },
                150
            );

        return () =>
            window.clearTimeout(
                timer
            );
    }, [
        searchParams,
        isLoading
    ]);

    const filteredTasks =
        tasks.filter(
            (task) => {
                let matchesStatus =
                    true;

                if (
                    filter ===
                    "ToDo"
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
                    filter ===
                    "Done"
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

                const search =
                    searchText
                        .trim()
                        .toLowerCase();

                const matchesSearch =
                    task.title
                        .toLowerCase()
                        .includes(
                            search
                        );

                return (
                    matchesStatus &&
                    matchesSearch
                );
            }
        );

    return (
        <div className="tasks-page">
            {isCelebrating && (
                <div
                    className="celebration-overlay"
                    aria-live="polite"
                >
                    <div className="celebration-box">
                        <div className="celebration-title">
                            🎉 Görev tamamlandı!
                        </div>

                        <div className="celebration-subtitle">
                            Harika iş! ✨
                        </div>

                        <span className="celebration-confetti celebration-confetti-1">
                            🎉
                        </span>

                        <span className="celebration-confetti celebration-confetti-2">
                            ✨
                        </span>

                        <span className="celebration-confetti celebration-confetti-3">
                            ⭐
                        </span>

                        <span className="celebration-confetti celebration-confetti-4">
                            🎊
                        </span>

                        <span className="celebration-confetti celebration-confetti-5">
                            🌟
                        </span>

                        <span className="celebration-confetti celebration-confetti-6">
                            ✨
                        </span>
                    </div>
                </div>
            )}

            <h2>
                {canManageTasks
                    ? "Görevler"
                    : "Görevlerim"}
            </h2>

            <SearchToolbar
                title="Görev Ara"
                searchValue={
                    searchText
                }
                searchPlaceholder="Görev başlığı yazın"
                onSearchChange={
                    setSearchText
                }
                addButtonText="+ Görev Ekle"
                onAdd={
                    openTaskForm
                }
            >
                <select
                    id="task-filter"
                    value={
                        filter
                    }
                    onChange={(event) =>
                        handleFilterChange(
                            event.target
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

                    <option value="Done">
                        Tamamlandı
                    </option>

                    <option value="Overdue">
                        Geciken
                    </option>
                </select>
            </SearchToolbar>

            <AlertMessage
                message={
                    message
                }
                isError={
                    isError
                }
            />

            <div
                id="task-table-section"
                className="task-table-section"
            >
                {isLoading ? (
                    <LoadingMessage />
                ) : (
                    <TaskList
                        tasks={
                            filteredTasks
                        }
                        canDelete={
                            canManageTasks
                        }
                        onDelete={
                            handleDeleteTask
                        }
                        onStatusChange={
                            handleStatusChange
                        }
                        onPriorityChange={
                            handlePriorityChange
                        }
                        onDueDateChange={
                            handleDueDateChange
                        }
                    />
                )}
            </div>

            <Modal
                isOpen={
                    showTaskForm
                }
                title="Görev Ekle"
                onClose={
                    closeTaskForm
                }
            >
                {isLoadingInterns ? (
                    <LoadingMessage />
                ) : (
                    <TaskForm
                        interns={
                            interns
                        }
                        canAssignIntern={
                            canManageTasks
                        }
                        isSubmitting={
                            isSubmitting
                        }
                        onSubmit={
                            handleAddTask
                        }
                    />
                )}
            </Modal>
        </div>
    );
}

export default TasksPage;