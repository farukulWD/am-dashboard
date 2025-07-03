import React from "react";

export interface TableColumn<T = any> {
  title: string;
  dataIndex: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  rowProps?: (row: T, index: number) => React.HTMLAttributes<HTMLTableRowElement> | any;
}

export default function Table<T = any>({ columns, data, rowProps }: TableProps<T>) {
  return (
    <div className="overflow-x-auto border border-border/50 rounded-md">
      <table className="min-w-full text-sm">
        <thead className="bg-background">
          <tr>
            {columns.map((col) => (
              <th
                key={col.title}
                className={`px-4 py-2 text-left font-medium text-muted-foreground ${col.className || ""}`}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const trProps = rowProps ? rowProps(row, i) : {};
            return (
              <tr key={i} className="border-t text-muted-foreground border border-border/35" {...trProps}>
                {columns.map((col, j) => {
                  let value;
                  if (typeof col.dataIndex === "function") {
                    value = col.dataIndex(row);
                  } else {
                    value = row[col.dataIndex];
                  }
                  return (
                    <td key={j} className="px-4 py-2">
                      {React.isValidElement(value) ? value : String(value)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
} 