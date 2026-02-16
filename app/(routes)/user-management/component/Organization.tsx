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
import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutGrid,
  Table as TableIcon,
  ArrowUpDown,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import { DeleteConfirmationDialog } from "./modals/delete-confirmation-dialog";
import { useOrgList, useDeleteOrg, useEditOrg } from "./api";
import { EditOrganizationDialog } from "./modals/edit-dialog";
import { toast } from "sonner";

type Organization = {
  org_id: string;
  org_name: string;
};

export default function OrganizationList() {
  const [view, setView] = useState<"table" | "card">("table");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const { data = [], isLoading, error } = useOrgList();
  const deleteOrgMutation = useDeleteOrg();
  const editOrgMutation = useEditOrg();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [editName, setEditName] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingOrg, setDeletingOrg] = useState<Organization | null>(null);

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setEditName(org.org_name);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = () => {
  if (!editingOrg || !editName.trim()) return;

  editOrgMutation.mutate(
    {
      org_id: editingOrg.org_id,
      org_name: editName.trim(),
    },
    {
      onSuccess: () => {
        toast.success("Organization updated successfully");
        setIsEditDialogOpen(false);
        setEditingOrg(null);
        setEditName("");
      },
    }
  );
};

  const handleDelete = (org: Organization) => {
    setDeletingOrg(org);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingOrg) return;

    deleteOrgMutation.mutate(
      {
        org_id: deletingOrg.org_id,
      },
      {
        onSuccess: () => {
          toast.success("Organization deleted successfully");
          setIsDeleteDialogOpen(false);
          setDeletingOrg(null);
        },
      },
    );
  };

  const columns: ColumnDef<Organization>[] = [
    {
      id: "serialNumber",
      header: "S.No",
      cell: ({ row }) => (
        <span className="text-muted-foreground font-medium">
          {row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "org_name",
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-2 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting()}
        >
          Organization Name
          <ArrowUpDown className="size-4" />
        </button>
      ),
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {row.original.org_name}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
            className="size-8 text-primary bg-primary/10 hover:bg-primary/20 hover:scale-110 transition-all duration-200"
          >
            <Pencil className="size-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original)}
            className="size-8 text-destructive bg-destructive/10 hover:bg-destructive/20 hover:scale-110 transition-all duration-200"
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
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

  if (isLoading) return <div>Loading organizations...</div>;
  
  if (error) return <div>Failed to load organizations</div>;
  return (
    <div className="space-y-4">
      {/* Header with Search and View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("table")}
            className={`gap-2 ${
              view === "table"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TableIcon className="size-4" />
            Table
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("card")}
            className={`gap-2 ${
              view === "card"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="size-4" />
            Cards
          </Button>
        </div>
      </div>

      {/* Table View */}
      {view === "table" && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="bg-muted/50 border-b border-border"
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-muted-foreground font-semibold"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors duration-150"
                    >
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
                      className="h-24 text-center text-muted-foreground"
                    >
                      No organizations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <div className="flex gap-2">
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
        </div>
      )}

      {/* Card View */}
      {view === "card" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {table.getRowModel().rows.map((row, index) => (
            <Card
              key={row.id}
              className="group hover:shadow-lg hover:border-primary/30 transition-all duration-200 border-border"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 w-full">
                  <span className="text-xs text-muted-foreground font-medium">
                    #{index + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground truncate">
                    {row.original.org_name}
                  </span>
                </div>

                <div className="flex items-center justify-end mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(row.original)}
                      className="size-8 text-primary bg-primary/10 hover:bg-primary/20 hover:scale-110 transition-all duration-200"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(row.original)}
                      className="size-8 text-destructive bg-destructive/10 hover:bg-destructive/20 hover:scale-110 transition-all duration-200"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {table.getRowModel().rows.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No organizations found.
            </div>
          )}
        </div>
      )}

      <EditOrganizationDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        name={editName}
        onNameChange={setEditName}
        onSave={handleEditSave}
        orgId={editingOrg?.org_id ?? ""}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Organization"
        itemName={deletingOrg?.org_name ?? ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
