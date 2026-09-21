import apiService from "../api/apiService";

import type {
    Intern,
    CreateInternDto,
    UpdateInternDto
} from "../interfaces/intern";

import type {
    MessageResponse
} from "../interfaces/common";

const internService = {
    getAll(): Promise<Intern[]> {
        return apiService.get<Intern[]>(
            "/interns"
        );
    },

    getAllIncludingInactive(): Promise<Intern[]> {
        return apiService.get<Intern[]>(
            "/interns/all"
        );
    },

    getById(
        id: number
    ): Promise<Intern> {
        return apiService.get<Intern>(
            `/interns/${id}`
        );
    },

    create(
        intern: CreateInternDto
    ): Promise<MessageResponse> {
        return apiService.post<
            MessageResponse,
            CreateInternDto
        >(
            "/interns",
            intern
        );
    },

    update(
        id: number,
        intern: UpdateInternDto
    ): Promise<MessageResponse> {
        return apiService.put<
            MessageResponse,
            UpdateInternDto
        >(
            `/interns/${id}`,
            intern
        );
    },

    delete(
        id: number
    ): Promise<void> {
        return apiService.delete<void>(
            `/interns/${id}`
        );
    },

    restore(
        id: number
    ): Promise<MessageResponse> {
        return apiService.patch<MessageResponse>(
            `/interns/${id}/restore`
        );
    }
};

export default internService;