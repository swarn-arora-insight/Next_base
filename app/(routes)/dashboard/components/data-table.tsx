"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table as TableIcon } from "lucide-react";

export default function DataTable() {
  const [view, setView] = useState<"table" | "card">("table");

  const users = [
    {
      id: 1,
      name: "Amit Bohra",
      email: "amit@gmail.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      role: "User",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Neha Verma",
      email: "neha@gmail.com",
      role: "Editor",
      status: "Active",
    },
    {
      id: 4,
      name: "Kunal Singh",
      email: "kunal@gmail.com",
      role: "User",
      status: "Active",
    },
    {
      id: 5,
      name: "Pooja Mehta",
      email: "pooja@gmail.com",
      role: "Viewer",
      status: "Inactive",
    },
  ];

  return (
    <div className="mx-4">
      {/* 🔄 Toggle Button */}
      <div className="flex justify-end items-center gap-2 mb-4">
        {/* Table View Button */}
        <Button
          variant="outline"
          onClick={() => setView("table")}
          title="Table View"
          className={view === "table" ? "bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white" : ""}
        >
          <TableIcon className="h-4 w-4 mr-1" />
        </Button>

        {/* Card View Button */}
        <Button
          variant="outline"
          title="Card View"
          onClick={() => setView("card")}
          className={view === "card" ? "bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white" : ""}
        >
          <LayoutGrid className="h-4 w-4 mr-1" />
        </Button>
      </div>

      {/* 📋 TABLE VIEW */}
      {view === "table" && (
        <div className="rounded-xl border bg-card overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-indigo-500 text-white">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3">{user.id}</td>
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🪪 CARD VIEW */}
      {view === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-xl border bg-card p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{user.name}</h3>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Role:</span> {user.role}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
