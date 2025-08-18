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
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'completed', desc: false } // Initial sort to keep completed at bottom
  ])

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
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        const newData = data.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...(row as TData),
              [columnId]: value,
            }
          }
          return row
        })
        onDataUpdate(newData)
      }
    },
    sortDescFirst: false,
  })

  const handleRowClick = (row: Row<TData>) => {
    const characterId = row.original.id;
    const newData = data.map(char => 
        char.id === characterId ? { ...char, completed: !char.completed } : char
    );
    onDataUpdate(newData);
  }

  // Effect to re-sort data when it changes
  React.useEffect(() => {
    const sortedData = table.getSortedRowModel().rows.map(row => row.original);
    // Prevent infinite loop by checking if data is actually different
    if (JSON.stringify(data) !== JSON.stringify(sortedData)) {
      onDataUpdate(sortedData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting, data]);


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
