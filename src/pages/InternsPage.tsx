import {
    useEffect,
    useState
} from "react";

import InternForm from "../components/InternForm";
import InternList from "../components/InternList";
import AlertMessage from "../components/AlertMessage";
import LoadingMessage from "../components/LoadingMessage";

import Modal from "../components/common/Modal";
import SearchToolbar from "../components/common/SearchToolbar";

import internService from "../services/internService";
import departmentService from "../services/departmentService";

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
    Intern,
    CreateInternDto
} from "../interfaces/intern";

import type {
    Department
} from "../interfaces/department";

function InternsPage() {
    const [
        interns,
        setInterns
    ] = useState<Intern[]>([]);

    const [
        departments,
        setDepartments
    ] = useState<Department[]>([]);

    const [
        searchText,
        setSearchText
    ] = useState("");

    const [
        isLoading,
        setIsLoading
    ] = useState(true);

    const [
        isSubmitting,
        setIsSubmitting
    ] = useState(false);

    const [
        isLoadingDepartments,
        setIsLoadingDepartments
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
        showInternForm,
        setShowInternForm
    ] = useState(false);

    const { user } =
        useAuth();

    const canManageInterns =
        isAdminOrHR(
            user?.role
        );

    async function loadInterns(
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
            if (showLoading) {
                setIsLoading(
                    false
                );
            }
        }
    }

    async function loadDepartments() {
        setIsLoadingDepartments(
            true
        );

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
            setIsLoadingDepartments(
                false
            );
        }
    }

    async function openInternForm() {
        setMessage("");
        setIsError(false);

        setShowInternForm(
            true
        );

        if (
            departments.length ===
            0
        ) {
            await loadDepartments();
        }
    }

    function closeInternForm() {
        setShowInternForm(
            false
        );
    }

    async function handleAddIntern(
        newIntern: CreateInternDto
    ) {
        setMessage("");
        setIsError(false);
        setIsSubmitting(true);

        try {
            const data =
                await internService.create(
                    newIntern
                );

            await loadInterns(
                false
            );

            setMessage(
                data?.message ||
                "Stajyer başarıyla eklendi."
            );

            closeInternForm();
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

    async function handleDeleteIntern(
        intern: Intern
    ) {
        setMessage("");
        setIsError(false);

        try {
            await internService.delete(
                intern.id
            );

            await loadInterns(
                false
            );

            setMessage(
                "Stajyer başarıyla silindi."
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

    useEffect(() => {
        loadInterns();
    }, []);

    const filteredInterns =
        interns.filter(
            (intern) => {
                const search =
                    searchText
                        .trim()
                        .toLowerCase();

                if (!search) {
                    return true;
                }

                return (
                    intern.name
                        .toLowerCase()
                        .includes(
                            search
                        ) ||
                    intern.surname
                        .toLowerCase()
                        .includes(
                            search
                        ) ||
                    intern.email
                        .toLowerCase()
                        .includes(
                            search
                        ) ||
                    intern.department
                        ?.name
                        ?.toLowerCase()
                        .includes(
                            search
                        )
                );
            }
        );

    return (
        <div className="interns-page">
            <h2>
                Stajyerler
            </h2>

            <SearchToolbar
                title="Stajyer Ara"
                searchValue={
                    searchText
                }
                searchPlaceholder="Ad, soyad, email veya departman"
                onSearchChange={
                    setSearchText
                }
                addButtonText="+ Stajyer Ekle"
                onAdd={
                    openInternForm
                }
                showAddButton={
                    canManageInterns
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
                <InternList
                    interns={
                        filteredInterns
                    }
                    canDelete={
                        canManageInterns
                    }
                    onDelete={
                        handleDeleteIntern
                    }
                />
            )}

            <Modal
                isOpen={
                    showInternForm
                }
                title="Stajyer Ekle"
                onClose={
                    closeInternForm
                }
            >
                {isLoadingDepartments ? (
                    <LoadingMessage />
                ) : (
                    <InternForm
                        departments={
                            departments
                        }
                        isSubmitting={
                            isSubmitting
                        }
                        onSubmit={
                            handleAddIntern
                        }
                    />
                )}
            </Modal>
        </div>
    );
}

export default InternsPage;