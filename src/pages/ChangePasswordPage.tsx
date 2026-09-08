import {
    useState,
    type FormEvent
} from "react";

import {
    useNavigate
} from "react-router-dom";

import { agent } from "../api/agent";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/getErrorMessage";

import type {
    ChangePasswordDto
} from "../interfaces/auth";

function ChangePasswordPage() {
    const navigate = useNavigate();

    const {
        user,
        logout
    } = useAuth();

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [isError, setIsError] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setMessage("");
        setIsError(false);

        if (newPassword !== confirmPassword) {
            setIsError(true);

            setMessage(
                "Yeni şifreler birbiriyle eşleşmiyor."
            );

            return;
        }

        setIsSubmitting(true);

        const dto: ChangePasswordDto = {
            currentPassword,
            newPassword
        };

        try {
            await agent.put<
                unknown,
                ChangePasswordDto
            >(
                "/auth/change-password",
                dto
            );

            await logout();

            navigate("/login");
        } catch (error) {
            setIsError(true);

            setMessage(
                getErrorMessage(error)
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="password-page">
            <h2>Şifre Değiştir</h2>

            <div className="password-card">
                <p>
                    {user?.mustChangePassword
                        ? `Merhaba ${user.name}, devam etmek için geçici şifrenizi değiştirmeniz gerekiyor.`
                        : `Merhaba ${user?.name}, mevcut şifrenizi kullanarak yeni bir şifre belirleyebilirsiniz.`}
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Mevcut Şifre"
                        value={currentPassword}
                        onChange={(event) =>
                            setCurrentPassword(
                                event.target.value
                            )
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Yeni Şifre"
                        value={newPassword}
                        onChange={(event) =>
                            setNewPassword(
                                event.target.value
                            )
                        }
                        required
                        minLength={6}
                    />

                    <input
                        type="password"
                        placeholder="Yeni Şifre Tekrar"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(
                                event.target.value
                            )
                        }
                        required
                        minLength={6}
                    />

                    {message && (
                        <p
                            className={
                                isError
                                    ? "error-message"
                                    : "success-message"
                            }
                        >
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Değiştiriliyor..."
                            : "Şifreyi Değiştir"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordPage;