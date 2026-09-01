export function getErrorMessage(error) {
    if (error?.data?.errors) {
        const firstError = Object.values(
            error.data.errors
        )[0];

        if (
            Array.isArray(firstError) &&
            firstError.length > 0
        ) {
            return firstError[0];
        }
    }

    if (error?.status === 403) {
        return (
            error?.data?.message ||
            "Bu işlem için yetkiniz yok."
        );
    }

    return (
        error?.data?.message ||
        error?.message ||
        "Bir hata oluştu."
    );
}