import {
    useEffect,
    useState,
    type FormEvent
} from "react";

import DepartmentForm from "../components/DepartmentForm";
import DepartmentList from "../components/DepartmentList";
import AlertMessage from "../components/AlertMessage";
import LoadingMessage from "../components/LoadingMessage";

import Modal from "../components/common/Modal";
import SearchToolbar from "../components/common/SearchToolbar";
import ActiveFilterSelect from "../components/common/ActiveFilterSelect";

import departmentService from "../services/departmentService";

import {
    getErrorMessage
} from "../utils/getErrorMessage";

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

import type {
    Department,
    CreateDepartmentDto
} from "../interfaces/department";

function DepartmentsPage() {
    const [
        departments,
        setDepartments
    ] = useState<Department[]>(
        []
    );

    const [
        searchText,
        setSearchText
    ] = useState("");

    const [
        activeFilter,
        setActiveFilter
    ] = useState<ActiveFilter>(
        "Active"
    );

    const [
        showDepartmentForm,
        setShowDepartmentForm
    ] = useState(false);

    const [
        showEditModal,
        setShowEditModal
    ] = useState(false);

    const [
        selectedDepartment,
        setSelectedDepartment
    ] = useState<Department | null>(
        null
    );

    const [
        editingName,
        setEditingName
    ] = useState("");

    const [
        editingIsActive,
        setEditingIsActive
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
        formMessage,
        setFormMessage
    ] = useState("");

    const [
        editMessage,
        setEditMessage
    ] = useState("");

    const [
        isSubmitting,
        setIsSubmitting
    ] = useState(false);

    const [
        isUpdating,
        setIsUpdating
    ] = useState(false);

    const [
        isLoading,
        setIsLoading
    ] = useState(true);

    const { user } =
        useAuth();

    const canManageDepartments =
        isAdminOrHR(
            user?.role
        );

    const isAdmin =
        user?.role === "Admin";

    async function loadDepartments(
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
                await departmentService.getAll(includeInactive);

            setDepartments(
                data ?? []
            );
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
        loadDepartments();
    }, []);

    async function handleActiveFilterChange(
        newFilter: ActiveFilter
    ) {
        setActiveFilter(
            newFilter
        );

        await loadDepartments(
            true,
            newFilter
        );
    }

    function openDepartmentForm() {
        setMessage("");
        setIsError(false);
        setFormMessage("");

        setShowDepartmentForm(
            true
        );
    }

    function closeDepartmentForm() {
        if (isSubmitting) {
            return;
        }

        setFormMessage("");

        setShowDepartmentForm(
            false
        );
    }

    function openEditModal(
        department: Department
    ) {
        setSelectedDepartment(
            department
        );

        setEditingName(
            department.name
        );

        setEditingIsActive(
            department.isActive
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

        setSelectedDepartment(
            null
        );

        setEditingName("");

        setEditMessage("");

        setShowEditModal(
            false
        );
    }

    async function handleAddDepartment(
        name: string
    ) {
        setFormMessage("");

        setIsSubmitting(
            true
        );

        const dto:
            CreateDepartmentDto = {
                name
            };

        try {
            const data =
                await departmentService
                    .create(
                        dto
                    );

            await loadDepartments(
                false
            );

            closeDepartmentForm();

            setIsError(
                false
            );

            setMessage(
                data?.message ||
                "Departman oluşturuldu."
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

    async function handleUpdateDepartment(
        event:
            FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (
            !selectedDepartment
        ) {
            return;
        }

        const trimmedName =
            editingName.trim();

        if (!trimmedName) {
            setEditMessage(
                "Departman adı zorunludur."
            );

            return;
        }

        setEditMessage("");

        setIsUpdating(
            true
        );

        const dto:
            CreateDepartmentDto = {
                name:
                    trimmedName
            };

        try {
            if (
                !selectedDepartment
                    .isActive
            ) {
                await departmentService
                    .restore(
                        selectedDepartment.id
                    );
            }

            const data =
                await departmentService
                    .update(
                        selectedDepartment.id,
                        dto
                    );

            if (
                isAdmin &&
                !editingIsActive
            ) {
                await departmentService
                    .delete(
                        selectedDepartment.id
                    );
            }

            await loadDepartments(
                false
            );

            closeEditModal();

            setIsError(
                false
            );

            if (
                isAdmin &&
                selectedDepartment
                    .isActive !==
                    editingIsActive
            ) {
                setMessage(
                    editingIsActive
                        ? "Departman güncellendi ve aktif hale getirildi."
                        : "Departman güncellendi ve pasif hale getirildi."
                );
            } else {
                setMessage(
                    data?.message ||
                    "Departman güncellendi."
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

    async function handleToggleDepartmentActive(
        department: Department
    ) {
        if (!isAdmin) {
            return;
        }

        setMessage("");
        setIsError(false);

        try {
            const data =
                department.isActive
                    ? await departmentService
                        .delete(
                            department.id
                        )
                    : await departmentService
                        .restore(
                            department.id
                        );

            await loadDepartments(
                false
            );

            setMessage(
                data?.message ||
                (
                    department.isActive
                        ? "Departman pasif hale getirildi."
                        : "Departman tekrar aktif hale getirildi."
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

    const normalizedSearch =
        normalizeSearchText(
            searchText
        );

    const filteredDepartments =
        departments.filter(
            (department) => {
                const matchesSearch =
                    !normalizedSearch ||
                    department.name
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        );

                return (
                    matchesSearch &&
                    matchesActiveFilter(
                        department.isActive,
                        activeFilter
                    )
                );
            }
        );

    return (
        <div className="departments-page">
            <div className="departments-page-heading">
                <h2>
                    Departmanlar
                </h2>

                {canManageDepartments && (
                    <button
                        type="button"
                        className="departments-page-add-button"
                        onClick={
                            openDepartmentForm
                        }
                    >
                        + Departman Ekle
                    </button>
                )}
            </div>

            <SearchToolbar
                title="Departman Ara"
                searchValue={
                    searchText
                }
                searchPlaceholder="Departman adı yazın"
                onSearchChange={
                    setSearchText
                }
            >
                {isAdmin && (
                    <ActiveFilterSelect
                        id="department-active-filter"
                        label="Departman Aktifliği"
                        className="department-toolbar-filter"
                        value={activeFilter}
                        onChange={handleActiveFilterChange}
                    />
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

            {isLoading ? (
                <LoadingMessage />
            ) : (
                <DepartmentList
                    departments={
                        filteredDepartments
                    }
                    canManage={
                        canManageDepartments
                    }
                    canToggleActive={
                        isAdmin
                    }
                    onEdit={
                        openEditModal
                    }
                    onToggleActive={
                        handleToggleDepartmentActive
                    }
                />
            )}

            <Modal
                isOpen={
                    showDepartmentForm
                }
                title="Departman Ekle"
                onClose={
                    closeDepartmentForm
                }
            >
                <AlertMessage
                    message={
                        formMessage
                    }
                    isError={true}
                    compact
                />

                <DepartmentForm
                    isSubmitting={
                        isSubmitting
                    }
                    onSubmit={
                        handleAddDepartment
                    }
                />
            </Modal>

            <Modal
                isOpen={
                    showEditModal
                }
                title="Departmanı Düzenle"
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
                    className="department-edit-modal-form"
                    onSubmit={
                        handleUpdateDepartment
                    }
                    noValidate
                >
                    <div className="department-edit-modal-grid">
                        <div className="department-edit-modal-field">
                            <label
                                htmlFor="department-edit-name"
                            >
                                Departman Adı
                            </label>

                            <input
                                id="department-edit-name"
                                type="text"
                                value={
                                    editingName
                                }
                                onChange={(event) =>
                                    setEditingName(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                autoFocus
                            />
                        </div>

                        {isAdmin && (
                            <div className="department-edit-modal-field">
                                <label
                                    htmlFor="department-edit-active"
                                >
                                    Departman Aktifliği
                                </label>

                                <select
                                    id="department-edit-active"
                                    value={
                                        editingIsActive
                                            ? "active"
                                            : "inactive"
                                    }
                                    onChange={(event) =>
                                        setEditingIsActive(
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

                    <div className="department-edit-modal-footer">
                        <button
                            type="button"
                            className="department-edit-modal-cancel"
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
        </div>
    );
}

export default DepartmentsPage;
