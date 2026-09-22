import type { ActiveFilter } from "../../utils/activeFilter";

interface ActiveFilterSelectProps {
    id: string;
    label: string;
    className: string;
    value: ActiveFilter;
    onChange: (value: ActiveFilter) => void | Promise<void>;
}

const ACTIVE_FILTER_OPTIONS = [
    { value: "Active", label: "Aktifler" },
    { value: "Inactive", label: "Pasifler" },
    { value: "All", label: "Tümü" }
] as const satisfies ReadonlyArray<{ value: ActiveFilter; label: string }>;

function ActiveFilterSelect({
    id,
    label,
    className,
    value,
    onChange
}: ActiveFilterSelectProps) {
    return (
        <div className={className}>
            <label htmlFor={id}>{label}</label>
            <select
                id={id}
                value={value}
                onChange={(event) => {
                    const option = ACTIVE_FILTER_OPTIONS.find(
                        (item) => item.value === event.target.value
                    );

                    if (option) {
                        onChange(option.value);
                    }
                }}
            >
                {ACTIVE_FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ActiveFilterSelect;
