import React from "react";
import { cn } from "@/lib/utils"

export interface TableColumn<T = any> {
  title: string;
  dataIndex: keyof T | ((row: T, index: number) => React.ReactNode);
  className?: string;
}

interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  rowProps?: (row: T, index: number) => React.HTMLAttributes<HTMLTableRowElement> | any;
}

export default function Table<T = any>({ columns, data, rowProps }: TableProps<T>) {
  return (
    <div className={cn("overflow-x-auto border border-border/50 rounded-md relative", "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100")}
      style={{ WebkitOverflowScrolling: "touch" }}>
      <table className={cn("min-w-full text-sm")}> 
        <thead className={cn("bg-background")}> 
          <tr>
            {columns.map((col) => (
              <th
                key={col.title}
                className={cn("sm:px-4 px-1 sm:py-2 py-1 text-left font-medium text-muted-foreground sm:text-sm text-xs", col.className)}
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
              <tr key={i} className={cn("border-t text-muted-foreground border border-border/35")} {...trProps}>
                {columns.map((col, j) => {
                  let value;
                  if (typeof col.dataIndex === "function") {
                    value = col.dataIndex(row, i);
                  } else {
                    value = row[col.dataIndex];
                  }
                  return (
                    <td key={j} className={cn("sm:px-4 px-1 sm:py-2 py-1 sm:text-sm text-xs")}> 
                      {React.isValidElement(value) ? value : String(value)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Visual cue for horizontal scroll on mobile */}
      <div className="pointer-events-none absolute top-0 right-0 h-full w-4 bg-gradient-to-l from-background/80 to-transparent hidden sm:block" />
    </div>
  );
} 