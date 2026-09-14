import {
    Link
} from "react-router-dom";

import type {
    Intern
} from "../interfaces/intern";

interface InternListProps {
    interns: Intern[];

    canDelete: boolean;

    onDelete: (
        intern: Intern
    ) => Promise<void> | void;
}

function InternList({
    interns,
    canDelete,
    onDelete
}: InternListProps) {
    return (
        <div>
            <h3>
                Stajyer Listesi
            </h3>

            {interns.length === 0 ? (
                <p>
                    Henüz stajyer yok.
                </p>
            ) : (
                interns.map(
                    (intern) => (
                        <div
                            className="intern-card"
                            key={intern.id}
                        >
                            <div>
                                <strong>
                                    {intern.name}{" "}
                                    {intern.surname}
                                </strong>

                                {" - "}

                                {intern.email}

                                {" - "}

                                {intern.department?.name ??
                                    "-"}
                            </div>

                            <div className="intern-actions">
                                <Link
                                    to={`/interns/${intern.id}`}
                                    className="detail-link"
                                >
                                    Detay
                                </Link>

                                {canDelete && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onDelete(
                                                intern
                                            )
                                        }
                                    >
                                        Sil
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                )
            )}
        </div>
    );
}

export default InternList;