"use client"

import { Header } from "@/components/dashboard/header"
import { useAppStore } from "@/lib/store"
import { Building2, Check, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CompanySettingsPage() {
  const { companySettings, setCompanySettings, groups, vehicles, drivers } =
    useAppStore()

  return (
    <div className="flex flex-col">
      <Header
        title="Company Settings"
        description="Manage company-wide configuration"
      />

      <div className="p-6">
        {/* Company Overview */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Acme Trucking Co.
              </h2>
              <p className="text-sm text-muted-foreground">
                Fleet Management Account
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-2xl font-semibold text-foreground">
                {vehicles.length}
              </p>
              <p className="text-sm text-muted-foreground">Vehicles</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-2xl font-semibold text-foreground">
                {drivers.length}
              </p>
              <p className="text-sm text-muted-foreground">Drivers</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-2xl font-semibold text-foreground">
                {groups.length}
              </p>
              <p className="text-sm text-muted-foreground">Groups</p>
            </div>
          </div>
        </div>

        {/* Face Match Default Setting */}
        <div className="mt-6 rounded-lg border border-border bg-card">
          <div className="border-b border-border p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Face Match Company Default
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Set the default Face Match status for groups that don&apos;t have an
              explicit setting
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  Default Face Match Status
                </p>
                <p className="text-sm text-muted-foreground">
                  Groups without explicit settings will inherit this value
                </p>
              </div>
              <div className="flex rounded-lg border border-border bg-background p-1">
                <button
                  onClick={() => setCompanySettings({ faceMatchEnabled: true })}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    companySettings.faceMatchEnabled
                      ? "bg-green-100 text-green-800"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Check className="h-4 w-4" />
                  Enabled
                </button>
                <button
                  onClick={() =>
                    setCompanySettings({ faceMatchEnabled: false })
                  }
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    !companySettings.faceMatchEnabled
                      ? "bg-red-100 text-red-800"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  Disabled
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">
                About Company Defaults
              </h3>
              <p className="mt-1 text-sm text-blue-800">
                The company default serves as the fallback value for Face Match.
                When a group&apos;s setting is set to &quot;Inherit&quot; and has no parent
                group with an explicit setting, it will use this company default.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
