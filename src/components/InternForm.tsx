import {
    useState,
    type FormEvent
} from "react";

import type {
    CreateInternDto
} from "../interfaces/intern";

import type {
    Department
} from "../interfaces/department";

interface InternFormProps {
    departments: Department[];

    isSubmitting: boolean;

    onSubmit: (
        intern: CreateInternDto
    ) => Promise<void> | void;
}

function InternForm({
    departments,
    isSubmitting,
    onSubmit
}: InternFormProps) {
    const [
        name,
        setName
    ] = useState("");

    const [
        surname,
        setSurname
    ] = useState("");

    const [
        email,
        setEmail
    ] = useState("");

    const [
        password,
        setPassword
    ] = useState("");

    const [
        departmentId,
        setDepartmentId
    ] = useState("");

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const newIntern:
            CreateInternDto = {
                name:
                    name.trim(),

                surname:
                    surname.trim(),

                email:
                    email.trim(),

                password,

                departmentId:
                    Number(
                        departmentId
                    )
            };

        await onSubmit(
            newIntern
        );
    }

    return (
        <form
            onSubmit={
                handleSubmit
            }
        >
            <input
                type="text"
                placeholder="Ad"
                value={name}
                onChange={(event) =>
                    setName(
                        event
                            .target
                            .value
                    )
                }
                required
            />

            <input
                type="text"
                placeholder="Soyad"
                value={surname}
                onChange={(event) =>
                    setSurname(
                        event
                            .target
                            .value
                    )
                }
                required
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) =>
                    setEmail(
                        event
                            .target
                            .value
                    )
                }
                required
            />

            <input
                type="password"
                placeholder="Geçici Şifre"
                value={password}
                onChange={(event) =>
                    setPassword(
                        event
                            .target
                            .value
                    )
                }
                required
                minLength={6}
            />

            <select
                value={
                    departmentId
                }
                onChange={(event) =>
                    setDepartmentId(
                        event
                            .target
                            .value
                    )
                }
                required
            >
                <option value="">
                    Departman Seç
                </option>

                {departments.map(
                    (
                        department
                    ) => (
                        <option
                            key={
                                department.id
                            }
                            value={
                                department.id
                            }
                        >
                            {
                                department.name
                            }
                        </option>
                    )
                )}
            </select>

            <button
                type="submit"
                disabled={
                    isSubmitting
                }
            >
                {isSubmitting
                    ? "Ekleniyor..."
                    : "Stajyer Ekle"}
            </button>
        </form>
    );
}

export default InternForm;