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
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { EditOrganizationDialog, EditUserDialog } from "./edit-dialog";
import { useDeleteUser, usersList } from "./api";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_id: string;
  role: string;
  organizationId: string;
  org: string;
};

type Role = {
  id: number;
  name: string;
};

type Organization = {
  id: number;
  name: string;
};

// Dummy organizations data
const organizationsData: Organization[] = [
  { id: 1, name: "Tech Corp" },
  { id: 2, name: "Design Studio" },
  { id: 3, name: "Marketing Inc" },
  { id: 4, name: "Finance Group" },
];

// Dummy roles data
const rolesData: Role[] = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Manager" },
  { id: 3, name: "Developer" },
  { id: 4, name: "Designer" },
  { id: 5, name: "Viewer" },
];

export default function UserList() {
  // const [users, setUsers] = useState<User[]>(usersData);
  const [view, setView] = useState<"table" | "card">("table");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const { data = [], isLoading, error } = usersList();
  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editRoleId, setEditRoleId] = useState("");
  const [editOrganizationId, setEditOrganizationId] = useState("");
 const deleteUserMutation = useDeleteUser();
  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const roles = Array.from(
    new Map(data.map((u:any) => [u.role, { id: u.role, name: u.role }])).values(),
  );

  const organizations = Array.from(
    new Map(data.map((u:any) => [u.org, { id: u.org, name: u.org }])).values(),
  );

  // Handle edit
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditFirstName(user.first_name);
    setEditLastName(user.last_name);
    setEditRoleId(user.user_id.toString());
    setIsEditDialogOpen(true);
    setEditOrganizationId(user.organizationId.toString());
  };

  const handleEditSave = () => {
    // if (editingUser && editFirstName.trim() && editLastName.trim() && editRoleId) {
    //     const selectedRole = rolesData.find((r) => r.id.toString() === editRoleId);
    //     const selectedOrganization = organizationsData.find((org) => org.id.toString() === editOrganizationId);
    //     setUsers((prev) =>
    //         prev.map((user) =>
    //             user.id === editingUser.id
    //                 ? {
    //                     ...user,
    //                     firstName: editFirstName.trim(),
    //                     lastName: editLastName.trim(),
    //                     roleId: parseInt(editRoleId),
    //                     roleName: selectedRole?.name || user.roleName,
    //                     organizationId: parseInt(editOrganizationId),
    //                     organizationName: selectedOrganization?.name || user.organizationName,
    //                 }
    //                 : user
    //         )
    //     );
    //     setIsEditDialogOpen(false);
    //     setEditingUser(null);
    //     setEditFirstName("");
    //     setEditLastName("");
    //     setEditRoleId("");
    //     setEditOrganizationId("");
    // }
  };

  // Handle delete
  const handleDelete = (user: User) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

const handleDeleteConfirm = () => {
  if (!deletingUser) return;

  deleteUserMutation.mutate(
    { user_id: deletingUser.user_id },   // ✅ payload object
    {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setDeletingUser(null);
      },
      onError: (error) => {
        console.error("Delete failed:", error);
      },
    }
  );
};


  const columns: ColumnDef<User>[] = [
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
      accessorKey: "name",
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-2 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting()}
        >
          Name
          <ArrowUpDown className="size-4" />
        </button>
      ),
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {row.original.first_name} {row.original.last_name}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-2 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting()}
        >
          Email
          <ArrowUpDown className="size-4" />
        </button>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-2 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting()}
        >
          Role
          <ArrowUpDown className="size-4" />
        </button>
      ),
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {row.original.role}
        </span>
      ),
    },
    {
      accessorKey: "org",
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-2 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting()}
        >
          Organization
          <ArrowUpDown className="size-4" />
        </button>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.org}</span>
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
    data: data,
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

  if (isLoading) return <div className="p-6">Loading users...</div>;

  if (error)
    return <div className="p-6 text-red-500">Failed to load users</div>;

  return (
    <div className="space-y-4">
      {/* Header with Search and View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
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
                      No users found.
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
                {/* Row 1: Name and Role Badge */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {row.original.first_name} {row.original.last_name}
                    </span>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {row.original.role}
                  </span>
                </div>

                {/* Row 2: Email and Organization */}
                <div className="mt-2 space-y-1">
                  <span className="text-xs text-muted-foreground block">
                    {row.original.email}
                  </span>
                  <span className="text-xs text-muted-foreground block">
                    {row.original.org}
                  </span>
                </div>

                {/* Row 3: Edit, Delete */}
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
              No users found.
            </div>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <EditUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        firstName={editFirstName}
        onFirstNameChange={setEditFirstName}
        lastName={editLastName}
        onLastNameChange={setEditLastName}
        selectedRoleId={editRoleId}
        onRoleChange={setEditRoleId}
        roles={roles}
        selectedOrganizationId={editOrganizationId}
        onOrganizationChange={setEditOrganizationId}
        organizations={organizations}
        onSave={handleEditSave}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="User"
        itemName={
          deletingUser
            ? `${deletingUser.first_name} ${deletingUser.last_name}`
            : ""
        }
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
