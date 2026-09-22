import {
    useEffect,
    useState,
    type FormEvent
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";

import internService from "../services/internService";
import taskService from "../services/taskService";
import departmentService from "../services/departmentService";

import AlertMessage from "../components/AlertMessage";
import LoadingMessage from "../components/LoadingMessage";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

import Modal from "../components/common/Modal";
import ActiveStatusBadge from "../components/common/ActiveStatusBadge";

import {
    getErrorMessage
} from "../utils/getErrorMessage";

import {
    isAdminOrHR
} from "../utils/roleUtils";

import {
    createTaskUpdatePayload
} from "../utils/taskMapper";

import type {
    Intern,
    UpdateInternDto
} from "../interfaces/intern";

import type {
    Department
} from "../interfaces/department";

import type {
    TaskItem,
    TaskFormData
} from "../interfaces/task";

function InternDetailPage() {
    const { id } =
        useParams();

    const { user } =
        useAuth();

    const canEditIntern =
        isAdminOrHR(
            user?.role
        );

    const isAdmin =
        user?.role === "Admin";

    const [
        intern,
        setIntern
    ] = useState<Intern | null>(
        null
    );

    const [
        tasks,
        setTasks
    ] = useState<TaskItem[]>(
        []
    );

    const [
        departments,
        setDepartments
    ] = useState<Department[]>(
        []
    );

    const [
        name,
        setName
    ] = useState("");

    const [
        surname,
        setSurname
    ] = useState("");

    const [
        email,
        setEmail
    ] = useState("");

    const [
        departmentId,
        setDepartmentId
    ] = useState(0);

    const [
        internIsActive,
        setInternIsActive
    ] = useState(true);

    const [
        showEditModal,
        setShowEditModal
    ] = useState(false);

    const [
        showTaskModal,
        setShowTaskModal
    ] = useState(false);

    const [
        selectedTask,
        setSelectedTask
    ] = useState<TaskItem | null>(
        null
    );

    const [
        isUpdating,
        setIsUpdating
    ] = useState(false);

    const [
        isSubmittingTask,
        setIsSubmittingTask
    ] = useState(false);

    const [
        isLoading,
        setIsLoading
    ] = useState(true);

    const [
        message,
        setMessage
    ] = useState("");

    const [
        isError,
        setIsError
    ] = useState(false);

    const [
        editMessage,
        setEditMessage
    ] = useState("");

    const [
        taskFormMessage,
        setTaskFormMessage
    ] = useState("");

    async function getInternData(
        internId: number
    ) {
        if (isAdmin) {
            const allInterns =
                await internService
                    .getAll(true);

            return (
                allInterns.find(
                    (item) =>
                        item.id ===
                        internId
                ) ?? null
            );
        }

        return await internService
            .getById(
                internId
            );
    }

    async function loadInternDetail(
        showLoading = true
    ) {
        if (!id) {
            setIsError(
                true
            );

            setMessage(
                "Stajyer bilgisi bulunamadı."
            );

            setIsLoading(
                false
            );

            return;
        }

        const internId =
            Number(id);

        if (
            Number.isNaN(
                internId
            )
        ) {
            setIsError(
                true
            );

            setMessage(
                "Geçersiz stajyer bilgisi."
            );

            setIsLoading(
                false
            );

            return;
        }

        if (showLoading) {
            setIsLoading(
                true
            );
        }

        try {
            const [
                internData,
                taskData
            ] =
                await Promise.all([
                    getInternData(
                        internId
                    ),

                    taskService.getAll(isAdmin)
                ]);

            if (!internData) {
                setIntern(
                    null
                );

                setTasks(
                    []
                );

                setIsError(
                    true
                );

                setMessage(
                    "Stajyer bulunamadı."
                );

                return;
            }

            const internTasks =
                taskData.filter(
                    (task) =>
                        task.internId ===
                        internData.id
                );

            setIntern(
                internData
            );

            setTasks(
                internTasks
            );

            setName(
                internData.name
            );

            setSurname(
                internData.surname
            );

            setEmail(
                internData.email
            );

            setDepartmentId(
                internData.departmentId
            );

            setInternIsActive(
                internData.isActive
            );

            if (
                canEditIntern
            ) {
                const departmentData =
                    await departmentService
                        .getAll();

                setDepartments(
                    departmentData ??
                    []
                );
            }
        } catch (error) {
            setIsError(
                true
            );

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

    useEffect(() => {
        loadInternDetail();
    }, [
        id,
        canEditIntern
    ]);

    function openEditModal() {
        if (!intern) {
            return;
        }

        setName(
            intern.name
        );

        setSurname(
            intern.surname
        );

        setEmail(
            intern.email
        );

        setDepartmentId(
            intern.departmentId
        );

        setInternIsActive(
            intern.isActive
        );

        setEditMessage("");

        setShowEditModal(
            true
        );
    }

    function closeEditModal() {
        if (isUpdating) {
            return;
        }

        setEditMessage("");

        setShowEditModal(
            false
        );
    }

    function openCreateTaskModal() {
        setSelectedTask(
            null
        );

        setTaskFormMessage("");

        setShowTaskModal(
            true
        );
    }

    function openEditTaskModal(
        task: TaskItem
    ) {
        setSelectedTask(
            task
        );

        setTaskFormMessage("");

        setShowTaskModal(
            true
        );
    }

    function closeTaskModal() {
        if (isSubmittingTask) {
            return;
        }

        setSelectedTask(
            null
        );

        setTaskFormMessage("");

        setShowTaskModal(
            false
        );
    }

    async function handleUpdateSubmit(
        event:
            FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (
            !id ||
            !intern
        ) {
            return;
        }

        const internId =
            Number(id);

        if (
            Number.isNaN(
                internId
            )
        ) {
            return;
        }

        if (!name.trim()) {
            setEditMessage(
                "Stajyer adı zorunludur."
            );

            return;
        }

        if (!surname.trim()) {
            setEditMessage(
                "Stajyer soyadı zorunludur."
            );

            return;
        }

        if (!email.trim()) {
            setEditMessage(
                "E-posta adresi zorunludur."
            );

            return;
        }

        if (
            departmentId <= 0
        ) {
            setEditMessage(
                "Lütfen bir departman seçin."
            );

            return;
        }

        setEditMessage("");

        setIsUpdating(
            true
        );

        const dto:
            UpdateInternDto = {
                name:
                    name.trim(),

                surname:
                    surname.trim(),

                email:
                    email.trim(),

                departmentId
            };

        try {
            if (
                isAdmin &&
                !intern.isActive
            ) {
                await internService
                    .restore(
                        internId
                    );
            }

            const data =
                await internService
                    .update(
                        internId,
                        dto
                    );

            if (
                isAdmin &&
                !internIsActive
            ) {
                await internService
                    .delete(
                        internId
                    );
            }

            await loadInternDetail(
                false
            );

            setShowEditModal(
                false
            );

            setIsError(
                false
            );

            if (
                isAdmin &&
                intern.isActive !==
                    internIsActive
            ) {
                setMessage(
                    internIsActive
                        ? "Stajyer bilgileri güncellendi ve stajyer aktif hale getirildi."
                        : "Stajyer bilgileri güncellendi ve stajyer pasif hale getirildi."
                );
            } else {
                setMessage(
                    data?.message ||
                    "Stajyer bilgileri başarıyla güncellendi."
                );
            }
        } catch (error) {
            setEditMessage(
                getErrorMessage(
                    error
                )
            );
        } finally {
            setIsUpdating(
                false
            );
        }
    }

    async function handleAddTask(
        newTask: TaskFormData
    ) {
        setTaskFormMessage("");

        setIsSubmittingTask(
            true
        );

        try {
            const data =
                await taskService
                    .create(
                        newTask
                    );

            await loadInternDetail(
                false
            );

            setShowTaskModal(
                false
            );

            setSelectedTask(
                null
            );

            setIsError(
                false
            );

            setMessage(
                data?.message ||
                "Görev başarıyla eklendi."
            );
        } catch (error) {
            setTaskFormMessage(
                getErrorMessage(
                    error
                )
            );
        } finally {
            setIsSubmittingTask(
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

        setTaskFormMessage("");

        setIsSubmittingTask(
            true
        );

        const updateDto =
            createTaskUpdatePayload(
                updatedTask,
                isAdmin
            );

        try {
            const data =
                await taskService
                    .update(
                        selectedTask.id,
                        updateDto
                    );

            await loadInternDetail(
                false
            );

            setShowTaskModal(
                false
            );

            setSelectedTask(
                null
            );

            setIsError(
                false
            );

            setMessage(
                data?.message ||
                "Görev başarıyla güncellendi."
            );
        } catch (error) {
            setTaskFormMessage(
                getErrorMessage(
                    error
                )
            );
        } finally {
            setIsSubmittingTask(
                false
            );
        }
    }

    if (isLoading) {
        return (
            <LoadingMessage />
        );
    }

    return (
        <div className="intern-detail-page">
            <Link
                to="/interns"
                className="detail-back-link"
            >
                ← Stajyerlere Dön
            </Link>

            <div className="intern-detail-page-heading">
                <h2>
                    Stajyer Detayı
                </h2>
            </div>

            <AlertMessage
                message={
                    message
                }
                isError={
                    isError
                }
            />

            {intern && (
                <>
                    <section className="intern-profile-summary">
                        <div className="intern-profile-summary-main">
                            <div className="intern-profile-avatar">
                                {intern.avatar ||
                                intern.name
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div>
                                <div className="intern-profile-title-row">
                                    <h3>
                                        {intern.name}{" "}
                                        {intern.surname}
                                    </h3>

                                    <ActiveStatusBadge isActive={intern.isActive} />
                                </div>

                                <div className="intern-profile-meta">
                                    <span>
                                        <strong>
                                            E-posta
                                        </strong>

                                        {intern.email}
                                    </span>

                                    <span>
                                        <strong>
                                            Departman
                                        </strong>

                                        {intern.department
                                            ?.name ||
                                            "Belirtilmemiş"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {canEditIntern && (
                            <button
                                type="button"
                                className="intern-profile-edit-button"
                                onClick={
                                    openEditModal
                                }
                            >
                                Düzenle
                            </button>
                        )}
                    </section>

                    <section className="intern-detail-tasks-section">
                        <div className="intern-detail-section-heading">
                            <h3>
                                Görevler
                            </h3>

                            {canEditIntern &&
                                intern.isActive && (
                                    <button
                                        type="button"
                                        className="intern-detail-add-task-button"
                                        onClick={
                                            openCreateTaskModal
                                        }
                                    >
                                        + Görev Ekle
                                    </button>
                                )}
                        </div>

                        <TaskList
                            tasks={
                                tasks
                            }
                            canManageTasks={
                                canEditIntern
                            }
                            onEdit={
                                openEditTaskModal
                            }
                        />
                    </section>

                    <Modal
                        isOpen={
                            showEditModal
                        }
                        title="Stajyeri Düzenle"
                        onClose={
                            closeEditModal
                        }
                    >
                        <AlertMessage
                            message={
                                editMessage
                            }
                            isError={true}
                            compact
                        />

                        <form
                            className="intern-detail-edit-form"
                            onSubmit={
                                handleUpdateSubmit
                            }
                            noValidate
                        >
                            <div className="intern-detail-edit-grid">
                                <div className="intern-detail-form-field">
                                    <label
                                        htmlFor="intern-edit-name"
                                    >
                                        Ad
                                    </label>

                                    <input
                                        id="intern-edit-name"
                                        type="text"
                                        value={
                                            name
                                        }
                                        onChange={(event) =>
                                            setName(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />
                                </div>

                                <div className="intern-detail-form-field">
                                    <label
                                        htmlFor="intern-edit-surname"
                                    >
                                        Soyad
                                    </label>

                                    <input
                                        id="intern-edit-surname"
                                        type="text"
                                        value={
                                            surname
                                        }
                                        onChange={(event) =>
                                            setSurname(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />
                                </div>

                                <div className="intern-detail-form-field">
                                    <label
                                        htmlFor="intern-edit-email"
                                    >
                                        E-posta
                                    </label>

                                    <input
                                        id="intern-edit-email"
                                        type="email"
                                        value={
                                            email
                                        }
                                        onChange={(event) =>
                                            setEmail(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />
                                </div>

                                <div className="intern-detail-form-field">
                                    <label
                                        htmlFor="intern-edit-department"
                                    >
                                        Departman
                                    </label>

                                    <select
                                        id="intern-edit-department"
                                        value={
                                            departmentId
                                        }
                                        onChange={(event) =>
                                            setDepartmentId(
                                                Number(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            )
                                        }
                                    >
                                        <option value={0}>
                                            Departman Seç
                                        </option>

                                        {departments.map(
                                            (
                                                department
                                            ) => (
                                                <option
                                                    key={
                                                        department.id
                                                    }
                                                    value={
                                                        department.id
                                                    }
                                                >
                                                    {
                                                        department.name
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                {isAdmin && (
                                    <div className="intern-detail-form-field intern-detail-active-field">
                                        <label
                                            htmlFor="intern-edit-active"
                                        >
                                            Stajyer Aktifliği
                                        </label>

                                        <select
                                            id="intern-edit-active"
                                            value={
                                                internIsActive
                                                    ? "active"
                                                    : "inactive"
                                            }
                                            onChange={(event) =>
                                                setInternIsActive(
                                                    event
                                                        .target
                                                        .value ===
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

                            <div className="intern-detail-edit-footer">
                                <button
                                    type="button"
                                    className="intern-detail-cancel-button"
                                    disabled={
                                        isUpdating
                                    }
                                    onClick={
                                        closeEditModal
                                    }
                                >
                                    İptal
                                </button>

                                <button
                                    type="submit"
                                    className="intern-detail-save-button"
                                    disabled={
                                        isUpdating
                                    }
                                >
                                    {isUpdating
                                        ? "Güncelleniyor..."
                                        : "Değişiklikleri Kaydet"}
                                </button>
                            </div>
                        </form>
                    </Modal>

                    <Modal
                        isOpen={
                            showTaskModal
                        }
                        title={
                            selectedTask
                                ? "Görevi Düzenle"
                                : "Görev Ekle"
                        }
                        onClose={
                            closeTaskModal
                        }
                    >
                        <AlertMessage
                            message={
                                taskFormMessage
                            }
                            isError={true}
                            compact
                        />

                        <TaskForm
                            interns={[]}
                            canAssignIntern={
                                true
                            }
                            fixedInternId={
                                intern.id
                            }
                            canChangeActive={
                                isAdmin
                            }
                            isSubmitting={
                                isSubmittingTask
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
                    </Modal>
                </>
            )}
        </div>
    );
}

export default InternDetailPage;
