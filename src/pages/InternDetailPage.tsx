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

import {
    getErrorMessage
} from "../utils/getErrorMessage";

import {
    isAdminOrHR
} from "../utils/roleUtils";

import type {
    Intern,
    UpdateInternDto
} from "../interfaces/intern";

import type {
    Department
} from "../interfaces/department";

import type {
    TaskItem,
    CreateTaskDto
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

    const [
        intern,
        setIntern
    ] = useState<
        Intern | null
    >(null);

    const [
        tasks,
        setTasks
    ] = useState<
        TaskItem[]
    >([]);

    const [
        departments,
        setDepartments
    ] = useState<
        Department[]
    >([]);

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
        isEditing,
        setIsEditing
    ] = useState(false);

    const [
        isUpdating,
        setIsUpdating
    ] = useState(false);

    const [
        isAddingTask,
        setIsAddingTask
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

    async function loadInternDetail(
        showLoading = true
    ) {
        if (!id) {
            setIsError(true);

            setMessage(
                "Stajyer bilgisi bulunamadı."
            );

            setIsLoading(false);

            return;
        }

        const internId =
            Number(id);

        if (
            Number.isNaN(
                internId
            )
        ) {
            setIsError(true);

            setMessage(
                "Geçersiz stajyer bilgisi."
            );

            setIsLoading(false);

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
                    internService.getById(
                        internId
                    ),

                    taskService.getAll()
                ]);

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

            if (
                canEditIntern
            ) {
                const departmentData =
                    await departmentService
                        .getAll();

                setDepartments(
                    departmentData ?? []
                );
            }
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

    useEffect(() => {
        loadInternDetail();
    }, [
        id,
        canEditIntern
    ]);

    function handleEditClick() {
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

        setMessage("");
        setIsError(false);

        setIsEditing(
            true
        );
    }

    function handleCancelEdit() {
        if (intern) {
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
        }

        setMessage("");
        setIsError(false);

        setIsEditing(
            false
        );
    }

    async function handleUpdateSubmit(
        event:
            FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!id) {
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

        setMessage("");
        setIsError(false);
        setIsUpdating(true);

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
            const data =
                await internService.update(
                    internId,
                    dto
                );

            await loadInternDetail(
                false
            );

            setIsEditing(
                false
            );

            setMessage(
                data?.message ||
                "Stajyer bilgileri başarıyla güncellendi."
            );
        } catch (error) {
            setIsError(true);

            setMessage(
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
        newTask: CreateTaskDto
    ) {
        setMessage("");
        setIsError(false);
        setIsAddingTask(true);

        try {
            const data =
                await taskService.create(
                    newTask
                );

            await loadInternDetail(
                false
            );

            setMessage(
                data?.message ||
                "Görev başarıyla eklendi."
            );
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(
                    error
                )
            );
        } finally {
            setIsAddingTask(
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
        <div>
            <Link
                to="/interns"
                className="detail-back-link"
            >
                ← Stajyerlere Dön
            </Link>

            <h2>
                Stajyer Detayı
            </h2>

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
                    <div className="intern-detail-card">
                        <h3>
                            {intern.name}{" "}
                            {intern.surname}
                        </h3>

                        <p>
                            <strong>
                                Email:
                            </strong>{" "}
                            {intern.email}
                        </p>

                        <p>
                            <strong>
                                Departman:
                            </strong>{" "}
                            {intern.department
                                ?.name ||
                                "Belirtilmemiş"}
                        </p>

                        {canEditIntern &&
                            !isEditing && (
                                <button
                                    type="button"
                                    onClick={
                                        handleEditClick
                                    }
                                >
                                    Stajyeri Düzenle
                                </button>
                            )}
                    </div>

                    {canEditIntern &&
                        isEditing && (
                            <div className="intern-edit-section">
                                <h3>
                                    Stajyer Bilgilerini Düzenle
                                </h3>

                                <form
                                    onSubmit={
                                        handleUpdateSubmit
                                    }
                                >
                                    <input
                                        type="text"
                                        placeholder="Ad"
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
                                        required
                                        minLength={2}
                                    />

                                    <input
                                        type="text"
                                        placeholder="Soyad"
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
                                        required
                                        minLength={2}
                                    />

                                    <input
                                        type="email"
                                        placeholder="Email"
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
                                        required
                                    />

                                    <select
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
                                        required
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

                                    <button
                                        type="submit"
                                        disabled={
                                            isUpdating
                                        }
                                    >
                                        {isUpdating
                                            ? "Güncelleniyor..."
                                            : "Kaydet"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleCancelEdit
                                        }
                                        disabled={
                                            isUpdating
                                        }
                                    >
                                        İptal
                                    </button>
                                </form>
                            </div>
                        )}

                    {canEditIntern && (
                        <div className="intern-task-form-section">
                            <h3>
                                Görev Ekle
                            </h3>

                            <TaskForm
                                interns={[]}
                                canAssignIntern={
                                    true
                                }
                                fixedInternId={
                                    intern.id
                                }
                                isSubmitting={
                                    isAddingTask
                                }
                                onSubmit={
                                    handleAddTask
                                }
                            />
                        </div>
                    )}

                    <h3>
                        Görevleri
                    </h3>

                    {tasks.length === 0 ? (
                        <p>
                            Bu stajyere atanmış görev yok.
                        </p>
                    ) : (
                        tasks.map(
                            (task) => (
                                <div
                                    className="task-card"
                                    key={
                                        task.id
                                    }
                                >
                                    <strong>
                                        {
                                            task.title
                                        }
                                    </strong>

                                    {" - "}

                                    {
                                        task.status
                                    }

                                    {task.description && (
                                        <p>
                                            {
                                                task.description
                                            }
                                        </p>
                                    )}
                                </div>
                            )
                        )
                    )}
                </>
            )}
        </div>
    );
}

export default InternDetailPage;