"use client";

import { useMemo, useState } from "react";
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
import { DeleteConfirmationDialog } from "./modals/delete-confirmation-dialog";
import { EditRoleDialog } from "./modals/edit-dialog";
import { FeatureListDialog } from "./modals/feature-list-dialog";
import { Feature } from "@/interface/interface";
import { RoleApiResponse, roleList, useDeleteRole, useEditRole } from "./api";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type Role = {
  id: string;
  name: string;
  userCount: number;
  userNames: string[];
};

export default function RolesList() {
  const [view, setView] = useState<"table" | "card">("table");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const { data, isLoading, isError } = roleList();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editRoleName, setEditRoleName] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const { mutate: editRole, isPending: isEditing } = useEditRole();
  const [isFeatureListOpen, setIsFeatureListOpen] = useState(false);
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole();
  const [selectedRoleForFeatures, setSelectedRoleForFeatures] =
    useState<Role | null>(null);
  const features = useSelector((state: RootState) => state.feature.features);
  const mapApiRolesToUi = (data: RoleApiResponse[]): Role[] => {
    return data.map((role) => ({
      id: role.role_id,
      name: role.role_name,
      userCount: role.user_count,
      userNames: role.user_names || [],
    }));
  };
  // const roles: Role[] = useMemo(() => {
  //   return data ? mapApiRolesToUi(data) : [];
  // }, [data]);

  const roles: Role[] = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return mapApiRolesToUi(data);
  }, [data]);

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setEditRoleName(role.name);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!editingRole || !editRoleName.trim()) return;

    editRole(
      {
        role_id: editingRole.id,
        role_name: editRoleName.trim(),
      },
      {
        onSuccess: (response) => {
          if (response.header.code !== 200) {
            toast.warning(
              response?.header.message ||
                response?.response?.message ||
                "Something went wrong",
            );
            return;
          }
          setIsEditDialogOpen(false);
          setEditingRole(null);
          setEditRoleName("");
          toast.success("Role updated successfully");
        },
      },
    );
  };

  const handleDelete = (role: Role) => {
    setDeletingRole(role);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingRole) return;

    deleteRole(
      { role_id: deletingRole.id },
      {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setDeletingRole(null);
          toast.success("Role deleted successfully");
        },
      },
    );
  };
  const handleFeatureList = (role: Role) => {
    setSelectedRoleForFeatures(role);
    setIsFeatureListOpen(true);
  };

  const handleFeatureListSave = (features: Feature[]) => {
    const mappedFeatures = features.map((f) => ({
      id: f.feature_id,
      name: f.feature_name,
      access: f.access,
      group: f.group_id,
    }));

    setIsFeatureListOpen(false);
    setSelectedRoleForFeatures(null);
  };

  const getTruncatedUserNames = (
    userNames: string[],
    maxLength: number = 30,
  ) => {
    const joined = userNames.join(", ");
    if (joined.length <= maxLength) return joined;
    return joined.substring(0, maxLength) + "...";
  };

  const uamPermission = features
    ?.find((grp) => grp.feature_grp_name === "UAM")
    ?.feature_list?.find((f) => f.feature_name === "Roles")?.permission_level;
  const canEdit = uamPermission === 3 || uamPermission === 4;
  const canDelete = uamPermission === 4;
  const showPermissionToast = () => {
    toast.error("You do not have permission to perform this action.");
  };

  const columns: ColumnDef<Role>[] = useMemo(
    () => [
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
            Role Name
            <ArrowUpDown className="size-4" />
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-medium text-foreground">
            {row.original.name}
          </span>
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
          <span className="text-muted-foreground">
            {row.original.userCount}
          </span>
        ),
      },
      {
        id: "userNames",
        header: "User Names",
        cell: ({ row }) =>
          row.original.userNames.length > 0 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="block max-w-[200px] truncate cursor-default text-muted-foreground">
                    {row.original.userNames.join(", ")}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">{row.original.userNames.join(", ")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <span className="block max-w-[200px] truncate italic text-muted-foreground">
              No User
            </span>
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
              onClick={() =>
                canEdit ? handleEdit(row.original) : showPermissionToast()
              }
              className="size-8 text-primary bg-primary/10 hover:bg-primary/20 hover:scale-110 transition-all duration-200"
            >
              <Pencil className="size-4" />
            </Button>
            {row.original.userNames.length == 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  canDelete ? handleDelete(row.original) : showPermissionToast()
                }
                className="size-8 text-destructive bg-destructive/10 hover:bg-destructive/20 hover:scale-110 transition-all duration-200"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [handleEdit, handleDelete, handleFeatureList],
  );

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

  if (isLoading) {
    return <div className="py-10 text-center">Loading roles...</div>;
  }

  if (isError) {
    return (
      <div className="py-10 text-center text-destructive">
        Failed to load roles
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
                      No roles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
                {/* Row 1: Role Name (Full Width) */}
                <div className="flex items-center gap-2 w-full">
                  <span className="text-xs text-muted-foreground font-medium">
                    #{index + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground truncate">
                    {row.original.name}
                  </span>
                </div>

                {/* Row 2: User count and names */}
                <div className="mt-2 text-xs text-muted-foreground">
                  <span className="font-medium">
                    {row.original.userCount} users:{" "}
                  </span>
                  {row.original.userNames.length > 0 ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-default">
                            {getTruncatedUserNames(row.original.userNames, 25)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="text-sm">
                            {row.original.userNames.join(", ")}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="italic text-muted-foreground">
                      No User
                    </span>
                  )}
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
                      onClick={() =>
                        canEdit
                          ? handleEdit(row.original)
                          : showPermissionToast()
                      }
                      className="size-8 text-primary bg-primary/10 hover:bg-primary/20 hover:scale-110 transition-all duration-200"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    {row.original.userNames.length == 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          canDelete
                            ? handleDelete(row.original)
                            : showPermissionToast()
                        }
                        className="size-8 text-destructive bg-destructive/10 hover:bg-destructive/20 hover:scale-110 transition-all duration-200"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
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

      <EditRoleDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        roleName={editRoleName}
        onRoleNameChange={setEditRoleName}
        onSave={handleEditSave}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Role"
        itemName={deletingRole?.name ?? ""}
        onConfirm={handleDeleteConfirm}
      />

      <FeatureListDialog
        open={isFeatureListOpen}
        onOpenChange={setIsFeatureListOpen}
        roleName={selectedRoleForFeatures?.name ?? ""}
        onSave={handleFeatureListSave}
        roleId={selectedRoleForFeatures?.id ?? ""}
        canEdit={canEdit}
      />
    </div>
  );
}
