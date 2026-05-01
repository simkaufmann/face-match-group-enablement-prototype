"use client"

import { Header } from "@/components/dashboard/header"
import { useAppStore, getEffectiveFaceMatchStatus, type Group } from "@/lib/store"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  Shield,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Info,
  History,
  Users,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

type FaceMatchSetting = "enabled" | "disabled" | "inherit"

export default function GLSSettingsPage() {
  const searchParams = useSearchParams()
  const selectedGroupFromUrl = searchParams.get("group")

  const { groups, companySettings, updateGroup, auditLog } = useAppStore()
  const [expandedGroup, setExpandedGroup] = useState<string | null>(
    selectedGroupFromUrl || null
  )
  const [showAuditLog, setShowAuditLog] = useState(false)

  // Get root-level groups
  const rootGroups = groups.filter((g) => !g.parentGroupId)

  // Get child groups for a parent
  const getChildGroups = (parentId: string) =>
    groups.filter((g) => g.parentGroupId === parentId)

  const handleFaceMatchChange = (groupId: string, setting: FaceMatchSetting) => {
    const enabled =
      setting === "enabled" ? true : setting === "disabled" ? false : null
    const source = setting === "inherit" ? "inherited" : "group"

    updateGroup(groupId, {
      glsSettings: {
        faceMatch: { enabled, source },
      },
    })
  }

  const renderGroupSettings = (group: Group, depth: number = 0) => {
    const effectiveStatus = getEffectiveFaceMatchStatus(
      group.id,
      groups,
      companySettings
    )
    const childGroups = getChildGroups(group.id)
    const isExpanded = expandedGroup === group.id
    const currentSetting: FaceMatchSetting =
      group.glsSettings.faceMatch.enabled === true
        ? "enabled"
        : group.glsSettings.faceMatch.enabled === false
          ? "disabled"
          : "inherit"

    return (
      <div key={group.id}>
        <div
          className={cn(
            "border-b border-border",
            depth > 0 && "bg-muted/20"
          )}
          style={{ paddingLeft: `${depth * 24 + 16}px` }}
        >
          <div className="flex items-center justify-between py-4 pr-4">
            <button
              onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
              className="flex items-center gap-3 text-left"
            >
              {childGroups.length > 0 ? (
                isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )
              ) : (
                <div className="w-4" />
              )}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{group.name}</p>
                <p className="text-sm text-muted-foreground">
                  {group.vehicleCount} vehicles • {group.driverCount} drivers
                </p>
              </div>
            </button>

            <div className="flex items-center gap-6">
              {/* Face Match Setting Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Face Match:
                </span>
                <div className="flex rounded-lg border border-border bg-background p-1">
                  <button
                    onClick={() => handleFaceMatchChange(group.id, "enabled")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      currentSetting === "enabled"
                        ? "bg-green-100 text-green-800"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Check className="h-3.5 w-3.5" />
                    On
                  </button>
                  <button
                    onClick={() => handleFaceMatchChange(group.id, "disabled")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      currentSetting === "disabled"
                        ? "bg-red-100 text-red-800"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <X className="h-3.5 w-3.5" />
                    Off
                  </button>
                  {group.parentGroupId && (
                    <button
                      onClick={() => handleFaceMatchChange(group.id, "inherit")}
                      className={cn(
                        "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                        currentSetting === "inherit"
                          ? "bg-blue-100 text-blue-800"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      Inherit
                    </button>
                  )}
                </div>
              </div>

              {/* Effective Status */}
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
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
                  {effectiveStatus.enabled ? "Active" : "Inactive"}
                </span>
                {currentSetting === "inherit" && (
                  <span className="text-xs text-muted-foreground">
                    via {effectiveStatus.source}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Child groups */}
        {isExpanded &&
          childGroups.map((child) => renderGroupSettings(child, depth + 1))}
      </div>
    )
  }

  // Filter audit log to Face Match related entries
  const faceMatchAuditEntries = auditLog.filter(
    (entry) =>
      entry.field === "faceMatch" ||
      entry.field === "glsSettings" ||
      entry.field === "faceMatchMode"
  )

  return (
    <div className="flex flex-col">
      <Header
        title="Group Level Settings (GLS)"
        description="Configure product features at the group level"
      />

      <div className="p-6">
        {/* Product Areas */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Face Match
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Facial recognition for driver identification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAuditLog(!showAuditLog)}
                className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                <History className="h-4 w-4" />
                {showAuditLog ? "Hide" : "Show"} Audit Log
              </button>
            </div>
          </div>

          {/* Company Default Banner */}
          <div className="border-b border-border bg-muted/30 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Company default:{" "}
                  <span
                    className={cn(
                      "font-medium",
                      companySettings.faceMatchEnabled
                        ? "text-green-700"
                        : "text-red-700"
                    )}
                  >
                    {companySettings.faceMatchEnabled ? "Enabled" : "Disabled"}
                  </span>
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                Groups without explicit settings inherit this default
              </span>
            </div>
          </div>

          {/* Groups List */}
          <div>{rootGroups.map((group) => renderGroupSettings(group))}</div>
        </div>

        {/* Audit Log Panel */}
        {showAuditLog && (
          <div className="mt-6 rounded-lg border border-border bg-card">
            <div className="border-b border-border p-4">
              <h3 className="font-semibold text-foreground">
                Face Match Configuration History
              </h3>
              <p className="text-sm text-muted-foreground">
                Recent changes to Face Match settings across groups
              </p>
            </div>
            <div className="divide-y divide-border">
              {faceMatchAuditEntries.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No configuration changes recorded yet.
                </div>
              ) : (
                faceMatchAuditEntries.slice(0, 10).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <History className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{entry.user}</span>{" "}
                          {entry.action.toLowerCase()} Face Match for{" "}
                          <span className="font-medium">{entry.entityName}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.oldValue} → {entry.newValue}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Inheritance Explanation */}
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <h3 className="font-medium text-amber-900">
                How Inheritance Works
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-amber-800">
                <li>
                  • <strong>Company Default</strong> applies to all groups
                  without explicit settings
                </li>
                <li>
                  • <strong>Parent groups</strong> pass their settings to child
                  groups when set to &quot;Inherit&quot;
                </li>
                <li>
                  • <strong>Explicit settings</strong> (On/Off) override
                  inheritance at any level
                </li>
                <li>
                  • <strong>Vehicles</strong> automatically inherit from their
                  assigned group
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
