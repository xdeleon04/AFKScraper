"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type Row,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTableToolbar } from "./data-table-toolbar"
import type { Character } from "@/lib/types"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onDataUpdate: (data: TData[]) => void
}

export function CharacterTable<TData extends Character, TValue>({
  columns,
  data,
  onDataUpdate,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      columnFilters,
    },
    initialState: {
        pagination: {
            pageSize: data.length,
        },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const handleRowClick = (row: Row<TData>) => {
    const characterId = (row.original as Character).id;
    const newData = data.map(char => 
        (char as Character).id === characterId ? { ...char, completed: !char.completed } : char
    );

    const sortedData = [...newData].sort((a, b) => {
      const charA = a as Character;
      const charB = b as Character;

      // Primary sorting: completed characters always go to the bottom.
      if (charA.completed && !charB.completed) return 1;
      if (!charA.completed && charB.completed) return -1;
      
      // Secondary sorting: respect the table's active sort order.
      const sortOrder = table.getState().sorting;
      if (sortOrder.length > 0) {
        for (const sort of sortOrder) {
          const column = table.getColumn(sort.id);
          if (column) {
            const sortingFn = column.getSortingFn();
            if (sortingFn) {
              const rowA = table.getRow(charA.id) ?? { original: a } as Row<TData>;
              const rowB = table.getRow(charB.id) ?? { original: b } as Row<TData>;
              
              // We need to create mock Row objects if they are not found in the table instance,
              // as the data has been updated.
              const mockRowA = rowA.original ? rowA : { original: a } as Row<TData>;
              const mockRowB = rowB.original ? rowB : { original: b } as Row<TData>;
              
              const sortResult = sortingFn(mockRowA, mockRowB, sort.id) * (sort.desc ? -1 : 1);
              if (sortResult !== 0) return sortResult;
            }
          }
        }
      }
      return 0;
    });

    onDataUpdate(sortedData);
  }

  React.useEffect(() => {
    // When sorting changes, we need to re-apply our custom completed logic
    const sortOrder = table.getState().sorting;
    if (sortOrder.length > 0) {
        const sortedData = [...data].sort((a, b) => {
            const charA = a as Character;
            const charB = b as Character;

            if (charA.completed && !charB.completed) return 1;
            if (!charA.completed && charB.completed) return -1;

            for (const sort of sortOrder) {
                const column = table.getColumn(sort.id);
                if (column) {
                    const sortingFn = column.getSortingFn();
                    if (sortingFn) {
                        const rowA = table.getRow(charA.id) ?? { original: a } as Row<TData>;
                        const rowB = table.getRow(charB.id) ?? { original: b } as Row<TData>;
                        const mockRowA = rowA.original ? rowA : { original: a } as Row<TData>;
                        const mockRowB = rowB.original ? rowB : { original: b } as Row<TData>;
                        const sortResult = sortingFn(mockRowA, mockRowB, sort.id) * (sort.desc ? -1 : 1);
                        if (sortResult !== 0) return sortResult;
                    }
                }
            }
            return 0;
        });
        onDataUpdate(sortedData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting, table]);

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} data={data as Character[]}/>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleRowClick(row)}
                  className="cursor-pointer"
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
    </div>
  )
}
