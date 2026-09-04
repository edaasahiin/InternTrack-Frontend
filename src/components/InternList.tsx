import { useState } from "react";
import { Link } from "react-router-dom";

import { agent } from "../api/agent";
import AlertMessage from "./AlertMessage";
import { getErrorMessage } from "../utils/getErrorMessage";

import type { Intern } from "../interfaces/intern";

interface InternListProps {
    interns: Intern[];
    onInternDeleted: () => Promise<void> | void;
    canDelete: boolean;
}

function InternList({
    interns,
    onInternDeleted,
    canDelete
}: InternListProps) {
    const [message, setMessage] =
        useState("");

    const [isError, setIsError] =
        useState(false);

    async function deleteIntern(
        id: number
    ) {
        setMessage("");
        setIsError(false);

        try {
            await agent.delete<void>(
                `/interns/${id}`
            );

            setIsError(false);

            setMessage(
                "Stajyer başarıyla silindi."
            );

            await onInternDeleted();
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(error)
            );
        }
    }

    return (
        <div>
            <h3>Stajyer Listesi</h3>

            <AlertMessage
                message={message}
                isError={isError}
            />

            {interns.length === 0 ? (
                <p>Henüz stajyer yok.</p>
            ) : (
                interns.map((intern) => (
                    <div
                        className="intern-card"
                        key={intern.id}
                    >
                        <div>
                            <strong>
                                {intern.name} {intern.surname}
                            </strong>

                            {" - "}
                            {intern.email}

                            {" - "}
                            {intern.department?.name}
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
                                    onClick={() =>
                                        deleteIntern(
                                            intern.id
                                        )
                                    }
                                >
                                    Sil
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default InternList;