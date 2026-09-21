import type {
    TaskFormData
} from "../components/TaskForm";

import type {
    UpdateTaskDto
} from "../interfaces/task";

export function createTaskUpdatePayload(
    task: TaskFormData,
    includeActiveState: boolean
): UpdateTaskDto {
    const payload:
        UpdateTaskDto = {
            title: task.title,
            description:
                task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            internId: task.internId,
            canInternDeleteWhenCompleted:
                task.canInternDeleteWhenCompleted
        };

    if (
        includeActiveState &&
        task.isActive !== undefined
    ) {
        payload.isActive =
            task.isActive;
    }

    return payload;
}
