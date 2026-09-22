interface ActiveStatusBadgeProps {
    isActive: boolean;
}

function ActiveStatusBadge({ isActive }: ActiveStatusBadgeProps) {
    return (
        <span className={isActive ? "task-active-badge" : "task-inactive-badge"}>
            {isActive ? "Aktif" : "Pasif"}
        </span>
    );
}

export default ActiveStatusBadge;
