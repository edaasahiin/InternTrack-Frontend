import type {
    TaskItem
} from "../interfaces/task";

export function parseDateTime(
    value: string
): Date {
    const hasTimezone =
        value.endsWith("Z") ||
        /[+-]\d{2}:\d{2}$/.test(
            value
        );

    return new Date(
        hasTimezone
            ? value
            : `${value}Z`
    );
}

export function isTaskOverdue(
    task: TaskItem
): boolean {
    if (
        !task.dueDate ||
        task.status === "Done" ||
        !task.isActive
    ) {
        return false;
    }

    return (
        parseDateTime(
            task.dueDate
        ).getTime() <
        Date.now()
    );
}

export function formatTaskDate(
    date?: string | null
): string {
    if (!date) {
        return "-";
    }

    return parseDateTime(
        date
    ).toLocaleDateString(
        "tr-TR"
    );
}

export function formatTaskTime(
    date?: string | null
): string {
    if (!date) {
        return "-";
    }

    return parseDateTime(
        date
    ).toLocaleTimeString(
        "tr-TR",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}

export function getTaskStatusText(
    status: string
): string {
    if (status === "ToDo") {
        return "Yapılacak";
    }

    if (status === "InProgress") {
        return "Devam Ediyor";
    }

    if (status === "Done") {
        return "Tamamlandı";
    }

    return status;
}

export function getTaskPriorityText(
    priority: string
): string {
    if (priority === "Low") {
        return "Düşük";
    }

    if (priority === "Medium") {
        return "Orta";
    }

    if (priority === "High") {
        return "Yüksek";
    }

    return priority;
}

export function getTextPreview(
    value?: string | null,
    maxLength = 18
): string {
    if (!value) {
        return "-";
    }

    if (value.length <= maxLength) {
        return value;
    }

    return `${value.slice(
        0,
        maxLength
    )}...`;
}
