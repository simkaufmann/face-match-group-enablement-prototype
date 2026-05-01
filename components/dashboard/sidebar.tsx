"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Truck,
  Settings,
  Shield,
  Video,
  FileText,
  ChevronDown,
  ChevronRight,
  Building2,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Drivers", href: "/drivers", icon: Users },
  { name: "Vehicles", href: "/vehicles", icon: Truck },
  { name: "Safety", href: "/safety", icon: Shield },
  { name: "Video", href: "/video", icon: Video },
  { name: "Reports", href: "/reports", icon: FileText },
]

const adminNavigation = [
  { name: "Company Settings", href: "/admin/company", icon: Building2 },
  { name: "Groups", href: "/admin/groups", icon: Users },
  { name: "Driver ID Settings", href: "/admin/driver-id", icon: Shield },
  { name: "GLS Settings", href: "/admin/gls", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [adminExpanded, setAdminExpanded] = useState(true)

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
            <span className="text-sm font-bold text-primary-foreground">M</span>
          </div>
          <span className="text-lg font-semibold text-foreground">Motive</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Admin Section */}
        <div className="mt-6">
          <button
            onClick={() => setAdminExpanded(!adminExpanded)}
            className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            <span>Admin</span>
            {adminExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {adminExpanded && (
            <ul className="mt-1 space-y-1">
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <span className="text-sm font-medium text-muted-foreground">JD</span>
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-foreground">John Doe</p>
            <p className="text-xs text-muted-foreground">Fleet Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
