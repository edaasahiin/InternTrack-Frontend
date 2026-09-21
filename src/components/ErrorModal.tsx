interface ErrorModalProps {
    message: string;

    onClose: () => void;
}

function ErrorModal({
    message,
    onClose
}: ErrorModalProps) {
    if (!message) {
        return null;
    }

    return (
        <div
            className="error-modal-backdrop"
            onClick={onClose}
        >
            <div
                className="error-modal-box"
                onClick={(event) =>
                    event.stopPropagation()
                }
                role="alertdialog"
                aria-modal="true"
            >
                <button
                    type="button"
                    className="error-modal-close"
                    onClick={onClose}
                    aria-label="Hata penceresini kapat"
                >
                    ×
                </button>

                <div className="error-modal-icon">
                    !
                </div>

                <h3>
                    Hata
                </h3>

                <p>
                    {message}
                </p>

                <button
                    type="button"
                    className="error-modal-button"
                    onClick={onClose}
                >
                    Tamam
                </button>
            </div>
        </div>
    );
}

export default ErrorModal;