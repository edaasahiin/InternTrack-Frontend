import type {
    AxiosRequestConfig
} from "axios";

import axiosClient from "./axiosClient";

const apiService = {
    async get<TResponse>(
        endpoint: string,
        config?: AxiosRequestConfig
    ): Promise<TResponse> {
        const response =
            await axiosClient.get<
                TResponse
            >(
                endpoint,
                config
            );

        return response.data;
    },

    async post<
        TResponse,
        TBody = unknown
    >(
        endpoint: string,
        body?: TBody,
        config?: AxiosRequestConfig
    ): Promise<TResponse> {
        const response =
            await axiosClient.post<
                TResponse
            >(
                endpoint,
                body,
                config
            );

        return response.data;
    },

    async put<
        TResponse,
        TBody = unknown
    >(
        endpoint: string,
        body: TBody,
        config?: AxiosRequestConfig
    ): Promise<TResponse> {
        const response =
            await axiosClient.put<
                TResponse
            >(
                endpoint,
                body,
                config
            );

        return response.data;
    },

    async delete<TResponse>(
        endpoint: string,
        config?: AxiosRequestConfig
    ): Promise<TResponse> {
        const response =
            await axiosClient.delete<
                TResponse
            >(
                endpoint,
                config
            );

        return response.data;
    }
};

export default apiService;