import type {
    ApiError
} from "../api/axiosClient";

export function getErrorMessage(
    error: unknown
): string {
    const apiError =
        error as ApiError;

    const validationErrors =
        apiError?.data?.errors;

    if (validationErrors) {
        const firstError =
            Object.values(
                validationErrors
            )[0];

        if (
            firstError &&
            firstError.length > 0
        ) {
            return firstError[0];
        }
    }

    if (apiError?.status === 403) {
        return (
            apiError.data?.message ??
            "Bu işlem için yetkiniz yok."
        );
    }

    return (
        apiError?.data?.message ??
        apiError?.message ??
        "Bir hata oluştu."
    );
}