import axiosClient from "./axiosClient";

const apiService = {
    async get<T>(
        url: string
    ): Promise<T> {
        const response =
            await axiosClient.get<T>(
                url
            );

        return response.data;
    },

    async post<
        TResponse,
        TRequest = unknown
    >(
        url: string,
        data?: TRequest
    ): Promise<TResponse> {
        const response =
            await axiosClient.post<TResponse>(
                url,
                data
            );

        return response.data;
    },

    async put<
        TResponse,
        TRequest = unknown
    >(
        url: string,
        data?: TRequest
    ): Promise<TResponse> {
        const response =
            await axiosClient.put<TResponse>(
                url,
                data
            );

        return response.data;
    },

    async patch<
        TResponse,
        TRequest = unknown
    >(
        url: string,
        data?: TRequest
    ): Promise<TResponse> {
        const response =
            await axiosClient.patch<TResponse>(
                url,
                data
            );

        return response.data;
    },

    async delete<TResponse>(
        url: string
    ): Promise<TResponse> {
        const response =
            await axiosClient.delete<TResponse>(
                url
            );

        return response.data;
    }
};

export default apiService;