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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    LayoutGrid,
    Table as TableIcon,
    ArrowUpDown,
    Pencil,
    Trash2,
    Search,
    List,
} from "lucide-react";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { EditRoleDialog } from "./edit-dialog";

type Organization = {
    id: number;
    name: string;
};

type Role = {
    id: number;
    name: string;
    organizationId: number;
    userCount: number;
    userNames: string[];
};

// Dummy data for organizations
const organizationsData: Organization[] = [
    { id: 1, name: "Acme Corporation" },
    { id: 2, name: "TechStart Inc." },
    { id: 3, name: "Global Solutions Ltd." },
    { id: 4, name: "InnovateTech" },
    { id: 5, name: "Digital Dynamics" },
];

// Dummy data for roles
const rolesData: Role[] = [
    { id: 1, name: "Administrator", organizationId: 1, userCount: 3, userNames: ["John Doe", "Jane Smith", "Mike Johnson"] },
    { id: 2, name: "Manager", organizationId: 1, userCount: 5, userNames: ["Alice Brown", "Bob Wilson", "Carol Davis", "David Lee", "Emma White"] },
    { id: 3, name: "Developer", organizationId: 2, userCount: 8, userNames: ["Frank Miller", "Grace Chen", "Henry Taylor", "Ivy Martinez", "Jack Anderson", "Kate Thomas", "Leo Garcia", "Mia Robinson"] },
    { id: 4, name: "Designer", organizationId: 2, userCount: 2, userNames: ["Noah Clark", "Olivia Lewis"] },
    { id: 5, name: "Analyst", organizationId: 3, userCount: 4, userNames: ["Peter Hall", "Quinn Young", "Rachel King", "Sam Wright"] },
    { id: 6, name: "Support", organizationId: 4, userCount: 6, userNames: ["Tina Scott", "Uma Green", "Victor Adams", "Wendy Baker", "Xavier Hill", "Yara Nelson"] },
    { id: 7, name: "Viewer", organizationId: 5, userCount: 10, userNames: ["Zack Moore", "Amy Turner", "Ben Phillips", "Cathy Evans", "Dan Murphy", "Eva Rogers", "Fred Cook", "Gina Morgan", "Harry Bell", "Iris Foster"] },
];

export default function RolesList() {
    const [roles, setRoles] = useState<Role[]>(rolesData);
    const [view, setView] = useState<"table" | "card">("table");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    // Edit dialog state
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [editRoleName, setEditRoleName] = useState("");
    const [editOrgId, setEditOrgId] = useState("");

    // Delete dialog state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingRole, setDeletingRole] = useState<Role | null>(null);

    // Handle edit
    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setEditRoleName(role.name);
        setEditOrgId(role.organizationId.toString());
        setIsEditDialogOpen(true);
    };

    const handleEditSave = () => {
        if (editingRole && editRoleName.trim() && editOrgId) {
            setRoles((prev) =>
                prev.map((role) =>
                    role.id === editingRole.id
                        ? { ...role, name: editRoleName.trim(), organizationId: parseInt(editOrgId) }
                        : role
                )
            );
            setIsEditDialogOpen(false);
            setEditingRole(null);
            setEditRoleName("");
            setEditOrgId("");
        }
    };

    // Handle delete
    const handleDelete = (role: Role) => {
        setDeletingRole(role);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (deletingRole) {
            setRoles((prev) => prev.filter((role) => role.id !== deletingRole.id));
            setIsDeleteDialogOpen(false);
            setDeletingRole(null);
        }
    };

    // Handle feature list click
    const handleFeatureList = (role: Role) => {
        console.log(`Feature list for role: ${role.name}`);
    };

    // Truncate user names
    const getTruncatedUserNames = (userNames: string[], maxLength: number = 30) => {
        const joined = userNames.join(", ");
        if (joined.length <= maxLength) return joined;
        return joined.substring(0, maxLength) + "...";
    };

    const columns: ColumnDef<Role>[] = [
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
                    Role Name
                    <ArrowUpDown className="size-4" />
                </button>
            ),
            cell: ({ row }) => (
                <span className="font-medium text-foreground">{row.original.name}</span>
            ),
        },
        {
            accessorKey: "userCount",
            header: ({ column }) => (
                <button
                    type="button"
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting()}
                >
                    No. of Users
                    <ArrowUpDown className="size-4" />
                </button>
            ),
            cell: ({ row }) => (
                <span className="text-muted-foreground">{row.original.userCount}</span>
            ),
        },
        {
            id: "userNames",
            header: "User Names",
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="text-muted-foreground cursor-default">
                                {getTruncatedUserNames(row.original.userNames)}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                            <p className="text-sm">{row.original.userNames.join(", ")}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
        },
        {
            id: "features",
            header: "Features",
            cell: ({ row }) => (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFeatureList(row.original)}
                    className="gap-2"
                >
                    <List className="size-4" />
                    Feature List
                </Button>
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
                    {row.original.userNames?.length == 0 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(row.original)}
                            className="size-8 text-destructive bg-destructive/10 hover:bg-destructive/20 hover:scale-110 transition-all duration-200"
                        >
                            <Trash2 className="size-4" />
                            <span className="sr-only">Delete</span>
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: roles,
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
                        placeholder="Search roles..."
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
                                            No roles found.
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
                                {/* Row 1: Role Name (Full Width) */}
                                <div className="flex items-center gap-2 w-full">
                                    <span className="text-xs text-muted-foreground font-medium">#{index + 1}</span>
                                    <span className="text-sm font-medium text-foreground truncate">{row.original.name}</span>
                                </div>

                                {/* Row 2: User count and names */}
                                <div className="mt-2 text-xs text-muted-foreground">
                                    <span className="font-medium">{row.original.userCount} users: </span>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="cursor-default">
                                                    {getTruncatedUserNames(row.original.userNames, 25)}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent side="top" className="max-w-xs">
                                                <p className="text-sm">{row.original.userNames.join(", ")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>

                                {/* Row 3: Feature List, Edit, Delete */}
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleFeatureList(row.original)}
                                        className="gap-2 text-xs hover:bg-muted/50 transition-colors"
                                    >
                                        <List className="size-3.5" />
                                        Feature List
                                    </Button>
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
                            No roles found.
                        </div>
                    )}
                </div>
            )}

            {/* Edit Role Dialog */}
            <EditRoleDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                roleName={editRoleName}
                onRoleNameChange={setEditRoleName}
                onSave={handleEditSave}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Role"
                itemName={deletingRole?.name ?? ""}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
