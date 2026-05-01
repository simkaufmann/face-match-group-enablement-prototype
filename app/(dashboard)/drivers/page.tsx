"use client"

import { Header } from "@/components/dashboard/header"
import { useAppStore, getEffectiveFaceMatchStatus } from "@/lib/store"
import { useState } from "react"
import {
  Plus,
  Search,
  Users,
  Check,
  X,
  Camera,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function DriversPage() {
  const { drivers, groups, companySettings, addDriver, updateDriver } =
    useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterEnrolled, setFilterEnrolled] = useState<
    "all" | "enrolled" | "not-enrolled"
  >("all")
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterEnrolled === "all" ||
      (filterEnrolled === "enrolled" ? d.faceEnrolled : !d.faceEnrolled)
    return matchesSearch && matchesFilter
  })

  const enrolledCount = drivers.filter((d) => d.faceEnrolled).length

  const handleAddDriver = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const groupId = (formData.get("groupId") as string) || null

    const newDriver = {
      id: `d${Date.now()}`,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      groupId,
      faceEnrolled: false,
    }
    addDriver(newDriver)
    setShowAddModal(false)
  }

  const handleEnrollToggle = (driverId: string, enrolled: boolean) => {
    updateDriver(driverId, { faceEnrolled: enrolled })
  }

  return (
    <div className="flex flex-col">
      <Header title="Drivers" description="Manage your fleet drivers" />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Drivers</p>
            <p className="text-2xl font-semibold text-foreground">
              {drivers.length}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Face Match Enrolled</p>
            <p className="text-2xl font-semibold text-green-600">
              {enrolledCount}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Pending Enrollment</p>
            <p className="text-2xl font-semibold text-amber-600">
              {drivers.length - enrolledCount}
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search drivers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-64 rounded-md border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <select
              value={filterEnrolled}
              onChange={(e) =>
                setFilterEnrolled(
                  e.target.value as "all" | "enrolled" | "not-enrolled"
                )
              }
              className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Enrollment Status</option>
              <option value="enrolled">Enrolled</option>
              <option value="not-enrolled">Not Enrolled</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Driver
          </button>
        </div>

        {/* Drivers Table */}
        <div className="mt-6 rounded-lg border border-border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Group Face Match
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Enrollment
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-lg font-medium text-foreground">
                      No drivers found
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try adjusting your search or filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => {
                  const group = groups.find((g) => g.id === driver.groupId)
                  const effectiveStatus = getEffectiveFaceMatchStatus(
                    driver.groupId,
                    groups,
                    companySettings
                  )

                  return (
                    <tr key={driver.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <span className="text-sm font-medium text-muted-foreground">
                              {driver.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">
                            {driver.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {driver.email}
                      </td>
                      <td className="px-6 py-4">
                        {group ? (
                          <span className="text-sm text-foreground">
                            {group.name}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                            effectiveStatus.enabled
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {effectiveStatus.enabled ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          {effectiveStatus.enabled ? "Required" : "Not Required"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleEnrollToggle(driver.id, !driver.faceEnrolled)
                          }
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                            driver.faceEnrolled
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          )}
                        >
                          <Camera className="h-3.5 w-3.5" />
                          {driver.faceEnrolled ? "Enrolled" : "Enroll Now"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground">
              Add New Driver
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a driver to your fleet. They can enroll their face after
              being added.
            </p>

            <form onSubmit={handleAddDriver} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g., John Smith"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="driver@company.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Assign to Group
                </label>
                <select
                  name="groupId"
                  className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">No group</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Add Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
