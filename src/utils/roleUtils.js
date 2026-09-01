export function isAdminOrHR(role) {
    return (
        role === "Admin" ||
        role === "HR"
    );
}