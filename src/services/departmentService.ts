import apiService from "../api/apiService";

import type {
    Department,
    CreateDepartmentDto
} from "../interfaces/department";

interface MessageResponse {
    message?: string;
}

const departmentService = {
    getAll(): Promise<Department[]> {
        return apiService.get<
            Department[]
        >(
            "/departments"
        );
    },

    create(
        department:
            CreateDepartmentDto
    ): Promise<MessageResponse> {
        return apiService.post<
            MessageResponse,
            CreateDepartmentDto
        >(
            "/departments",
            department
        );
    },

    update(
        id: number,
        department:
            CreateDepartmentDto
    ): Promise<MessageResponse> {
        return apiService.put<
            MessageResponse,
            CreateDepartmentDto
        >(
            `/departments/${id}`,
            department
        );
    },

    delete(
        id: number
    ): Promise<void> {
        return apiService.delete<void>(
            `/departments/${id}`
        );
    }
};

export default departmentService;