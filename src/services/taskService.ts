import apiService from "../api/apiService";

import type {
    TaskItem,
    CreateTaskDto,
    UpdateTaskDto
} from "../interfaces/task";

interface MessageResponse {
    message?: string;
}

const taskService = {
    getAll(): Promise<TaskItem[]> {
        return apiService.get<
            TaskItem[]
        >(
            "/tasks"
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
    }
};

export default taskService;