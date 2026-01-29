import { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({ 
  columns, 
  data, 
  onRowClick,
  emptyMessage = 'No data found' 
}: DataTableProps<T>) {
  const getCellValue = (item: T, accessor: Column<T>['accessor']): ReactNode => {
    if (typeof accessor === 'function') {
      return accessor(item);
    }
    return item[accessor] as ReactNode;
  };

  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className={`px-4 py-3 text-left text-sm font-semibold text-foreground ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item) => (
              <tr 
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={`transition-colors hover:bg-muted/50 ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((column, index) => (
                  <td 
                    key={index} 
                    className={`px-4 py-3 text-sm text-foreground ${column.className || ''}`}
                  >
                    {getCellValue(item, column.accessor)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
