"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Shield, Users } from "lucide-react";
import { TabItem } from "@/interface/interface";

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

  // Filter tabs that user has access to
  const accessibleTabs = tabsList.filter((tab) => tab.access === 1);

  // Get dynamic button text based on tab name
  const getAddButtonText = (tabName: string): string => {
    return `Add ${tabName}`;
  };

  // Handle add button click
  const handleAddClick = (tabName: string) => {
    console.log(`Add ${tabName} clicked`);
    // Future: Open modal or navigate to add form
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
        {accessibleTabs.map((tab) => (
          <TabsContent
            key={`content-${tab.tab_name}`}
            value={tab.tab_name.toLowerCase()}
            className="mt-6"
          >
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <p className="text-muted-foreground">
                {tab.tab_name} content will be displayed here.
              </p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}