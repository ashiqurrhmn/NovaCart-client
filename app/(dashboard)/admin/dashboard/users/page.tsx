"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, Loader2, Users, AlertCircle, Shield, User as UserIcon } from "lucide-react";
import Image from "next/image";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role?: string; // e.g. "admin" or "buyer"
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Unable to load users. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      setDeletingId(userToDelete);
      const res = await fetch(`http://localhost:5000/users/${userToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user");

      setUsers((prev) => prev.filter((u) => u._id !== userToDelete));
    } catch (err) {
      alert("Failed to delete user. Please try again.");
    } finally {
      setDeletingId(null);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = (u.name || "").toLowerCase().includes(query);
    const emailMatch = (u.email || "").toLowerCase().includes(query);
    return nameMatch || emailMatch;
  });

  return (
    <div className="pt-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-1">
          Manage Users
        </h1>
        <p className="text-sm text-neutral-500">
          View, search, or delete registered user accounts.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-[#e0dbd5] dark:border-[#333] rounded-xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 max-w-sm bg-[#f5f5f5] dark:bg-[#252525] rounded-lg px-3 py-2 border border-[#e8e8e8] dark:border-[#333]">
          <Search className="w-4 h-4 text-[#999] shrink-0" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-[#333] dark:text-[#e0e0e0] placeholder:text-[#aaa] dark:placeholder:text-[#666] outline-none w-full min-w-0"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-4 rounded-xl mb-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
          <button 
            onClick={fetchUsers}
            className="ml-auto text-xs font-bold underline hover:no-underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-[#e0dbd5] dark:border-[#333] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e0dbd5] dark:border-[#333] bg-[#fafafa] dark:bg-[#151515]">
                <th className="px-6 py-4 text-xs font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400">User</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400">Email</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400">Role</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0dbd5] dark:divide-[#333]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-[#e0dbd5] dark:border-[#333]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 shrink-0"></div>
                        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-32"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-40"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded-md w-16"></div>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end">
                      <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium">No users found</p>
                    {searchQuery && <p className="text-xs mt-1">Try adjusting your search</p>}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[#fafafa] dark:hover:bg-[#151515] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-[#252525] flex items-center justify-center text-neutral-400 dark:text-neutral-500 shrink-0">
                            <UserIcon className="w-5 h-5" />
                          </div>
                        )}
                        <span className="font-medium text-[#1a1a1a] dark:text-white text-sm">
                          {user.name || "Unknown User"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#666] dark:text-[#aaa] text-sm">
                        {user.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                          <Shield className="w-3.5 h-3.5" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#f0ebe5] dark:bg-[#333] text-[#1a1a1a] dark:text-[#ccc]">
                          Buyer
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setUserToDelete(user._id)}
                        disabled={deletingId === user._id || user.role === "admin"} // Prevent deleting admins if preferred
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                        title={user.role === "admin" ? "Cannot delete admin" : "Delete User"}
                      >
                        {deletingId === user._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-[#e0dbd5] dark:border-[#333] animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-white mb-2">Delete User</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                Are you sure you want to delete this user? Their account and data will be permanently removed.
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setUserToDelete(null)}
                  disabled={deletingId !== null}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#e0dbd5] dark:border-[#333] text-sm font-semibold text-[#1a1a1a] dark:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#252525] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deletingId !== null}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {deletingId !== null ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
