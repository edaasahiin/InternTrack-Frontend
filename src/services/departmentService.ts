import apiService from "../api/apiService";

import type {
    Department,
    CreateDepartmentDto
} from "../interfaces/department";

import type {
    MessageResponse
} from "../interfaces/common";

const departmentService = {
    getAll(includeInactive = false): Promise<Department[]> {
        return apiService.get<Department[]>(
            includeInactive ? "/departments/all" : "/departments"
        );
    },

    create(
        department: CreateDepartmentDto
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
        department: CreateDepartmentDto
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
    },

    restore(
        id: number
    ): Promise<MessageResponse> {
        return apiService.patch<MessageResponse>(
            `/departments/${id}/restore`
        );
    }
};

export default departmentService;