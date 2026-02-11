"use client";

import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Shield, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AddOrganizationDialog } from "./component/add-organization-dialog";
import { AddRoleDialog } from "./component/add-role-dialog";
import { AddUserDialog } from "./component/add-user-dialog";
// import Organization from "./component/organization";
import Roles from "./component/roles";
import UserList from "./component/user-list";
import Organization from "./component/Organization";
import { useTabsList } from "./component/api";

interface TabItem {
  tab_name: string;
  access: number;
  add_button: string;
  icon: IconKey;
}

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Shield,
  Users,
};
type IconKey = "Building2" | "Shield" | "Users";

export default function UserManagement() {
  const { data: tabsList = [], isLoading } = useTabsList();
  // Dialog states for each tab
  const [isOrgDialogOpen, setIsOrgDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);

  // Filter tabs that user has access to
 const accessibleTabs = useMemo(() => {
  return tabsList?.filter((tab: TabItem) => tab.access === 1) ?? [];
}, [tabsList?.length]);


  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
  if (accessibleTabs.length > 0 && !activeTab) {
    setActiveTab(accessibleTabs[0].tab_name.toLowerCase());
  }
}, [accessibleTabs.length]);



  // Get dynamic button text based on tab name
  const getAddButtonText = (tabName: string): string => {
    return `Add ${tabName}`;
  };

  // Handle add button click - opens the appropriate dialog
  const handleAddClick = (tabName: string) => {
    const name = tabName.toLowerCase().trim();

    if (name.includes("org")) {
      setIsOrgDialogOpen(true);
    } else if (name.includes("role")) {
      setIsRoleDialogOpen(true);
    } else if (name.includes("user")) {
      setIsUserDialogOpen(true);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading tabs...</div>;
  }

  if (!tabsList.length) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">No tabs available.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your organization, roles, and users
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="bg-muted/60 p-1 h-auto">
            {accessibleTabs.map((tab: TabItem) => {
              const IconComponent = iconMap[tab.icon];
              return (
                <TabsTrigger
                  key={tab.tab_name}
                  value={tab.tab_name.toLowerCase()}
                  className="gap-2 px-4 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
                >
                  <IconComponent className="size-4" />
                  {tab.tab_name}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Dynamic Add Button based on active tab */}
          <Button
            onClick={() => handleAddClick(activeTab)}
            className="gap-2 shadow-sm hover:shadow-md transition-shadow text-text"
          >
            <Plus className="size-4" />
            Add {activeTab}
          </Button>
        </div>

        {/* Tab Content Areas */}
        {accessibleTabs.map((tab: TabItem) => {
          const value = tab.tab_name.toLowerCase();

          return (
            <TabsContent key={tab.tab_name} value={value} className="mt-2">
              <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
                {value.includes("org") && <Organization />}
                {value.includes("role") && <Roles />}
                {value.includes("user") && <UserList />}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Dialogs */}
      <AddOrganizationDialog
        open={isOrgDialogOpen}
        onOpenChange={setIsOrgDialogOpen}
      />
      <AddRoleDialog
        open={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
      />
      <AddUserDialog
        open={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
      />
    </div>
  );
}
