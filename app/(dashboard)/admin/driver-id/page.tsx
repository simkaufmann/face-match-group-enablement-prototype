"use client"

import { Header } from "@/components/dashboard/header"
import { useAppStore, getEffectiveFaceMatchStatus } from "@/lib/store"
import { useState } from "react"
import { Info, ChevronRight, Check, X, AlertCircle, Users } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function DriverIDSettingsPage() {
  const { companySettings, setCompanySettings, groups, vehicles } = useAppStore()
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

  const handleModeChange = (mode: "fleet-wide" | "group-level") => {
    setCompanySettings({ faceMatchMode: mode })
  }

  const handleFleetWideToggle = () => {
    setCompanySettings({ faceMatchEnabled: !companySettings.faceMatchEnabled })
  }

  // Get root-level groups (no parent)
  const rootGroups = groups.filter((g) => !g.parentGroupId)

  // Get child groups for a parent
  const getChildGroups = (parentId: string) =>
    groups.filter((g) => g.parentGroupId === parentId)

  // Get vehicles for a group
  const getGroupVehicles = (groupId: string) =>
    vehicles.filter((v) => v.groupId === groupId)

  return (
    <div className="flex flex-col">
      <Header
        title="Driver ID Settings"
        description="Configure driver identification and Face Match settings"
      />

      <div className="p-6">
        {/* Configuration Mode Selection */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Face Match Configuration Mode
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose how Face Match is enabled across your fleet
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Fleet-Wide Option */}
              <button
                onClick={() => handleModeChange("fleet-wide")}
                className={cn(
                  "relative flex flex-col rounded-lg border-2 p-6 text-left transition-all",
                  companySettings.faceMatchMode === "fleet-wide"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/50"
                )}
              >
                {companySettings.faceMatchMode === "fleet-wide" && (
                  <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <h3 className="text-base font-semibold text-foreground">
                  Fleet-Wide
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enable or disable Face Match for all vehicles in your entire
                  fleet with a single toggle.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>Simple configuration, applies to all vehicles</span>
                </div>
              </button>

              {/* Group-Level Option */}
              <button
                onClick={() => handleModeChange("group-level")}
                className={cn(
                  "relative flex flex-col rounded-lg border-2 p-6 text-left transition-all",
                  companySettings.faceMatchMode === "group-level"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/50"
                )}
              >
                {companySettings.faceMatchMode === "group-level" && (
                  <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <h3 className="text-base font-semibold text-foreground">
                  Group-Level
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Configure Face Match settings per group using Group Level
                  Settings (GLS). Groups inherit from parent groups.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>Granular control with inheritance hierarchy</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Fleet-Wide Toggle (shown when fleet-wide mode is selected) */}
        {companySettings.faceMatchMode === "fleet-wide" && (
          <div className="mt-6 rounded-lg border border-border bg-card">
            <div className="border-b border-border p-6">
              <h2 className="text-lg font-semibold text-foreground">
                Fleet-Wide Face Match
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Toggle Face Match for your entire fleet
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Enable Face Match
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Require facial recognition for driver identification on all{" "}
                    {vehicles.length} vehicles
                  </p>
                </div>
                <button
                  onClick={handleFleetWideToggle}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors",
                    companySettings.faceMatchEnabled
                      ? "bg-primary"
                      : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform",
                      companySettings.faceMatchEnabled
                        ? "translate-x-5"
                        : "translate-x-0.5",
                      "mt-0.5"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Group-Level Configuration (shown when group-level mode is selected) */}
        {companySettings.faceMatchMode === "group-level" && (
          <div className="mt-6 rounded-lg border border-border bg-card">
            <div className="border-b border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Group Face Match Status
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    View and manage Face Match settings per group. Click a group
                    to see details.
                  </p>
                </div>
                <Link
                  href="/admin/gls"
                  className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Manage in GLS
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="divide-y divide-border">
              {rootGroups.map((group) => {
                const effectiveStatus = getEffectiveFaceMatchStatus(
                  group.id,
                  groups,
                  companySettings
                )
                const childGroups = getChildGroups(group.id)
                const groupVehicles = getGroupVehicles(group.id)
                const isExpanded = selectedGroupId === group.id

                return (
                  <div key={group.id}>
                    <button
                      onClick={() =>
                        setSelectedGroupId(isExpanded ? null : group.id)
                      }
                      className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {group.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {group.vehicleCount} vehicles, {group.driverCount}{" "}
                            drivers
                            {childGroups.length > 0 &&
                              ` • ${childGroups.length} sub-groups`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
                            effectiveStatus.enabled
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {effectiveStatus.enabled ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
                          {effectiveStatus.enabled ? "Enabled" : "Disabled"}
                        </span>
                        <ChevronRight
                          className={cn(
                            "h-5 w-5 text-muted-foreground transition-transform",
                            isExpanded && "rotate-90"
                          )}
                        />
                      </div>
                    </button>

                    {/* Expanded Group Details */}
                    {isExpanded && (
                      <div className="border-t border-border bg-muted/30 p-4">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                          {/* Group Info */}
                          <div className="rounded-lg border border-border bg-card p-4">
                            <h4 className="font-medium text-foreground">
                              Configuration Source
                            </h4>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {group.glsSettings.faceMatch.source === "group"
                                ? "Set directly on this group"
                                : `Inherited from ${effectiveStatus.source}`}
                            </p>
                            <Link
                              href={`/admin/gls?group=${group.id}`}
                              className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
                            >
                              Edit in GLS Settings
                            </Link>
                          </div>

                          {/* Vehicles Preview */}
                          <div className="rounded-lg border border-border bg-card p-4">
                            <h4 className="font-medium text-foreground">
                              Vehicles in Group
                            </h4>
                            {groupVehicles.length > 0 ? (
                              <ul className="mt-2 space-y-1">
                                {groupVehicles.slice(0, 3).map((v) => (
                                  <li
                                    key={v.id}
                                    className="text-sm text-muted-foreground"
                                  >
                                    {v.name}
                                  </li>
                                ))}
                                {groupVehicles.length > 3 && (
                                  <li className="text-sm text-muted-foreground">
                                    +{groupVehicles.length - 3} more
                                  </li>
                                )}
                              </ul>
                            ) : (
                              <p className="mt-1 text-sm text-muted-foreground">
                                No vehicles directly assigned
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Child Groups */}
                        {childGroups.length > 0 && (
                          <div className="mt-4">
                            <h4 className="mb-2 font-medium text-foreground">
                              Sub-Groups
                            </h4>
                            <div className="space-y-2">
                              {childGroups.map((child) => {
                                const childStatus = getEffectiveFaceMatchStatus(
                                  child.id,
                                  groups,
                                  companySettings
                                )
                                return (
                                  <div
                                    key={child.id}
                                    className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                                  >
                                    <div>
                                      <p className="text-sm font-medium text-foreground">
                                        {child.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {child.vehicleCount} vehicles •{" "}
                                        {child.glsSettings.faceMatch.source ===
                                        "inherited"
                                          ? `Inherits from ${childStatus.source}`
                                          : "Override set"}
                                      </p>
                                    </div>
                                    <span
                                      className={cn(
                                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                                        childStatus.enabled
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      )}
                                    >
                                      {childStatus.enabled
                                        ? "Enabled"
                                        : "Disabled"}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">
                About Face Match Configuration
              </h3>
              <p className="mt-1 text-sm text-blue-800">
                Face Match uses facial recognition to automatically identify
                drivers when they begin a trip. In group-level mode, settings
                inherit from parent groups to child groups, and from groups to
                vehicles. Override settings at any level as needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
