export type ActiveFilter =
    | "Active"
    | "Inactive"
    | "All";

export function shouldIncludeInactive(
    isAdmin: boolean,
    filter: ActiveFilter
): boolean {
    return (
        isAdmin &&
        filter !== "Active"
    );
}

export function matchesActiveFilter(
    isActive: boolean,
    filter: ActiveFilter
): boolean {
    if (filter === "Active") {
        return isActive;
    }

    if (filter === "Inactive") {
        return !isActive;
    }

    return true;
}

export function normalizeSearchText(
    value: string
): string {
    return value
        .trim()
        .toLowerCase();
}
