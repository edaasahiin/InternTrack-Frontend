import {
    Link
} from "react-router-dom";

import Table from "./common/Table";
import { getTextPreview } from "../utils/taskUtils";

import type {
    TableColumn
} from "./common/Table";

import type {
    Intern
} from "../interfaces/intern";

interface InternListProps {
    interns: Intern[];

    canToggleActive: boolean;

    onToggleActive: (
        intern: Intern
    ) => Promise<void> | void;
}

function InternList({
    interns,
    canToggleActive,
    onToggleActive
}: InternListProps) {
    const columns:
        TableColumn<Intern>[] = [
            {
                key: "name",

                header: "Ad Soyad",

                render: (intern) => {
                    const fullName =
                        `${intern.name} ${intern.surname}`;

                    return (
                        <strong
                            className="intern-table-name"
                            title={
                                fullName
                            }
                        >
                            {getTextPreview(
                                fullName,
                                22
                            )}
                        </strong>
                    );
                }
            },

            {
                key: "email",

                header: "E-posta",

                render: (intern) => (
                    <span
                        className="intern-table-email"
                        title={
                            intern.email
                        }
                    >
                        {getTextPreview(
                            intern.email,
                            26
                        )}
                    </span>
                )
            },

            {
                key: "department",

                header: "Departman",

                render: (intern) => (
                    <span
                        className="intern-table-department"
                        title={
                            intern.department
                                ?.name ??
                            ""
                        }
                    >
                        {getTextPreview(
                            intern.department
                                ?.name,
                            22
                        )}
                    </span>
                )
            },

            {
                key: "activeStatus",

                header: "Stajyer Aktifliği",

                render: (intern) => (
                    <span
                        className={
                            intern.isActive
                                ? "task-active-badge"
                                : "task-inactive-badge"
                        }
                    >
                        {intern.isActive
                            ? "Aktif"
                            : "Pasif"}
                    </span>
                )
            },

            {
                key: "actions",

                header: "İşlemler",

                render: (intern) => (
                    <div className="intern-table-actions">
                        <Link
                            to={`/interns/${intern.id}`}
                            className="intern-edit-link"
                        >
                            Düzenle
                        </Link>

                        {canToggleActive && (
                            <button
                                type="button"
                                className={
                                    intern.isActive
                                        ? "intern-delete-button"
                                        : "intern-restore-button"
                                }
                                onClick={() =>
                                    onToggleActive(
                                        intern
                                    )
                                }
                            >
                                {intern.isActive
                                    ? "Pasif Et"
                                    : "Aktif Et"}
                            </button>
                        )}
                    </div>
                )
            }
        ];

    return (
        <div>
            <h3>
                Stajyer Listesi
            </h3>

            <Table<Intern>
                data={
                    interns
                }
                columns={
                    columns
                }
                getRowKey={(
                    intern
                ) =>
                    intern.id
                }
                emptyMessage="Bu filtreye uygun stajyer bulunamadı."
                rowClassName={(
                    intern
                ) =>
                    intern.isActive
                        ? ""
                        : "intern-row-inactive"
                }
            />
        </div>
    );
}

export default InternList;
