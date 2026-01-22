"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Shield, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AddOrganizationDialog } from "./component/add-organization-dialog";
import { AddRoleDialog } from "./component/add-role-dialog";
import { AddUserDialog } from "./component/add-user-dialog";
import Organization from "./component/organization";
import Roles from "./component/roles";

interface TabItem {
  tab_name: string;
  access: number;
  add_button: string;
  icon: LucideIcon;
}

// This will come from an API in the future
const tabsList: TabItem[] = [
  { tab_name: "Organizations", access: 1, add_button: "Organization", icon: Building2 },
  { tab_name: "Roles", access: 1, add_button: "Role", icon: Shield },
  { tab_name: "Users", access: 1, add_button: "User", icon: Users },
];

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<string>(
    tabsList.length > 0 ? tabsList[0].tab_name.toLowerCase() : ""
  );

  // Dialog states for each tab
  const [isOrgDialogOpen, setIsOrgDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);

  // Filter tabs that user has access to
  const accessibleTabs = tabsList.filter((tab) => tab.access === 1);

  // Get dynamic button text based on tab name
  const getAddButtonText = (tabName: string): string => {
    return `Add ${tabName}`;
  };

  // Handle add button click - opens the appropriate dialog
  const handleAddClick = (tabName: string) => {
    switch (tabName.toLowerCase()) {
      case "organization":
        setIsOrgDialogOpen(true);
        break;
      case "role":
        setIsRoleDialogOpen(true);
        break;
      case "user":
        setIsUserDialogOpen(true);
        break;
    }
  };

  if (accessibleTabs.length === 0) {
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

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="bg-muted/60 p-1 h-auto">
            {accessibleTabs.map((tab) => {
              const IconComponent = tab.icon;
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
          {accessibleTabs.map((tab) => (
            <div
              key={`btn-${tab.tab_name}`}
              className={activeTab === tab.tab_name.toLowerCase() ? "block" : "hidden"}
            >
              <Button
                onClick={() => handleAddClick(tab.add_button)}
                className="gap-2 shadow-sm hover:shadow-md transition-shadow text-text"
              >
                <Plus className="size-4" />
                {getAddButtonText(tab.add_button)}
              </Button>
            </div>
          ))}
        </div>

        {/* Tab Content Areas */}
        <TabsContent value="organizations" className="mt-2">
          <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
            <Organization />
          </div>

        </TabsContent>

        <TabsContent value="roles" className="mt-2">
          <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
            <Roles />
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <p className="text-muted-foreground">
              Users content will be displayed here.
            </p>
          </div>
        </TabsContent>
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
