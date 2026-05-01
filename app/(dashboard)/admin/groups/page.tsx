"use client"

import { Header } from "@/components/dashboard/header"
import { useAppStore, getEffectiveFaceMatchStatus } from "@/lib/store"
import { useState } from "react"
import {
  Plus,
  Search,
  MoreHorizontal,
  Users,
  Truck,
  ChevronRight,
  Edit2,
  Trash2,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function GroupsPage() {
  const { groups, vehicles, drivers, companySettings, addGroup, deleteGroup } =
    useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get root-level groups
  const rootGroups = filteredGroups.filter((g) => !g.parentGroupId)

  // Get child groups for a parent
  const getChildGroups = (parentId: string) =>
    filteredGroups.filter((g) => g.parentGroupId === parentId)

  // Get vehicles count for a group (including children)
  const getGroupVehicleCount = (groupId: string): number => {
    const directVehicles = vehicles.filter((v) => v.groupId === groupId).length
    const childGroups = getChildGroups(groupId)
    const childVehicles = childGroups.reduce(
      (sum, child) => sum + getGroupVehicleCount(child.id),
      0
    )
    return directVehicles + childVehicles
  }

  const handleCreateGroup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newGroup = {
      id: `g${Date.now()}`,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      vehicleCount: 0,
      driverCount: 0,
      parentGroupId: (formData.get("parentGroup") as string) || null,
      glsSettings: {
        faceMatch: {
          enabled: null,
          source: "inherited" as const,
        },
      },
    }
    addGroup(newGroup)
    setShowCreateModal(false)
  }

  return (
    <div className="flex flex-col">
      <Header title="Groups" description="Manage vehicle and driver groups" />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-80 rounded-md border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create Group
          </button>
        </div>

        {/* Groups List */}
        <div className="mt-6 rounded-lg border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">
                All Groups ({groups.length})
              </h2>
              <Link
                href="/admin/gls"
                className="text-sm font-medium text-primary hover:underline"
              >
                Manage GLS Settings
              </Link>
            </div>
          </div>

          <div className="divide-y divide-border">
            {rootGroups.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  No groups found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create a group to organize your vehicles and drivers.
                </p>
              </div>
            ) : (
              rootGroups.map((group) => {
                const effectiveStatus = getEffectiveFaceMatchStatus(
                  group.id,
                  groups,
                  companySettings
                )
                const childGroups = getChildGroups(group.id)
                const totalVehicles = getGroupVehicleCount(group.id)
                const isExpanded = expandedGroup === group.id

                return (
                  <div key={group.id}>
                    <div className="flex items-center justify-between p-4 hover:bg-muted/30">
                      <button
                        onClick={() =>
                          setExpandedGroup(isExpanded ? null : group.id)
                        }
                        className="flex flex-1 items-center gap-4 text-left"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground">
                              {group.name}
                            </h3>
                            {childGroups.length > 0 && (
                              <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                                {childGroups.length} sub-groups
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {group.description}
                          </p>
                          <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Truck className="h-3.5 w-3.5" />
                              {totalVehicles} vehicles
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {group.driverCount} drivers
                            </span>
                          </div>
                        </div>
                      </button>

                      <div className="flex items-center gap-3">
                        {/* Face Match Status */}
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium",
                            effectiveStatus.enabled
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          Face Match:{" "}
                          {effectiveStatus.enabled ? "On" : "Off"}
                        </span>

                        {/* Actions Menu */}
                        <div className="relative">
                          <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>

                        <ChevronRight
                          className={cn(
                            "h-5 w-5 text-muted-foreground transition-transform",
                            isExpanded && "rotate-90"
                          )}
                        />
                      </div>
                    </div>

                    {/* Expanded: Show child groups */}
                    {isExpanded && childGroups.length > 0 && (
                      <div className="border-t border-border bg-muted/20">
                        {childGroups.map((child) => {
                          const childStatus = getEffectiveFaceMatchStatus(
                            child.id,
                            groups,
                            companySettings
                          )
                          return (
                            <div
                              key={child.id}
                              className="flex items-center justify-between border-b border-border/50 py-3 pl-16 pr-4 last:border-b-0"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {child.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {child.vehicleCount} vehicles •{" "}
                                    {child.driverCount} drivers
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span
                                  className={cn(
                                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                                    childStatus.enabled
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  )}
                                >
                                  {childStatus.enabled ? "On" : "Off"}
                                </span>
                                <Link
                                  href={`/admin/gls?group=${child.id}`}
                                  className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                  <Settings className="h-4 w-4" />
                                </Link>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground">
              Create New Group
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Groups help organize vehicles and configure settings at scale.
            </p>

            <form onSubmit={handleCreateGroup} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Group Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g., Midwest Division"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={2}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Brief description of this group..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Parent Group (Optional)
                </label>
                <select
                  name="parentGroup"
                  className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">No parent (root level)</option>
                  {groups
                    .filter((g) => !g.parentGroupId)
                    .map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                </select>
                <p className="mt-1 text-xs text-muted-foreground">
                  Child groups inherit settings from their parent group.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
