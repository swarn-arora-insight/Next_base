"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LayoutGrid, TableIcon, Pencil, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function OrganizationsTab() {
  const [view, setView] = useState<"table" | "card">("table");
//   const [open, setOpen] = useState(false);
//   const [orgName, setOrgName] = useState("");

  const [organizations, setOrganizations] = useState([
    { id: 1, name: "Insign AI", users: 12 },
    { id: 2, name: "Acme Corp", users: 5 },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Organizations</h2>

        <div className="flex items-center gap-2">
          {/* View Switch */}
          {/* <Button
            variant={
              view === "table" && (
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full border-collapse">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">
                          Organization Name
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium">
                          Users Count
                        </th>
                        <th className="px-4 py-2 text-right text-sm font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {organizations.map((org) => (
                        <tr key={org.id} className="border-t hover:bg-muted/50">
                          <td className="px-4 py-2">{org.name}</td>
                          <td className="px-4 py-2">{org.users}</td>
                          <td className="px-4 py-2 text-right space-x-2">
                            <Button size="icon" variant="outline">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          >
            <TableIcon className="h-4 w-4 mr-1" /> Table
          </Button> */}
          <Button
            variant={view === "card" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("card")}
          >
            <LayoutGrid className="h-4 w-4 mr-1" /> Card
          </Button>
        </div>
      </div>

      {/* Table View */}
      {view === "table" && (
        <table className="w-full border-collapse border rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border-b">
                Organization Name
              </th>
              <th className="px-4 py-2 text-left border-b">Users Count</th>
              <th className="px-4 py-2 text-right border-b">Actions</th>
            </tr>
          </thead>

          <tbody>
            {organizations.map((org) => (
              <tr key={org.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 border-b">{org.name}</td>

                <td className="px-4 py-2 border-b">{org.users}</td>

                <td className="px-4 py-2 border-b text-right space-x-2">
                  <button className="cursor-pointer text-indigo-400 hover:text-indigo-500">
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button className="text-red-500 hover:text-red-600 cursor-pointer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Card View */}
      {view === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {organizations.map((org: any) => (
            <Card key={org.id}>
              <CardContent className="px-4 space-y-3">
                <div className="flex justify-between">
                {/* <div className="flex"> */}
                  <h3 className="font-semibold">{org.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Users: {org.users}
                  </p>
                {/* </div> */}
                <div className="flex gap-2">
                  <button className="text-indigo-400 hover:text-indigo-500 cursor-pointer">
                    <Pencil className="h-4 w-4 mr-1" /> 
                  </button>
                  <button className="text-red-500 hover:text-red-600 cursor-pointer ">
                    <Trash2 className="h-4 w-4 mr-1" /> 
                  </button>
                </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
