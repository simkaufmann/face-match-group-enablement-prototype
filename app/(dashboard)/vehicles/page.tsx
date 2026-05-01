"use client"

import { Header } from "@/components/dashboard/header"
import { useAppStore, getEffectiveFaceMatchStatus } from "@/lib/store"
import { useState } from "react"
import {
  Plus,
  Search,
  Truck,
  Check,
  X,
  ChevronDown,
  MoreHorizontal,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function VehiclesPage() {
  const {
    vehicles,
    groups,
    companySettings,
    addVehicle,
    assignVehicleToGroup,
  } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterGroup, setFilterGroup] = useState<string | "all">("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState<string | null>(null)

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vin.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGroup =
      filterGroup === "all" ||
      (filterGroup === "unassigned" ? !v.groupId : v.groupId === filterGroup)
    return matchesSearch && matchesGroup
  })

  const handleAddVehicle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const groupId = (formData.get("groupId") as string) || null

    const newVehicle = {
      id: `v${Date.now()}`,
      name: formData.get("name") as string,
      vin: formData.get("vin") as string,
      groupId,
      faceMatchEnabled: null,
    }
    addVehicle(newVehicle)
    setShowAddModal(false)
  }

  const handleAssignToGroup = (vehicleId: string, groupId: string | null) => {
    assignVehicleToGroup(vehicleId, groupId)
    setShowAssignModal(null)
  }

  return (
    <div className="flex flex-col">
      <Header title="Vehicles" description="Manage your fleet vehicles" />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-64 rounded-md border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Groups</option>
              <option value="unassigned">Unassigned</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Vehicle
          </button>
        </div>

        {/* Vehicles Table */}
        <div className="mt-6 rounded-lg border border-border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  VIN
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Face Match
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-lg font-medium text-foreground">
                      No vehicles found
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try adjusting your search or filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => {
                  const group = groups.find((g) => g.id === vehicle.groupId)
                  const effectiveStatus = getEffectiveFaceMatchStatus(
                    vehicle.groupId,
                    groups,
                    companySettings
                  )

                  return (
                    <tr key={vehicle.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <Truck className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-foreground">
                            {vehicle.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {vehicle.vin}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setShowAssignModal(vehicle.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-sm hover:bg-muted"
                        >
                          {group ? (
                            <span className="text-foreground">{group.name}</span>
                          ) : (
                            <span className="text-muted-foreground">
                              Unassigned
                            </span>
                          )}
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
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
                            {effectiveStatus.enabled ? "On" : "Off"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            via {effectiveStatus.source}
                          </span>
                        </div>
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

        {/* Inheritance Info */}
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>
            Face Match settings are inherited from the vehicle&apos;s assigned
            group. Assign vehicles to groups to manage their settings.
          </span>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground">
              Add New Vehicle
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a vehicle and assign it to a group. The vehicle will inherit
              Face Match settings from its group.
            </p>

            <form onSubmit={handleAddVehicle} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Vehicle Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g., Truck 201"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  VIN
                </label>
                <input
                  type="text"
                  name="vin"
                  required
                  className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Vehicle Identification Number"
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
                  <option value="">No group (uses company default)</option>
                  {groups.map((g) => {
                    const status = getEffectiveFaceMatchStatus(
                      g.id,
                      groups,
                      companySettings
                    )
                    return (
                      <option key={g.id} value={g.id}>
                        {g.name} (Face Match: {status.enabled ? "On" : "Off"})
                      </option>
                    )
                  })}
                </select>
                <p className="mt-1 text-xs text-muted-foreground">
                  The vehicle will automatically inherit Face Match settings
                  from the selected group.
                </p>
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
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign to Group Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-card p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground">
              Assign to Group
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select a group for this vehicle. Face Match settings will be
              inherited.
            </p>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => handleAssignToGroup(showAssignModal, null)}
                className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left hover:bg-muted"
              >
                <span className="text-sm text-muted-foreground">
                  Unassigned
                </span>
                <span className="text-xs text-muted-foreground">
                  Company default
                </span>
              </button>
              {groups.map((g) => {
                const status = getEffectiveFaceMatchStatus(
                  g.id,
                  groups,
                  companySettings
                )
                return (
                  <button
                    key={g.id}
                    onClick={() => handleAssignToGroup(showAssignModal, g.id)}
                    className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left hover:bg-muted"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {g.name}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        status.enabled
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {status.enabled ? "FM On" : "FM Off"}
                    </span>
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setShowAssignModal(null)}
              className="mt-4 w-full rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
