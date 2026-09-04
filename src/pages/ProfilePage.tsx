import {
    useState
} from "react";

import { useAuth } from "../context/AuthContext";

const avatarOptions = [
    "😀",
    "😎",
    "🤓",
    "👩‍💻",
    "🧑‍💻",
    "🚀",
    "⭐",
    "🎯"
];

function ProfilePage() {
    const {
        user,
        updateAvatar
    } = useAuth();

    const [showAvatarOptions, setShowAvatarOptions] =
        useState(false);

    const [isUpdatingAvatar, setIsUpdatingAvatar] =
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
        </div>
    );
}

export default ProfilePage;