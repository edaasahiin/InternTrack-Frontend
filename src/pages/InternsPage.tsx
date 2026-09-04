import {
    useEffect,
    useState
} from "react";

import InternForm from "../components/InternForm";
import InternList from "../components/InternList";
import AlertMessage from "../components/AlertMessage";
import LoadingMessage from "../components/LoadingMessage";

import { agent } from "../api/agent";
import { useAuth } from "../context/AuthContext";
import { isAdminOrHR } from "../utils/roleUtils";
import { getErrorMessage } from "../utils/getErrorMessage";

import type {
    Intern
} from "../interfaces/intern";

function InternsPage() {
    const [interns, setInterns] =
        useState<Intern[]>([]);

    const [searchText, setSearchText] =
        useState("");

    const [isLoading, setIsLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");

    const [isError, setIsError] =
        useState(false);

    const { user } = useAuth();

    const canManageInterns =
        isAdminOrHR(user?.role);

    async function loadInterns() {
        setIsLoading(true);
        setMessage("");
        setIsError(false);

        try {
            const data =
                await agent.get<Intern[]>(
                    "/interns"
                );

            setInterns(data ?? []);
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
        loadInterns();
    }, []);

    const filteredInterns =
        interns.filter((intern) => {
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
                    .includes(search) ||
                intern.email
                    .toLowerCase()
                    .includes(search) ||
                intern.department?.name
                    ?.toLowerCase()
                    .includes(search)
            );
        });

    return (
        <div>
            <h2>Stajyerler</h2>

            {canManageInterns && (
                <InternForm
                    onInternAdded={
                        loadInterns
                    }
                />
            )}

            <div className="intern-search">
                <label htmlFor="intern-search">
                    Stajyer Ara
                </label>

                <input
                    id="intern-search"
                    type="text"
                    placeholder="Ad, email veya departman"
                    value={searchText}
                    onChange={(event) =>
                        setSearchText(
                            event.target.value
                        )
                    }
                />
            </div>

            <AlertMessage
                message={message}
                isError={isError}
            />

            {isLoading ? (
                <LoadingMessage />
            ) : (
                <InternList
                    interns={filteredInterns}
                    onInternDeleted={
                        loadInterns
                    }
                    canDelete={
                        canManageInterns
                    }
                />
            )}
        </div>
    );
}

export default InternsPage;