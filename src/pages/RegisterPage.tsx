import {
    useEffect,
    useState,
    type FormEvent
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import { agent } from "../api/agent";

import type {
    RegisterDto
} from "../interfaces/auth";

import type {
    Department
} from "../interfaces/department";

import sankoLogo from "../assets/sanko-logo.png";

import "./LoginPage.css";

interface ApiError extends Error {
    status?: number;
    data?: unknown;
}

function RegisterPage() {
    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [departmentId, setDepartmentId] =
        useState("");

    const [departments, setDepartments] =
        useState<Department[]>([]);

    const [message, setMessage] =
        useState("");

    const [isLoading, setIsLoading] =
        useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const data =
                    await agent.get<Department[]>(
                        "/departments"
                    );

                setDepartments(data);
            } catch (error) {
                const apiError =
                    error as ApiError;

                setMessage(
                    apiError.message ||
                    "Departmanlar yüklenemedi."
                );
            }
        };

        loadDepartments();
    }, []);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setMessage("");
        setIsLoading(true);

        const registerDto: RegisterDto = {
            name,
            email,
            password,
            departmentId: Number(departmentId)
        };

        try {
            await agent.post<
                unknown,
                RegisterDto
            >(
                "/auth/register",
                registerDto
            );

            navigate("/login");
        } catch (error) {
            const apiError =
                error as ApiError;

            setMessage(
                apiError.message ||
                "Kayıt işlemi başarısız."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <img
                        className="login-logo"
                        src={sankoLogo}
                        alt="Sanko Logo"
                    />

                    <h1>Kayıt Ol</h1>

                    <p>
                        InternTrack stajyer hesabınızı oluşturun.
                    </p>
                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >
                    <div className="login-field">
                        <label htmlFor="name">
                            Ad Soyad
                        </label>

                        <input
                            id="name"
                            type="text"
                            placeholder="Adınızı girin"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="ornek@email.com"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="password">
                            Şifre
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="En az 6 karakter"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="department">
                            Departman
                        </label>

                        <select
                            id="department"
                            value={departmentId}
                            onChange={(event) =>
                                setDepartmentId(
                                    event.target.value
                                )
                            }
                            required
                        >
                            <option value="">
                                Departman seçiniz
                            </option>

                            {departments.map(
                                (department) => (
                                    <option
                                        key={department.id}
                                        value={department.id}
                                    >
                                        {department.name}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {message && (
                        <div className="login-error">
                            {message}
                        </div>
                    )}

                    <button
                        className="login-button"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Kayıt oluşturuluyor..."
                            : "Kayıt Ol"}
                    </button>

                    <div className="auth-link">
                        Zaten hesabın var mı?{" "}
                        <Link to="/login">
                            Giriş Yap
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;