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

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    roleName: string;
    organizationId: number;
    organizationName: string;
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

// Dummy users data
const usersData: User[] = [
    { id: 1, firstName: "John", lastName: "Doe", email: "john.doe@example.com", roleId: 1, roleName: "Admin", organizationId: 1, organizationName: "Tech Corp" },
    { id: 2, firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", roleId: 2, roleName: "Manager", organizationId: 1, organizationName: "Tech Corp" },
    { id: 3, firstName: "Robert", lastName: "Johnson", email: "robert.j@example.com", roleId: 3, roleName: "Developer", organizationId: 2, organizationName: "Design Studio" },
    { id: 4, firstName: "Emily", lastName: "Davis", email: "emily.d@example.com", roleId: 3, roleName: "Developer", organizationId: 1, organizationName: "Tech Corp" },
    { id: 5, firstName: "Michael", lastName: "Wilson", email: "michael.w@example.com", roleId: 4, roleName: "Designer", organizationId: 2, organizationName: "Design Studio" },
    { id: 6, firstName: "Sarah", lastName: "Brown", email: "sarah.b@example.com", roleId: 5, roleName: "Viewer", organizationId: 3, organizationName: "Marketing Inc" },
    { id: 7, firstName: "David", lastName: "Lee", email: "david.lee@example.com", roleId: 2, roleName: "Manager", organizationId: 4, organizationName: "Finance Group" },
    { id: 8, firstName: "Lisa", lastName: "Garcia", email: "lisa.g@example.com", roleId: 3, roleName: "Developer", organizationId: 3, organizationName: "Marketing Inc" },
];

export default function UserList() {
    const [users, setUsers] = useState<User[]>(usersData);
    const [view, setView] = useState<"table" | "card">("table");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    // Edit dialog state
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editFirstName, setEditFirstName] = useState("");
    const [editLastName, setEditLastName] = useState("");
    const [editRoleId, setEditRoleId] = useState("");
    const [editOrganizationId, setEditOrganizationId] = useState("");

    // Delete dialog state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    // Handle edit
    const handleEdit = (user: User) => {
        setEditingUser(user);
        setEditFirstName(user.firstName);
        setEditLastName(user.lastName);
        setEditRoleId(user.roleId.toString());
        setIsEditDialogOpen(true);
        setEditOrganizationId(user.organizationId.toString());
    };

    const handleEditSave = () => {
        if (editingUser && editFirstName.trim() && editLastName.trim() && editRoleId) {
            const selectedRole = rolesData.find((r) => r.id.toString() === editRoleId);
            const selectedOrganization = organizationsData.find((org) => org.id.toString() === editOrganizationId);
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === editingUser.id
                        ? {
                            ...user,
                            firstName: editFirstName.trim(),
                            lastName: editLastName.trim(),
                            roleId: parseInt(editRoleId),
                            roleName: selectedRole?.name || user.roleName,
                            organizationId: parseInt(editOrganizationId),
                            organizationName: selectedOrganization?.name || user.organizationName,
                        }
                        : user
                )
            );
            setIsEditDialogOpen(false);
            setEditingUser(null);
            setEditFirstName("");
            setEditLastName("");
            setEditRoleId("");
            setEditOrganizationId("");
        }
    };

    // Handle delete
    const handleDelete = (user: User) => {
        setDeletingUser(user);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (deletingUser) {
            setUsers((prev) => prev.filter((user) => user.id !== deletingUser.id));
            setIsDeleteDialogOpen(false);
            setDeletingUser(null);
        }
    };

    const columns: ColumnDef<User>[] = [
        {
            id: "serialNumber",
            header: "S.No",
            cell: ({ row }) => (
                <span className="text-muted-foreground font-medium">{row.index + 1}</span>
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
            accessorFn: (row) => `${row.firstName} ${row.lastName}`,
            cell: ({ row }) => (
                <span className="font-medium text-foreground">
                    {row.original.firstName} {row.original.lastName}
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
            accessorKey: "roleName",
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
                    {row.original.roleName}
                </span>
            ),
        },
        {
            accessorKey: "organizationName",
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
                <span className="text-muted-foreground">{row.original.organizationName}</span>
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
                        className={`gap-2 ${view === "table"
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
                        className={`gap-2 ${view === "card"
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
                                    <tr key={headerGroup.id} className="bg-muted/50 border-b border-border">
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className="px-4 py-3 text-left text-muted-foreground font-semibold"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
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
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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
                        <Card key={row.id} className="group hover:shadow-lg hover:border-primary/30 transition-all duration-200 border-border">
                            <CardContent className="p-4">
                                {/* Row 1: Name and Role Badge */}
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground font-medium">#{index + 1}</span>
                                        <span className="text-sm font-medium text-foreground">
                                            {row.original.firstName} {row.original.lastName}
                                        </span>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                        {row.original.roleName}
                                    </span>
                                </div>

                                {/* Row 2: Email and Organization */}
                                <div className="mt-2 space-y-1">
                                    <span className="text-xs text-muted-foreground block">{row.original.email}</span>
                                    <span className="text-xs text-muted-foreground block">{row.original.organizationName}</span>
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
                roles={rolesData}
                selectedOrganizationId={editOrganizationId}
                onOrganizationChange={setEditOrganizationId}
                organizations={organizationsData}
                onSave={handleEditSave}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="User"
                itemName={deletingUser ? `${deletingUser.firstName} ${deletingUser.lastName}` : ""}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
