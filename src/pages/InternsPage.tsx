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
import ActiveFilterSelect from "../components/common/ActiveFilterSelect";

import internService from "../services/internService";
import departmentService from "../services/departmentService";

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
        activeFilter,
        setActiveFilter
    ] = useState<ActiveFilter>(
        "Active"
    );

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

    const isAdmin =
        user?.role === "Admin";

    async function loadInterns(
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
                await internService.getAll(includeInactive);

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
                await departmentService
                    .getAll();

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

    async function handleActiveFilterChange(
        newFilter: ActiveFilter
    ) {
        setActiveFilter(
            newFilter
        );

        await loadInterns(
            true,
            newFilter
        );
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

        setIsSubmitting(
            true
        );

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

    async function handleToggleInternActive(
        intern: Intern
    ) {
        if (!isAdmin) {
            return;
        }

        setMessage("");
        setIsError(false);

        try {
            const data =
                intern.isActive
                    ? await internService
                        .delete(
                            intern.id
                        )
                    : await internService
                        .restore(
                            intern.id
                        );

            await loadInterns(
                false
            );

            setMessage(
                data?.message ||
                (
                    intern.isActive
                        ? "Stajyer pasif hale getirildi."
                        : "Stajyer tekrar aktif hale getirildi."
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

    useEffect(() => {
        loadInterns();
    }, []);

    const normalizedSearch =
        normalizeSearchText(
            searchText
        );

    const filteredInterns =
        interns.filter(
            (intern) => {
                const matchesSearch =
                    !normalizedSearch ||
                    intern.name
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        ) ||
                    intern.surname
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        ) ||
                    intern.email
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        ) ||
                    intern.department
                        ?.name
                        ?.toLowerCase()
                        .includes(
                            normalizedSearch
                        );

                return (
                    matchesSearch &&
                    matchesActiveFilter(
                        intern.isActive,
                        activeFilter
                    )
                );
            }
        );

    return (
        <div className="interns-page">
            <div className="interns-page-heading">
                <h2>
                    Stajyerler
                </h2>

                {canManageInterns && (
                    <button
                        type="button"
                        className="interns-page-add-button"
                        onClick={
                            openInternForm
                        }
                    >
                        + Stajyer Ekle
                    </button>
                )}
            </div>

            <SearchToolbar
                title="Stajyer Ara"
                searchValue={
                    searchText
                }
                searchPlaceholder="Ad, soyad, email veya departman"
                onSearchChange={
                    setSearchText
                }
            >
                {isAdmin && (
                    <ActiveFilterSelect
                        id="intern-active-filter"
                        label="Stajyer Aktifliği"
                        className="intern-toolbar-filter"
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
                <InternList
                    interns={
                        filteredInterns
                    }
                    canToggleActive={
                        isAdmin
                    }
                    onToggleActive={
                        handleToggleInternActive
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
