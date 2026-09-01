import { useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";

import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

import sankoLogo from "../assets/sanko-logo.png";

import "./LoginPage.css";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setIsLoading(true);

        try {
            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            login(response);

            navigate("/");
        } catch (error) {
            setMessage(
                error.message || "Giriş başarısız."
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

                    <h1>InternTrack</h1>

                    <p>
                        Staj Takip Sistemine giriş yapın.
                    </p>
                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >
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
                                setEmail(event.target.value)
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
                            placeholder="Şifrenizi girin"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />
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
                            ? "Giriş yapılıyor..."
                            : "Giriş Yap"}
                    </button>

                    <div className="auth-link">
                        Hesabın yok mu?{" "}
                        <Link to="/register">
                            Kayıt Ol
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;