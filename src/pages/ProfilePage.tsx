import {
    useState,
    type FormEvent
} from "react";

import {
    Link
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/getErrorMessage";

const avatarOptions = [
    "😀",
    "😄",
    "😎",
    "🤓",
    "🥳",
    "😊",
    "😇",
    "🤩",
    "👩‍💻",
    "🧑‍💻",
    "👩‍🎓",
    "🧑‍🎓",
    "🚀",
    "⭐",
    "🌟",
    "🎯",
    "💡",
    "🔥",
    "⚡",
    "💻",
    "📚",
    "🧠",
    "🌈",
    "✨",
    "🤍",
    "🫶"
];

function ProfilePage() {
    const {
        user,
        updateAvatar,
        updateProfile
    } = useAuth();

    const [showAvatarOptions, setShowAvatarOptions] =
        useState(false);

    const [isUpdatingAvatar, setIsUpdatingAvatar] =
        useState(false);

    const [name, setName] =
        useState(user?.name || "");

    const [surname, setSurname] =
        useState(user?.surname || "");

    const [email, setEmail] =
        useState(user?.email || "");

    const [profileMessage, setProfileMessage] =
        useState("");

    const [isProfileError, setIsProfileError] =
        useState(false);

    const [isUpdatingProfile, setIsUpdatingProfile] =
        useState(false);

    const defaultAvatar =
        user?.name
            ?.charAt(0)
            .toUpperCase() || "?";

    const currentAvatar =
        user?.avatar || defaultAvatar;

    const handleAvatarChange = async (
        avatar: string | null
    ) => {
        try {
            setIsUpdatingAvatar(true);

            await updateAvatar(avatar);

            setShowAvatarOptions(false);
        } finally {
            setIsUpdatingAvatar(false);
        }
    };

    const handleProfileSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setProfileMessage("");
        setIsProfileError(false);
        setIsUpdatingProfile(true);

        try {
            await updateProfile(
                name.trim(),
                surname.trim(),
                email.trim()
            );

            setIsProfileError(false);

            setProfileMessage(
                "Profil başarıyla güncellendi."
            );
        } catch (error) {
            setIsProfileError(true);

            setProfileMessage(
                getErrorMessage(error)
            );
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    return (
        <div>
            <h2>Profilim</h2>

            <div className="profile-card">
                <button
                    type="button"
                    className="profile-avatar"
                    onClick={() =>
                        setShowAvatarOptions(
                            (current) => !current
                        )
                    }
                    title="Avatarı değiştir"
                    disabled={isUpdatingAvatar}
                >
                    {currentAvatar}
                </button>

                <div className="profile-info">
                    <h3>
                        {user?.name} {user?.surname}
                    </h3>

                    <p>
                        <strong>Email:</strong>{" "}
                        {user?.email}
                    </p>

                    <p>
                        <strong>Rol:</strong>{" "}
                        {user?.role}
                    </p>

                    <Link
                        to="/change-password"
                        className="change-password-link"
                    >
                        Şifre Değiştir
                    </Link>
                </div>
            </div>

            {showAvatarOptions && (
                <div className="avatar-selector">
                    <h3>Avatar Seç</h3>

                    <div className="avatar-options">
                        <button
                            type="button"
                            className="avatar-option"
                            title="Baş harfi kullan"
                            disabled={isUpdatingAvatar}
                            onClick={() =>
                                handleAvatarChange(null)
                            }
                        >
                            {defaultAvatar}
                        </button>

                        {avatarOptions.map(
                            (avatar) => (
                                <button
                                    key={avatar}
                                    type="button"
                                    className="avatar-option"
                                    disabled={isUpdatingAvatar}
                                    onClick={() =>
                                        handleAvatarChange(
                                            avatar
                                        )
                                    }
                                >
                                    {avatar}
                                </button>
                            )
                        )}
                    </div>
                </div>
            )}

            <div className="profile-edit-section">
                <h3>
                    Profil Bilgilerini Düzenle
                </h3>

                <form
                    onSubmit={handleProfileSubmit}
                >
                    <input
                        type="text"
                        placeholder="Ad"
                        value={name}
                        onChange={(event) =>
                            setName(
                                event.target.value
                            )
                        }
                        required
                        minLength={2}
                    />

                    <input
                        type="text"
                        placeholder="Soyad"
                        value={surname}
                        onChange={(event) =>
                            setSurname(
                                event.target.value
                            )
                        }
                        required
                        minLength={2}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }
                        required
                    />

                    <button
                        type="submit"
                        disabled={isUpdatingProfile}
                    >
                        {isUpdatingProfile
                            ? "Güncelleniyor..."
                            : "Profili Güncelle"}
                    </button>
                </form>

                {profileMessage && (
                    <p
                        className={
                            isProfileError
                                ? "error-message"
                                : "success-message"
                        }
                    >
                        {profileMessage}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;