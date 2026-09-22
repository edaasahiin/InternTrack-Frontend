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

    children?: ReactNode;
}

function SearchToolbar({
    title,
    searchValue,
    searchPlaceholder,
    onSearchChange,
    children
}: SearchToolbarProps) {
    return (
        <div className="search-toolbar">
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
