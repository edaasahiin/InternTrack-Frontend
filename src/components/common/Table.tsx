import type {
    ReactNode
} from "react";

export interface TableColumn<T> {
    key: string;

    header: string;

    render: (
        item: T
    ) => ReactNode;

    className?: string;

    headerClassName?: string;
}

interface TableProps<T> {
    data: T[];

    columns:
        TableColumn<T>[];

    getRowKey: (
        item: T
    ) => string | number;

    emptyMessage?: string;

    rowClassName?: (
        item: T
    ) => string;
}

function Table<T>({
    data,
    columns,
    getRowKey,
    emptyMessage =
        "Gösterilecek kayıt bulunamadı.",
    rowClassName
}: TableProps<T>) {
    if (data.length === 0) {
        return (
            <div className="table-empty">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="table-wrapper">
            <table className="common-table">
                <thead>
                    <tr>
                        {columns.map(
                            (column) => (
                                <th
                                    key={
                                        column.key
                                    }
                                    className={
                                        column
                                            .headerClassName
                                    }
                                >
                                    {
                                        column.header
                                    }
                                </th>
                            )
                        )}
                    </tr>
                </thead>

                <tbody>
                    {data.map(
                        (item) => (
                            <tr
                                key={
                                    getRowKey(
                                        item
                                    )
                                }
                                className={
                                    rowClassName
                                        ? rowClassName(
                                              item
                                          )
                                        : ""
                                }
                            >
                                {columns.map(
                                    (
                                        column
                                    ) => (
                                        <td
                                            key={
                                                column.key
                                            }
                                            className={
                                                column.className
                                            }
                                        >
                                            {column.render(
                                                item
                                            )}
                                        </td>
                                    )
                                )}
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Table;