import {
    useState,
    type FormEvent
} from "react";

interface DepartmentFormProps {
    isSubmitting: boolean;

    onSubmit: (
        name: string
    ) => Promise<void> | void;
}

function DepartmentForm({
    isSubmitting,
    onSubmit
}: DepartmentFormProps) {
    const [
        name,
        setName
    ] = useState("");

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const trimmedName =
            name.trim();

        if (!trimmedName) {
            return;
        }

        await onSubmit(
            trimmedName
        );
    }

    return (
        <form
            className="department-modal-form"
            onSubmit={
                handleSubmit
            }
        >
            <input
                type="text"
                placeholder="Departman Adı"
                value={name}
                onChange={(event) =>
                    setName(
                        event.target.value
                    )
                }
                autoFocus
                required
            />

            <button
                type="submit"
                disabled={
                    isSubmitting
                }
            >
                {isSubmitting
                    ? "Ekleniyor..."
                    : "Departman Ekle"}
            </button>
        </form>
    );
}

export default DepartmentForm;