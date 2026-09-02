const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL;

interface ApiError extends Error {
    status: number;
    data: unknown;
}

async function request<T>(
    endpoint: string,
    options: RequestInit = {},
    canRetry = true
): Promise<T> {
    try {
        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers
                }
            }
        );

        let data: unknown = null;

        if (response.status !== 204) {
            try {
                data = await response.json();
            } catch {
                data = null;
            }
        }

        if (
            response.status === 401 &&
            canRetry &&
            endpoint !== "/auth/login" &&
            endpoint !== "/auth/refresh"
        ) {
            const refreshResponse =
                await fetch(
                    `${API_BASE_URL}/auth/refresh`,
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            if (refreshResponse.ok) {
                return request<T>(
                    endpoint,
                    options,
                    false
                );
            }
        }

        if (!response.ok) {
            const responseData =
                data as {
                    message?: string;
                } | null;

            const error =
                new Error(
                    responseData?.message ||
                    "İşlem gerçekleştirilemedi."
                ) as ApiError;

            error.status = response.status;
            error.data = data;

            throw error;
        }

        return data as T;
    } catch (error) {
        const apiError =
            error as Partial<ApiError>;

        if (apiError.status) {
            throw error;
        }

        const connectionError =
            new Error(
                "Sunucuya bağlanılamadı."
            ) as ApiError;

        connectionError.status = 0;
        connectionError.data = null;

        throw connectionError;
    }
}

export const agent = {
    get<T>(endpoint: string): Promise<T> {
        return request<T>(endpoint);
    },

    post<TResponse, TBody = unknown>(
        endpoint: string,
        body?: TBody
    ): Promise<TResponse> {
        return request<TResponse>(
            endpoint,
            {
                method: "POST",
                body:
                    body === undefined
                        ? undefined
                        : JSON.stringify(body)
            }
        );
    },

    put<TResponse, TBody>(
        endpoint: string,
        body: TBody
    ): Promise<TResponse> {
        return request<TResponse>(
            endpoint,
            {
                method: "PUT",
                body: JSON.stringify(body)
            }
        );
    },

    delete<TResponse>(
        endpoint: string
    ): Promise<TResponse> {
        return request<TResponse>(
            endpoint,
            {
                method: "DELETE"
            }
        );
    }
};