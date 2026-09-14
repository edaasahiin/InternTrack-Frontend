import {
    useState
} from "react";

import type {
    Department
} from "../interfaces/department";

interface DepartmentListProps {
    departments:
        Department[];

    canManage:
        boolean;

    isUpdating:
        boolean;

    onUpdate: (
        department: Department,
        newName: string
    ) => Promise<boolean>;

    onDelete: (
        department: Department
    ) => Promise<void> | void;
}

function DepartmentList({
    departments,
    canManage,
    isUpdating,
    onUpdate,
    onDelete
}: DepartmentListProps) {
    const [
        editingDepartmentId,
        setEditingDepartmentId
    ] = useState<number | null>(
        null
    );

    const [
        editingName,
        setEditingName
    ] = useState("");

    function startEditing(
        department: Department
    ) {
        setEditingDepartmentId(
            department.id
        );

        setEditingName(
            department.name
        );
    }

    function cancelEditing() {
        setEditingDepartmentId(
            null
        );

        setEditingName("");
    }

    async function saveDepartment(
        department: Department
    ) {
        const trimmedName =
            editingName.trim();

        if (!trimmedName) {
            return;
        }

        const success =
            await onUpdate(
                department,
                trimmedName
            );

        if (success) {
            cancelEditing();
        }
    }

    if (
        departments.length ===
        0
    ) {
        return (
            <p>
                Departman bulunamadı.
            </p>
        );
    }

    return (
        <div>
            <h3>
                Departman Listesi
            </h3>

            {departments.map(
                (department) => {
                    const isEditing =
                        editingDepartmentId ===
                        department.id;

                    return (
                        <div
                            className="department-card"
                            key={
                                department.id
                            }
                        >
                            {isEditing ? (
                                <input
                                    className="department-edit-input"
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
                                    onKeyDown={(event) => {
                                        if (
                                            event.key ===
                                            "Enter"
                                        ) {
                                            saveDepartment(
                                                department
                                            );
                                        }

                                        if (
                                            event.key ===
                                            "Escape"
                                        ) {
                                            cancelEditing();
                                        }
                                    }}
                                    autoFocus
                                />
                            ) : (
                                <span>
                                    {
                                        department.name
                                    }
                                </span>
                            )}

                            {canManage && (
                                <div className="department-actions">
                                    {isEditing ? (
                                        <>
                                            <button
                                                type="button"
                                                className="department-save-button"
                                                disabled={
                                                    isUpdating
                                                }
                                                onClick={() =>
                                                    saveDepartment(
                                                        department
                                                    )
                                                }
                                            >
                                                {isUpdating
                                                    ? "Kaydediliyor..."
                                                    : "Kaydet"}
                                            </button>

                                            <button
                                                type="button"
                                                className="department-cancel-button"
                                                disabled={
                                                    isUpdating
                                                }
                                                onClick={
                                                    cancelEditing
                                                }
                                            >
                                                İptal
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                className="department-edit-button"
                                                onClick={() =>
                                                    startEditing(
                                                        department
                                                    )
                                                }
                                            >
                                                Düzenle
                                            </button>

                                            <button
                                                type="button"
                                                className="department-delete-button"
                                                onClick={() =>
                                                    onDelete(
                                                        department
                                                    )
                                                }
                                            >
                                                Sil
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                }
            )}
        </div>
    );
}

export default DepartmentList;