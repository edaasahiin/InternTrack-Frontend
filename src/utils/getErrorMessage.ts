interface ApiErrorData {
    message?: string;
    errors?: Record<string, string[]>;
}

interface ApiError {
    status?: number;
    message?: string;
    data?: ApiErrorData;
}

export function getErrorMessage(
    error: unknown
): string {
    const apiError =
        error as ApiError;

    if (apiError?.data?.errors) {
        const firstError =
            Object.values(
                apiError.data.errors
            )[0];

        if (
            Array.isArray(firstError) &&
            firstError.length > 0
        ) {
            return firstError[0];
        }
    }

    if (apiError?.status === 403) {
        return (
            apiError?.data?.message ||
            "Bu işlem için yetkiniz yok."
        );
    }

    return (
        apiError?.data?.message ||
        apiError?.message ||
        "Bir hata oluştu."
    );
}