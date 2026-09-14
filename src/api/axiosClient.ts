import axios, {
    type AxiosError,
    type InternalAxiosRequestConfig
} from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL;

export interface ApiError
    extends Error {
    status: number;
    data: unknown;
}

interface RetryRequestConfig
    extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface ErrorResponse {
    message?: string;
}

function createApiError(
    error: unknown
): ApiError {
    if (
        axios.isAxiosError(
            error
        )
    ) {
        const axiosError =
            error as AxiosError<
                ErrorResponse
            >;

        const status =
            axiosError.response
                ?.status ?? 0;

        const data =
            axiosError.response
                ?.data ?? null;

        const message =
            axiosError.response
                ?.data
                ?.message ||
            (
                status === 0
                    ? "Sunucuya bağlanılamadı."
                    : "İşlem gerçekleştirilemedi."
            );

        const apiError =
            new Error(
                message
            ) as ApiError;

        apiError.status =
            status;

        apiError.data =
            data;

        return apiError;
    }

    const apiError =
        new Error(
            "Beklenmeyen bir hata oluştu."
        ) as ApiError;

    apiError.status = 0;
    apiError.data = null;

    return apiError;
}

const axiosClient =
    axios.create({
        baseURL:
            API_BASE_URL,

        withCredentials:
            true,

        headers: {
            "Content-Type":
                "application/json"
        }
    });

let refreshPromise:
    Promise<void> | null =
    null;

async function refreshToken() {
    await axiosClient.post(
        "/auth/refresh"
    );
}

axiosClient.interceptors.response.use(
    (response) =>
        response,

    async (error) => {
        if (
            !axios.isAxiosError(
                error
            )
        ) {
            return Promise.reject(
                createApiError(
                    error
                )
            );
        }

        const originalRequest =
            error.config as
                | RetryRequestConfig
                | undefined;

        const status =
            error.response?.status;

        const endpoint =
            originalRequest?.url ??
            "";

        const isLoginRequest =
            endpoint.includes(
                "/auth/login"
            );

        const isRefreshRequest =
            endpoint.includes(
                "/auth/refresh"
            );

        const shouldRefresh =
            status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !isLoginRequest &&
            !isRefreshRequest;

        if (
            shouldRefresh &&
            originalRequest
        ) {
            originalRequest._retry =
                true;

            try {
                if (
                    !refreshPromise
                ) {
                    refreshPromise =
                        refreshToken()
                            .finally(
                                () => {
                                    refreshPromise =
                                        null;
                                }
                            );
                }

                await refreshPromise;

                return axiosClient(
                    originalRequest
                );
            } catch (
                refreshError
            ) {
                return Promise.reject(
                    createApiError(
                        refreshError
                    )
                );
            }
        }

        return Promise.reject(
            createApiError(
                error
            )
        );
    }
);

export default axiosClient;