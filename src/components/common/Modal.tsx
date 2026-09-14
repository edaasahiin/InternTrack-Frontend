import {
    useEffect,
    type ReactNode
} from "react";

interface ModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
}

function Modal({
    isOpen,
    title,
    onClose,
    children
}: ModalProps) {
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handleEscape(
            event: KeyboardEvent
        ) {
            if (
                event.key === "Escape"
            ) {
                onClose();
            }
        }

        document.addEventListener(
            "keydown",
            handleEscape
        );

        document.body.style.overflow =
            "hidden";

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );

            document.body.style.overflow =
                "";
        };
    }, [
        isOpen,
        onClose
    ]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="modal-backdrop"
            onMouseDown={
                onClose
            }
        >
            <div
                className="modal-container"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <div className="modal-header">
                    <h3 id="modal-title">
                        {title}
                    </h3>

                    <button
                        type="button"
                        className="modal-close"
                        aria-label="Modalı kapat"
                        onClick={
                            onClose
                        }
                    >
                        ×
                    </button>
                </div>

                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;