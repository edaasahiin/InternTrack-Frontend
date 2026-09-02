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

            <AlertMessage
                message={message}
                isError={isError}
            />

            {isLoading ? (
                <LoadingMessage />
            ) : (
                <InternList
                    interns={interns}
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