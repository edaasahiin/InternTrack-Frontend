export function isAdminOrHR(
    role?: string
): boolean {
    return (
        role === "Admin" ||
        role === "HR"
    );
}