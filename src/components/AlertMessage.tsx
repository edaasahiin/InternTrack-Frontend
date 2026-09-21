interface AlertMessageProps {
    message: string;

    isError: boolean;

    compact?: boolean;
}

function AlertMessage({
    message,
    isError,
    compact = false
}: AlertMessageProps) {
    if (!message) {
        return null;
    }

    return (
        <div
            className={[
                "alert-message",
                isError
                    ? "alert-message-error"
                    : "alert-message-success",
                compact
                    ? "alert-message-compact"
                    : ""
            ]
                .filter(Boolean)
                .join(" ")}
            role={
                isError
                    ? "alert"
                    : "status"
            }
        >
            <span className="alert-message-icon">
                {isError
                    ? "✕"
                    : "✓"}
            </span>

            <span className="alert-message-text">
                {message}
            </span>
        </div>
    );
}

export default AlertMessage;