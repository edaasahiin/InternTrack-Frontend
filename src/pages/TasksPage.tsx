import {
    useEffect,
    useState
} from "react";

import {
    useSearchParams
} from "react-router-dom";

import TaskForm from "../components/TaskForm";

import type {
    TaskFormData
} from "../components/TaskForm";

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
    matchesActiveFilter,
    normalizeSearchText,
    shouldIncludeInactive,
    type ActiveFilter
} from "../utils/activeFilter";

import {
    isTaskOverdue
} from "../utils/taskUtils";

import {
    createTaskUpdatePayload
} from "../utils/taskMapper";

import {
    getErrorMessage
} from "../utils/getErrorMessage";

import type {
    TaskItem
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
        activeFilter,
        setActiveFilter
    ] = useState<ActiveFilter>(
        "Active"
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
        formMessage,
        setFormMessage
    ] = useState("");

    const [
        showTaskForm,
        setShowTaskForm
    ] = useState(false);

    const [
        selectedTask,
        setSelectedTask
    ] = useState<TaskItem | null>(
        null
    );

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

    const isAdmin =
        user?.role === "Admin";

    async function loadTasks(
        showLoading = true,
        selectedActiveFilter =
            activeFilter
    ) {
        if (showLoading) {
            setIsLoading(
                true
            );
        }

        setMessage("");
        setIsError(false);

        try {
            const includeInactive =
                shouldIncludeInactive(
                    isAdmin,
                    selectedActiveFilter
                );

            const data =
                includeInactive
                    ? await taskService
                        .getAllIncludingInactive()
                    : await taskService
                        .getAll();

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

        try {
            const data =
                await internService.getAll();

            setInterns(
                data ?? []
            );
        } catch (error) {
            setFormMessage(
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

    async function handleActiveFilterChange(
        newFilter: ActiveFilter
    ) {
        setActiveFilter(
            newFilter
        );

        await loadTasks(
            true,
            newFilter
        );
    }

    async function openTaskForm() {
        setMessage("");
        setIsError(false);
        setFormMessage("");

        setSelectedTask(
            null
        );

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

    async function openEditTask(
        task: TaskItem
    ) {
        setMessage("");
        setIsError(false);
        setFormMessage("");

        setSelectedTask(
            task
        );

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

        setSelectedTask(
            null
        );

        setFormMessage("");
    }

    async function handleAddTask(
        newTask: TaskFormData
    ) {
        setFormMessage("");

        setIsSubmitting(
            true
        );

        try {
            const data =
                await taskService.create(
                    newTask
                );

            await loadTasks(
                false
            );

            closeTaskForm();

            setIsError(false);

            setMessage(
                data?.message ||
                "Görev başarıyla eklendi."
            );
        } catch (error) {
            setFormMessage(
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

    async function handleUpdateTask(
        updatedTask: TaskFormData
    ) {
        if (!selectedTask) {
            return;
        }

        setFormMessage("");

        setIsSubmitting(
            true
        );

        const updateDto =
            createTaskUpdatePayload(
                updatedTask,
                isAdmin
            );

        try {
            const oldStatus =
                selectedTask.status;

            const data =
                await taskService.update(
                    selectedTask.id,
                    updateDto
                );

            await loadTasks(
                false
            );

            closeTaskForm();

            setIsError(false);

            setMessage(
                data?.message ||
                "Görev başarıyla güncellendi."
            );

            if (
                oldStatus !== "Done" &&
                updatedTask.status === "Done"
            ) {
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
            setFormMessage(
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

    async function handleToggleTaskActive(
        task: TaskItem
    ) {
        if (!isAdmin) {
            return;
        }

        setMessage("");
        setIsError(false);

        try {
            const data =
                task.isActive
                    ? await taskService
                        .delete(
                            task.id
                        )
                    : await taskService
                        .restore(
                            task.id
                        );

            await loadTasks(
                false
            );

            setMessage(
                data?.message ||
                (
                    task.isActive
                        ? "Görev pasif hale getirildi."
                        : "Görev tekrar aktif hale getirildi."
                )
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

    const normalizedSearch =
        normalizeSearchText(
            searchText
        );

    const filteredTasks =
        tasks.filter(
            (task) => {
                let matchesStatus =
                    true;

                if (filter === "ToDo") {
                    matchesStatus =
                        task.status ===
                            "ToDo" &&
                        !isTaskOverdue(
                            task
                        );
                } else if (
                    filter ===
                    "InProgress"
                ) {
                    matchesStatus =
                        task.status ===
                            "InProgress" &&
                        !isTaskOverdue(
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
                        isTaskOverdue(
                            task
                        );
                }

                const matchesSearch =
                    task.title
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        ) ||
                    (
                        task.description ??
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        );

                return (
                    matchesStatus &&
                    matchesSearch &&
                    matchesActiveFilter(
                        task.isActive,
                        activeFilter
                    )
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
                    </div>
                </div>
            )}

            <div className="tasks-page-heading">
                <h2>
                    {canManageTasks
                        ? "Görevler"
                        : "Görevlerim"}
                </h2>

                <button
                    type="button"
                    className="tasks-page-add-button"
                    onClick={
                        openTaskForm
                    }
                >
                    + Görev Ekle
                </button>
            </div>

            <SearchToolbar
                title="Görev Ara"
                searchValue={
                    searchText
                }
                searchPlaceholder="Görev başlığı veya açıklama yazın"
                onSearchChange={
                    setSearchText
                }
                showAddButton={false}
            >
                <div className="task-toolbar-filter">
                    <label
                        htmlFor="task-filter"
                    >
                        Durum
                    </label>

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
                </div>

                {isAdmin && (
                    <div className="task-toolbar-filter">
                        <label
                            htmlFor="task-active-filter"
                        >
                            Görev Aktifliği
                        </label>

                        <select
                            id="task-active-filter"
                            value={
                                activeFilter
                            }
                            onChange={(event) =>
                                handleActiveFilterChange(
                                    event.target
                                        .value as ActiveFilter
                                )
                            }
                        >
                            <option value="Active">
                                Aktifler
                            </option>

                            <option value="Inactive">
                                Pasifler
                            </option>

                            <option value="All">
                                Tümü
                            </option>
                        </select>
                    </div>
                )}
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
                        canManageTasks={
                            canManageTasks
                        }
                        canToggleActive={
                            isAdmin
                        }
                        onEdit={
                            openEditTask
                        }
                        onToggleActive={
                            handleToggleTaskActive
                        }
                    />
                )}
            </div>

            <Modal
                isOpen={
                    showTaskForm
                }
                title={
                    selectedTask
                        ? "Görevi Düzenle"
                        : "Görev Ekle"
                }
                onClose={
                    closeTaskForm
                }
            >
                <AlertMessage
                    message={
                        formMessage
                    }
                    isError={true}
                    compact
                />

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
                        canChangeActive={
                            isAdmin
                        }
                        isSubmitting={
                            isSubmitting
                        }
                        mode={
                            selectedTask
                                ? "edit"
                                : "create"
                        }
                        initialTask={
                            selectedTask
                        }
                        onSubmit={
                            selectedTask
                                ? handleUpdateTask
                                : handleAddTask
                        }
                    />
                )}
            </Modal>
        </div>
    );
}

export default TasksPage;