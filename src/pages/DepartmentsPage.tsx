import {
    useEffect,
    useState
} from "react";

import DepartmentForm from "../components/DepartmentForm";
import DepartmentList from "../components/DepartmentList";
import AlertMessage from "../components/AlertMessage";
import LoadingMessage from "../components/LoadingMessage";

import Modal from "../components/common/Modal";
import SearchToolbar from "../components/common/SearchToolbar";

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

import type {
    Department,
    CreateDepartmentDto
} from "../interfaces/department";

function DepartmentsPage() {
    const [
        departments,
        setDepartments
    ] = useState<Department[]>([]);

    const [
        searchText,
        setSearchText
    ] = useState("");

    const [
        showDepartmentForm,
        setShowDepartmentForm
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

    async function loadDepartments(
        showLoading = true
    ) {
        if (showLoading) {
            setIsLoading(
                true
            );
        }

        setMessage("");
        setIsError(false);

        try {
            const data =
                await departmentService.getAll();

            setDepartments(
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

    useEffect(() => {
        loadDepartments();
    }, []);

    function openDepartmentForm() {
        setMessage("");
        setIsError(false);

        setShowDepartmentForm(
            true
        );
    }

    function closeDepartmentForm() {
        setShowDepartmentForm(
            false
        );
    }

    async function handleAddDepartment(
        name: string
    ) {
        setMessage("");
        setIsError(false);
        setIsSubmitting(true);

        const dto:
            CreateDepartmentDto = {
                name
            };

        try {
            const data =
                await departmentService.create(
                    dto
                );

            await loadDepartments(
                false
            );

            setMessage(
                data?.message ||
                "Departman oluşturuldu."
            );

            closeDepartmentForm();
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

    async function handleUpdateDepartment(
        department: Department,
        newName: string
    ): Promise<boolean> {
        setMessage("");
        setIsError(false);
        setIsUpdating(true);

        const dto:
            CreateDepartmentDto = {
                name:
                    newName
            };

        try {
            const data =
                await departmentService.update(
                    department.id,
                    dto
                );

            await loadDepartments(
                false
            );

            setMessage(
                data?.message ||
                "Departman güncellendi."
            );

            return true;
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(
                    error
                )
            );

            return false;
        } finally {
            setIsUpdating(
                false
            );
        }
    }

    async function handleDeleteDepartment(
        department: Department
    ) {
        setMessage("");
        setIsError(false);

        try {
            await departmentService.delete(
                department.id
            );

            await loadDepartments(
                false
            );

            setMessage(
                "Departman başarıyla silindi."
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

    const filteredDepartments =
        departments.filter(
            (department) => {
                const search =
                    searchText
                        .trim()
                        .toLowerCase();

                if (!search) {
                    return true;
                }

                return department.name
                    .toLowerCase()
                    .includes(
                        search
                    );
            }
        );

    return (
        <div className="departments-page">
            <h2>
                Departmanlar
            </h2>

            <SearchToolbar
                title="Departman Ara"
                searchValue={
                    searchText
                }
                searchPlaceholder="Departman adı yazın"
                onSearchChange={
                    setSearchText
                }
                addButtonText="+ Departman Ekle"
                onAdd={
                    openDepartmentForm
                }
                showAddButton={
                    canManageDepartments
                }
            />

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
                    isUpdating={
                        isUpdating
                    }
                    onUpdate={
                        handleUpdateDepartment
                    }
                    onDelete={
                        handleDeleteDepartment
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
                <DepartmentForm
                    isSubmitting={
                        isSubmitting
                    }
                    onSubmit={
                        handleAddDepartment
                    }
                />
            </Modal>
        </div>
    );
}

export default DepartmentsPage;