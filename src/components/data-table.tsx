import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row, // Import Row type
  RowSelectionState
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils'; // Import cn for conditional classes

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterInputPlaceholder?: string;
  filterColumnId?: string; // ID of the column to filter on
  onRowClick?: (row: Row<TData>) => void; // Add onRowClick prop
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterInputPlaceholder = 'Filter...',
  filterColumnId = '',
  onRowClick, // Destructure onRowClick
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
   const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
   const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
     onColumnVisibilityChange: setColumnVisibility,
     onRowSelectionChange: setRowSelection,
    // Enable row selection even if the checkbox column is removed,
    // as it might be used internally or for future features.
    // If row selection is definitely not needed, set this to false.
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    // Pass meta to potentially access onRowClick in cell renderers if needed later
    // meta: {
    //   onRowClick,
    // },
  });

  const handleRowClick = (row: Row<TData>, event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    if (!onRowClick) return;

    // Prevent navigation if clicking on interactive elements like buttons, inputs, dropdown triggers etc.
    const target = event.target as HTMLElement;
    // Check if the click target is inside a button, input, select, textarea, or has a role indicating interaction
    if (
      target.closest('button, input, select, textarea, [role="button"], [role="checkbox"], [role="menuitem"], [data-state="open"]') // Check common interactive elements and dropdown triggers/content
    ) {
      return;
    }

    onRowClick(row);
  };


  return (
    <div>
      {/* Filter Input */}
      {filterColumnId && (
         <div className="flex items-center py-4">
            <Input
            placeholder={filterInputPlaceholder}
            value={(table.getColumn(filterColumnId)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn(filterColumnId)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
            {/* Optional: Column Visibility Dropdown */}
            {/* ... */}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={(e) => handleRowClick(row, e)} // Add onClick handler
                  className={cn(
                    onRowClick && "cursor-pointer hover:bg-muted/50" // Add hover effect if clickable
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
         {/* Removed the selected row count display as the selection mechanism (checkbox) is gone */}
         {/* <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
        <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} row(s) found. {/* Display total filtered rows */}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
