"use client"

import { Header } from "@/components/dashboard/header"
import { useAppStore } from "@/lib/store"
import { Truck, Users, Shield, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { vehicles, drivers, groups, companySettings } = useAppStore()

  const faceMatchEnabledGroups = groups.filter(
    (g) => g.glsSettings.faceMatch.enabled === true
  ).length

  const enrolledDrivers = drivers.filter((d) => d.faceEnrolled).length

  const stats = [
    {
      name: "Total Vehicles",
      value: vehicles.length,
      icon: Truck,
      href: "/vehicles",
    },
    {
      name: "Active Drivers",
      value: drivers.length,
      icon: Users,
      href: "/drivers",
    },
    {
      name: "Groups",
      value: groups.length,
      icon: Shield,
      href: "/admin/groups",
    },
    {
      name: "Face Match Groups",
      value: `${faceMatchEnabledGroups}/${groups.length}`,
      icon: Shield,
      href: "/admin/gls",
    },
  ]

  return (
    <div className="flex flex-col">
      <Header title="Dashboard" description="Fleet overview and quick actions" />

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link
              key={stat.name}
              href={stat.href}
              className="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Face Match Status Banner */}
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                Face Match Configuration
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Face Match is configured at the{" "}
                <span className="font-medium text-foreground">
                  {companySettings.faceMatchMode === "group-level"
                    ? "group level"
                    : "fleet-wide level"}
                </span>
                . {faceMatchEnabledGroups} of {groups.length} groups have Face
                Match enabled.
              </p>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/admin/gls"
                  className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Manage GLS Settings
                </Link>
                <Link
                  href="/admin/driver-id"
                  className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Driver ID Settings
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Driver Enrollment Status */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">
              Driver Enrollment Status
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Drivers with Face Match enrolled
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Enrolled</span>
                <span className="font-medium text-foreground">
                  {enrolledDrivers} of {drivers.length}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${(enrolledDrivers / drivers.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            <Link
              href="/drivers"
              className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
            >
              View all drivers
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">
              Face Match Activity
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Recent configuration changes
            </p>
            <div className="mt-4 space-y-3">
              {groups.slice(0, 3).map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between rounded-md border border-border bg-background p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {group.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {group.vehicleCount} vehicles, {group.driverCount} drivers
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      group.glsSettings.faceMatch.enabled === true
                        ? "bg-green-100 text-green-800"
                        : group.glsSettings.faceMatch.enabled === false
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {group.glsSettings.faceMatch.enabled === true
                      ? "Enabled"
                      : group.glsSettings.faceMatch.enabled === false
                        ? "Disabled"
                        : "Inherited"}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/admin/groups"
              className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
            >
              View all groups
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
