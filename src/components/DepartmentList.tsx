import ActiveStatusBadge from "./common/ActiveStatusBadge";
import Table from "./common/Table";

import type {
    TableColumn
} from "./common/Table";

import type {
    Department
} from "../interfaces/department";

interface DepartmentListProps {
    departments: Department[];

    canManage: boolean;

    canToggleActive: boolean;

    onEdit: (
        department: Department
    ) => void;

    onToggleActive: (
        department: Department
    ) => Promise<void> | void;
}

function DepartmentList({
    departments,
    canManage,
    canToggleActive,
    onEdit,
    onToggleActive
}: DepartmentListProps) {
    const columns:
        TableColumn<Department>[] = [
        {
            key: "name",

            header: "Departman",

            render: (
                department
            ) => (
                <strong>
                    {
                        department.name
                    }
                </strong>
            )
        },

        {
            key: "activeStatus",

            header:
                "Departman Aktifliği",

            render: (
                department
            ) => (
                <ActiveStatusBadge isActive={department.isActive} />
            )
        },

        {
            key: "actions",

            header: "İşlemler",

            render: (
                department
            ) =>
                canManage ? (
                    <div className="department-actions">
                        <button
                            type="button"
                            className="department-edit-button"
                            onClick={() =>
                                onEdit(
                                    department
                                )
                            }
                        >
                            Düzenle
                        </button>

                        {canToggleActive && (
                            <button
                                type="button"
                                className={
                                    department.isActive
                                        ? "department-delete-button"
                                        : "department-restore-button"
                                }
                                onClick={() =>
                                    onToggleActive(
                                        department
                                    )
                                }
                            >
                                {department.isActive
                                    ? "Pasif Et"
                                    : "Aktif Et"}
                            </button>
                        )}
                    </div>
                ) : (
                    "-"
                )
        }
    ];

    return (
        <div>
            <h3>
                Departman Listesi
            </h3>

            <Table
                data={
                    departments
                }
                columns={
                    columns
                }
                getRowKey={(
                    department
                ) =>
                    department.id
                }
                emptyMessage="Departman bulunamadı."
                rowClassName={(
                    department
                ) =>
                    department.isActive
                        ? ""
                        : "inactive-row"
                }
            />
        </div>
    );
}

export default DepartmentList;
