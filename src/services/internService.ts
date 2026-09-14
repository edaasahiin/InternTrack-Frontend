import apiService from "../api/apiService";

import type {
    Intern,
    CreateInternDto,
    UpdateInternDto
} from "../interfaces/intern";

interface MessageResponse {
    message?: string;
}

const internService = {
    getAll(): Promise<Intern[]> {
        return apiService.get<
            Intern[]
        >(
            "/interns"
        );
    },

    getById(
        id: number
    ): Promise<Intern> {
        return apiService.get<
            Intern
        >(
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
    }
};

export default internService;