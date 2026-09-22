import apiService from "../api/apiService";

import type {
    TaskItem,
    CreateTaskDto,
    UpdateTaskDto
} from "../interfaces/task";

import type {
    MessageResponse
} from "../interfaces/common";

const taskService = {
    getAll(includeInactive = false): Promise<TaskItem[]> {
        return apiService.get<TaskItem[]>(
            includeInactive ? "/tasks/all" : "/tasks"
        );
    },

    create(
        task: CreateTaskDto
    ): Promise<MessageResponse> {
        return apiService.post<
            MessageResponse,
            CreateTaskDto
        >(
            "/tasks",
            task
        );
    },

    update(
        id: number,
        task: UpdateTaskDto
    ): Promise<MessageResponse> {
        return apiService.put<
            MessageResponse,
            UpdateTaskDto
        >(
            `/tasks/${id}`,
            task
        );
    },

    delete(
        id: number
    ): Promise<void> {
        return apiService.delete<void>(
            `/tasks/${id}`
        );
    },

    restore(
        id: number
    ): Promise<MessageResponse> {
        return apiService.patch<MessageResponse>(
            `/tasks/${id}/restore`
        );
    }
};

export default taskService;