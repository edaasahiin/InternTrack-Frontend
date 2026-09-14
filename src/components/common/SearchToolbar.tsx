import type {
    ReactNode
} from "react";

interface SearchToolbarProps {
    title: string;

    searchValue: string;

    searchPlaceholder: string;

    onSearchChange: (
        value: string
    ) => void;

    addButtonText?: string;

    onAdd?: () => void;

    showAddButton?: boolean;

    children?: ReactNode;
}

function SearchToolbar({
    title,
    searchValue,
    searchPlaceholder,
    onSearchChange,
    addButtonText,
    onAdd,
    showAddButton = true,
    children
}: SearchToolbarProps) {
    return (
        <div className="search-toolbar">
            <div className="search-toolbar-header">
                <h3>
                    {title}
                </h3>

                {showAddButton &&
                    addButtonText &&
                    onAdd && (
                        <button
                            type="button"
                            className="search-toolbar-add-button"
                            onClick={
                                onAdd
                            }
                        >
                            {addButtonText}
                        </button>
                    )}
            </div>

            <div className="search-toolbar-controls">
                <input
                    type="text"
                    placeholder={
                        searchPlaceholder
                    }
                    value={
                        searchValue
                    }
                    onChange={(event) =>
                        onSearchChange(
                            event.target.value
                        )
                    }
                />

                {children}
            </div>
        </div>
    );
}

export default SearchToolbar;