"use client";

import { useState } from "react";
import { EllipsisVertical, Search, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { ThemeCustomizer } from "@/components/global/custom-theme/page";
import { Button } from "@/components/ui/button";

const initialUsers = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    dept: "Engineering",
    role: "Admin",
    status: "Active",
    lastActive: "2 minutes ago",
  },
  {
    name: "Alex Chen",
    email: "alex.chen@company.com",
    dept: "Product",
    role: "Manager",
    status: "Active",
    lastActive: "1 hour ago",
  },
  {
    name: "Emma Williams",
    email: "emma.williams@company.com",
    dept: "Design",
    role: "User",
    status: "Active",
    lastActive: "3 hours ago",
  },
  {
    name: "James Rivera",
    email: "james.rivera@company.com",
    dept: "Marketing",
    role: "Viewer",
    status: "Inactive",
    lastActive: "2 days ago",
  },
  {
    name: "Lisa Anderson",
    email: "lisa.anderson@company.com",
    dept: "Engineering",
    role: "Manager",
    status: "Active",
    lastActive: "30 minutes ago",
  },
];

export default function TeamPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState("");
  const [role, setRole] = useState("User - Standard access");
  const [isAddMember, setIsAddMember] = useState(false);
  // Handle Add Member
  const handleAddMember = () => {
    setUsers([
      ...users,
      {
        name: fullName,
        email,
        dept,
        role:
          role === "User - Standard access"
            ? "User"
            : role === "Manager - Team permissions"
            ? "Manager"
            : "Admin",
        status: "Active",
        lastActive: "Just now",
      },
    ]);

    // Reset form
    setFullName("");
    setEmail("");
    setDept("");
    setRole("User - Standard access");
  };

  // Filter users
  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email} ${u.dept}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="h-screen">
      <div className="container mx-auto px-4 py-2">
        <div className="my-2 gap-2 flex items-end justify-end">
          <Button
            variant="default"
            onClick={() => {
              setIsAddMember(true);
            }}
            size="sm"
            className="border border-gray-300/40 text-white bg-primary/80"
          >
            <UserPlus size={18} />
            Add Member
          </Button>
          <div className="relative w-64">
            <Search
              className="absolute left-4 top-2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search members, emails, departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-white py-1 items-center pl-12 pr-4 text-gray-700 shadow-sm outline-none ring-1 ring-slate-300"
            />
          </div>
        </div>

        {/* TABLE */}
        {/* <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-light">
            <tr>
              <th className="px-6 py-4 text-sm">User</th>
              <th className="px-6 py-4 text-sm">Department</th>
              <th className="px-6 py-4 text-sm">Role</th>
              <th className="px-6 py-4 text-sm">Status</th>
              <th className="px-6 py-4 text-sm">Last Active</th>
              <th className="px-6 py-4 text-sm text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((u, i) => {
              const initials = u.name
                .split(" ")
                .map((w) => w[0])
                .join("");

              return (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-700">
                        {initials}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">
                          {u.name}
                        </div>
                        <div className="text-sm text-slate-500">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  
                  <td className="px-6 py-4 text-slate-700">{u.dept}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        u.role === "Admin"
                          ? "bg-red-100 text-red-700"
                          : u.role === "Manager"
                          ? "bg-blue-100 text-blue-700"
                          : u.role === "Viewer"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          u.status === "Active" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></span>
                      <span
                        className={`text-sm ${
                          u.status === "Active"
                            ? "text-green-700"
                            : "text-gray-500"
                        }`}
                      >
                        {u.status}
                      </span>
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-600">{u.lastActive}</td>

                  <td className="px-6 py-4 text-right">
                    <button className="rounded-md p-2 hover:bg-slate-100">
                      <EllipsisVertical className="text-slate-600" size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div> */}
        {/* USER CARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredUsers.map((u, i) => {
            const initials = u.name
              .split(" ")
              .map((w) => w[0])
              .join("");

            return (
              <div
                key={i}
                className="bg-white rounded-xl p-5 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-base font-semibold text-gray-700">
                      {initials}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{u.name}</h3>
                      <p className="text-sm text-slate-500">{u.email}</p>
                    </div>
                  </div>

                  <button className="rounded-md p-1 hover:bg-slate-100">
                    <EllipsisVertical className="text-slate-600" size={20} />
                  </button>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-slate-700">
                    <span className="font-semibold">Department:</span> {u.dept}
                  </p>

                  <p className="flex items-center text-slate-700 gap-2">
                    <span className="font-semibold">Role:</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        u.role === "Admin"
                          ? "bg-red-100 text-red-700"
                          : u.role === "Manager"
                          ? "bg-blue-100 text-blue-700"
                          : u.role === "Viewer"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </p>

                  <p className="flex items-center text-slate-700 gap-2">
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        u.status === "Active" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></span>
                    <span
                      className={`${
                        u.status === "Active"
                          ? "text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      {u.status}
                    </span>
                  </p>

                  <p className="text-slate-600">
                    <span className="font-semibold">Last Active:</span>{" "}
                    {u.lastActive}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={isAddMember} onOpenChange={setIsAddMember}>
        <DialogTrigger asChild></DialogTrigger>

        <DialogContent className="rounded-2xl p-6 max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              <span>Add Team Member</span>
            </DialogTitle>
          </DialogHeader>

          {/* FORM */}
          <form className="mt-4 space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-light">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full mt-2 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-light">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                className="w-full mt-2 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {/* Department */}
            <div>
              <label className="text-sm font-medium text-light">
                Department
              </label>
              <input
                type="text"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                placeholder="e.g. Engineering, Design, Product"
                className="w-full mt-2 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-medium text-light">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mt-2 rounded-xl border text-gray-600 border-gray-300 px-4 py-3 bg-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300"
              >
                <option>User - Standard access</option>
                <option>Manager - Team permissions</option>
                <option>Admin - Full access</option>
              </select>
            </div>
          </form>

          {/* Footer Buttons */}
          <DialogFooter className="mt-6 flex justify-end gap-3">
            <DialogClose asChild>
              <button className="rounded-xl px-5 py-2 border border-gray-300/70 text-light hover:bg-gray-400">
                Cancel
              </button>
            </DialogClose>

            <DialogClose asChild>
              <button
                onClick={handleAddMember}
                className="rounded-xl px-5 py-2 bg-primary/80 text-white border border-gray-300/70"
              >
                Add Member
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
