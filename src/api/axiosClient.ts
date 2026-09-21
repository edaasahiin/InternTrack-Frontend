import axios, {
    type InternalAxiosRequestConfig
} from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL;

const AUTH_ENDPOINTS_WITHOUT_REFRESH = [
    "/auth/login",
    "/auth/refresh",
    "/auth/logout"
];

export interface ApiErrorData {
    message?: string;
    errors?: Record<string, string[]>;
}

export interface ApiError extends Error {
    status: number;
    data: ApiErrorData | null;
}

interface RetryRequestConfig
    extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

function createApiError(
    error: unknown
): ApiError {
    if (!axios.isAxiosError<ApiErrorData>(error)) {
        return createError(
            "Beklenmeyen bir hata oluştu.",
            0,
            null
        );
    }

    const status =
        error.response?.status ?? 0;

    const data =
        error.response?.data ?? null;

    const message =
        data?.message ??
        (
            status === 0
                ? "Sunucuya bağlanılamadı."
                : "İşlem gerçekleştirilemedi."
        );

    return createError(
        message,
        status,
        data
    );
}

function createError(
    message: string,
    status: number,
    data: ApiErrorData | null
): ApiError {
    const error =
        new Error(message) as ApiError;

    error.status = status;
    error.data = data;

    return error;
}

function isRefreshExcludedEndpoint(
    endpoint: string
): boolean {
    return AUTH_ENDPOINTS_WITHOUT_REFRESH
        .some((authEndpoint) =>
            endpoint.includes(authEndpoint)
        );
}

function shouldRefreshRequest(
    status: number | undefined,
    request: RetryRequestConfig | undefined
): request is RetryRequestConfig {
    if (
        status !== 401 ||
        !request ||
        request._retry
    ) {
        return false;
    }

    const endpoint =
        request.url ?? "";

    return !isRefreshExcludedEndpoint(
        endpoint
    );
}

const axiosClient =
    axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true,
        headers: {
            "Content-Type":
                "application/json"
        }
    });

let refreshPromise:
    Promise<void> | null =
    null;

async function refreshToken(): Promise<void> {
    await axiosClient.post(
        "/auth/refresh"
    );
}

function getRefreshPromise(): Promise<void> {
    if (!refreshPromise) {
        refreshPromise =
            refreshToken()
                .finally(() => {
                    refreshPromise = null;
                });
    }

    return refreshPromise;
}

axiosClient.interceptors.response.use(
    (response) => response,

    async (error: unknown) => {
        if (!axios.isAxiosError(error)) {
            return Promise.reject(
                createApiError(error)
            );
        }

        const originalRequest =
            error.config as
                | RetryRequestConfig
                | undefined;

        const status =
            error.response?.status;

        if (
            !shouldRefreshRequest(
                status,
                originalRequest
            )
        ) {
            return Promise.reject(
                createApiError(error)
            );
        }

        originalRequest._retry = true;

        try {
            await getRefreshPromise();

            return axiosClient(
                originalRequest
            );
        } catch (refreshError) {
            return Promise.reject(
                createApiError(
                    refreshError
                )
            );
        }
    }
);

export default axiosClient;
