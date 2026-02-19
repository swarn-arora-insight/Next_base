"use client";

import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Shield, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AddOrganizationDialog } from "./component/modals/add-organization-dialog";
import { AddRoleDialog } from "./component/modals/add-role-dialog";
import { AddUserDialog } from "./component/modals/add-user-dialog";
import Roles from "./component/roles";
import UserList from "./component/user-list";
import Organization from "./component/Organization";
import { useTabsList } from "./component/api";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { TabItem } from "@/interface/interface";

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Shield,
  Users,
};

export default function UserManagement() {
  const { data: tabsList = [], isLoading } = useTabsList();
  const [isOrgDialogOpen, setIsOrgDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const features = useSelector((state: RootState) => state.feature.features);
  const uamPermissions = useMemo(() => {
    if (!Array.isArray(features)) return {};
    const uamGroup = features.find((grp) => grp.feature_grp_name === "UAM");
    const list = uamGroup?.feature_list ?? [];
    return list.reduce<Record<string, number>>((acc, feature) => {
      if (!feature?.feature_name) return acc;
      acc[feature.feature_name.toLowerCase()] = feature.permission_level ?? 0;
      return acc;
    }, {});
  }, [features]);

  // const accessibleTabs = useMemo(() => {
  //   return tabsList?.filter((tab: TabItem) => tab.access === 1) ?? [];
  // }, [tabsList?.length]);

  const accessibleTabs = useMemo(() => {
    return (
      tabsList?.filter((tab: TabItem) => {
        if (tab.access !== 1) return false;
        const tabName = tab.tab_name.toLowerCase();
        const permission = uamPermissions[tabName];
        if (permission === 1) return false;

        return true;
      }) ?? []
    );
  }, [tabsList, uamPermissions]);

  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (!accessibleTabs.length) return;
    const stored = localStorage.getItem("activeTab");
    const validStoredTab = accessibleTabs.find(
      (t: any) => t.tab_name.toLowerCase() === stored,
    );

    if (validStoredTab) {
      setActiveTab(stored!);
    } else {
      const first = accessibleTabs[0].tab_name.toLowerCase();
      setActiveTab(first);
      localStorage.setItem("activeTab", first);
    }
  }, [accessibleTabs]);

  const handleAddClick = (tabName: string) => {
    const name = tabName.toLowerCase().trim();
    const permission = uamPermissions[name];

    if (![3, 4].includes(permission)) {
      toast.error("You do not have permission to perform this action.");
      return;
    }
    if (name.includes("org")) {
      setIsOrgDialogOpen(true);
    } else if (name.includes("role")) {
      setIsRoleDialogOpen(true);
    } else if (name.includes("user")) {
      setIsUserDialogOpen(true);
    }
  };

  const activeTabData = accessibleTabs.find(
    (tab: any) => tab.tab_name.toLowerCase() === activeTab,
  );

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
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val);
          localStorage.setItem("activeTab", val);
        }}
        className="w-full"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="bg-muted/60 p-1 h-auto">
            {accessibleTabs.map((tab: TabItem) => {
              const IconComponent = iconMap[tab.icon];
              return (
                <TabsTrigger
                  key={tab.tab_name}
                  value={tab.tab_name.toLowerCase()}
                  className="gap-2 px-4 py-2 text-sm font-medium data-[state=active]:bg-primary 
                  data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
                >
                  <IconComponent className="size-4" />
                  {tab.tab_name}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <Button
            onClick={() => handleAddClick(activeTab)}
            className="gap-2 shadow-sm hover:shadow-md transition-shadow text-text"
          >
            <Plus className="size-4" />
            Add {activeTabData?.add_button}
          </Button>
        </div>

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
