"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import OrganizationsTab from "./component/Organization";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

const tabs = [
  { id: "organization", label: "Organization" },
  { id: "roles", label: "Roles" },
  { id: "users", label: "Users List" },
];

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("organization");
  const [open, setOpen] = useState(false);
  const [orgName, setOrgName] = useState("");

  const [organizations, setOrganizations] = useState([
    { id: 1, name: "Insign AI", users: 12 },
    { id: 2, name: "Acme Corp", users: 5 },
  ]);

  const addOrganization = () => {
    if (!orgName.trim()) return;
    setOrganizations([
      ...organizations,
      { id: Date.now(), name: orgName, users: 0 },
    ]);
    setOrgName("");
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Tabs Header */}
      <div className="flex items-center justify-between bg-background px-4 py-4 border-b">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition cursor-pointer",
                activeTab === tab.id
                  ? "bg-indigo-500 hover:bg-indigo-600 text-white shadow"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Button */}
        {activeTab === "organization" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-indigo-500 hover:bg-indigo-600 text-white ml-2"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Organization
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Organization</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Input
                  placeholder="Organization Name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={addOrganization}
                    className="px-4 bg-indigo-500 hover:bg-indigo-600 text-white"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Tab Content */}
      <div className="px-4">
        {activeTab === "organization" && <OrganizationsTab />}
        {/* {activeTab === "roles" }
        {activeTab === "users"} */}
      </div>
    </div>
  );
}
