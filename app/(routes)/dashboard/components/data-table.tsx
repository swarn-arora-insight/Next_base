"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LayoutGrid, Table as TableIcon, ArrowUpDown } from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
};

const users: User[] = [
  {
    id: 1,
    name: "Amit Bohra",
    email: "amit@gmail.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Neha Verma",
    email: "neha@gmail.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: 4,
    name: "Kunal Singh",
    email: "kunal@gmail.com",
    role: "User",
    status: "Active",
  },
  {
    id: 5,
    name: "Pooja Mehta",
    email: "pooja@gmail.com",
    role: "Viewer",
    status: "Inactive",
  },
  {
    id: 1,
    name: "Amit Bohra",
    email: "amit@gmail.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Neha Verma",
    email: "neha@gmail.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: 4,
    name: "Kunal Singh",
    email: "kunal@gmail.com",
    role: "User",
    status: "Active",
  },
  {
    id: 5,
    name: "Pooja Mehta",
    email: "pooja@gmail.com",
    role: "Viewer",
    status: "Inactive",
  },
  {
    id: 1,
    name: "Amit Bohra",
    email: "amit@gmail.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Neha Verma",
    email: "neha@gmail.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: 4,
    name: "Kunal Singh",
    email: "kunal@gmail.com",
    role: "User",
    status: "Active",
  },
  {
    id: 5,
    name: "Pooja Mehta",
    email: "pooja@gmail.com",
    role: "Viewer",
    status: "Inactive",
  }
];

export default function DataTable() {
  const [view, setView] = useState<"table" | "card">("table");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <div className="flex" onClick={() => column.toggleSorting()}>
          ID <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <div className="flex" onClick={() => column.toggleSorting()}>
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <div className="flex" onClick={() => column.toggleSorting()}>
          Role <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            row.original.status === "Active"
              ? "bg-text-secondary/20 text-text-secondary"
              : "bg-destructive/20 text-destructive"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="mx-4">
      {/*Toggle */}
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search users..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs border-border"
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setView("table")}
            className={view === "table" ? "bg-primary text-text" : ""}
          >
            <TableIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setView("card")}
            className={view === "card" ? "bg-primary text-text" : ""}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/*TABLE */}
      {view === "table" && (
        <div className="rounded-xl border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary text-text">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th key={header.id} className="px-2 py-2 text-left">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-muted/50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-6 text-center text-sm text-muted-foreground"
                  >
                  No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/*Pagination */}
          <div className="flex items-center justify-between p-3">
            <span className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CARD VIEW */}
      {view === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="rounded-xl border bg-card p-4 shadow-sm"
            >
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">{row.original.name}</h3>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    row.original.status === "Active"
                      ? "bg-text-secondary/20 text-text-secondary"
                      : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {row.original.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {row.original.email}
              </p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Role:</span> {row.original.role}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
