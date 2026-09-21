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
            <div className="department-modal-field">
                <label
                    htmlFor="department-name"
                >
                    Departman Adı
                </label>

                <input
                    id="department-name"
                    type="text"
                    placeholder="Departman adını yazın"
                    value={name}
                    onChange={(event) =>
                        setName(
                            event.target.value
                        )
                    }
                    autoFocus
                />
            </div>

            <div className="department-modal-footer">
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
            </div>
        </form>
    );
}

export default DepartmentForm;