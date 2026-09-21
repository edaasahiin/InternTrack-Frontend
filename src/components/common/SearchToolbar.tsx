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
    const shouldShowAddButton =
        showAddButton &&
        addButtonText &&
        onAdd;

    return (
        <div className="search-toolbar">
            {shouldShowAddButton && (
                <div className="search-toolbar-header">
                    <div />

                    <button
                        type="button"
                        className="search-toolbar-add-button"
                        onClick={
                            onAdd
                        }
                    >
                        {addButtonText}
                    </button>
                </div>
            )}

            <div className="search-toolbar-controls">
                <div className="search-toolbar-search-field">
                    <label
                        htmlFor="search-toolbar-input"
                    >
                        {title}
                    </label>

                    <input
                        id="search-toolbar-input"
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
                </div>

                {children}
            </div>
        </div>
    );
}

export default SearchToolbar;