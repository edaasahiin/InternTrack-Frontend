import {
    useEffect,
    useState,
    type FormEvent
} from "react";

import { agent } from "../api/agent";

import AlertMessage from "../components/AlertMessage";
import LoadingMessage from "../components/LoadingMessage";

import { getErrorMessage } from "../utils/getErrorMessage";
import { useAuth } from "../context/AuthContext";
import { isAdminOrHR } from "../utils/roleUtils";

import type {
    Department,
    CreateDepartmentDto
} from "../interfaces/department";

interface MessageResponse {
    message?: string;
}

function DepartmentsPage() {
    const [departments, setDepartments] =
        useState<Department[]>([]);

    const [name, setName] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [isError, setIsError] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [isLoading, setIsLoading] =
        useState(true);

    const { user } = useAuth();

    const canManageDepartments =
        isAdminOrHR(user?.role);

    async function loadDepartments() {
        setIsLoading(true);
        setMessage("");
        setIsError(false);

        try {
            const data =
                await agent.get<Department[]>(
                    "/departments"
                );

            setDepartments(data ?? []);
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(error)
            );
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadDepartments();
    }, []);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setMessage("");
        setIsError(false);
        setIsSubmitting(true);

        const newDepartment:
            CreateDepartmentDto = {
                name
            };

        try {
            const data =
                await agent.post<
                    MessageResponse,
                    CreateDepartmentDto
                >(
                    "/departments",
                    newDepartment
                );

            setIsError(false);

            setMessage(
                data?.message ||
                "Departman oluşturuldu."
            );

            setName("");

            await loadDepartments();
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(error)
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    async function deleteDepartment(
        id: number
    ) {
        setMessage("");
        setIsError(false);

        try {
            await agent.delete<void>(
                `/departments/${id}`
            );

            setIsError(false);

            setMessage(
                "Departman başarıyla silindi."
            );

            await loadDepartments();
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(error)
            );
        }
    }

    return (
        <div>
            <h2>Departmanlar</h2>

            {canManageDepartments && (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Departman Adı"
                        value={name}
                        onChange={(event) =>
                            setName(
                                event.target.value
                            )
                        }
                        required
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Ekleniyor..."
                            : "Departman Ekle"}
                    </button>
                </form>
            )}

            <AlertMessage
                message={message}
                isError={isError}
            />

            <h3>Departman Listesi</h3>

            {isLoading ? (
                <LoadingMessage />
            ) : departments.length === 0 ? (
                <p>Henüz departman yok.</p>
            ) : (
                departments.map(
                    (department) => (
                        <div
                            className="department-card"
                            key={department.id}
                        >
                            {department.name}

                            {canManageDepartments && (
                                <button
                                    onClick={() =>
                                        deleteDepartment(
                                            department.id
                                        )
                                    }
                                >
                                    Sil
                                </button>
                            )}
                        </div>
                    )
                )
            )}
        </div>
    );
}

export default DepartmentsPage;