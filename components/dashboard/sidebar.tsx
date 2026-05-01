"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Search,
  Building2,
  Users,
  Truck,
  Package,
  MapPin,
  Folder,
  FileText,
  ShoppingBag,
  Map,
  Shield,
  FileCheck,
  Fuel,
  CreditCard,
  Wrench,
  UserCog,
  Truck as TruckIcon,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Bell,
  Settings,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const organizationNav = [
  { name: "Company", href: "/admin/company", icon: Building2 },
  { name: "Fleet Users", href: "/fleet-users", icon: Users },
  { name: "Drivers", href: "/drivers", icon: Users },
  { name: "Vehicles", href: "/vehicles", icon: Truck },
  { name: "Assets", href: "/assets", icon: Package },
  { name: "Geofences", href: "/geofences", icon: MapPin },
  { name: "Groups", href: "/admin/groups", icon: Folder },
  { name: "Profiles", href: "/profiles", icon: FileText },
  { name: "Shop", href: "/shop", icon: ShoppingBag, badge: "NEW" },
]

const productsNav = [
  { name: "Fleet View", href: "/fleet-view", icon: Map },
  { name: "Safety", href: "/safety", icon: Shield },
  { name: "Compliance", href: "/compliance", icon: FileCheck },
  { name: "Fuel", href: "/fuel", icon: Fuel },
  { name: "Cards", href: "/cards", icon: CreditCard },
  { name: "Maintenance", href: "/maintenance", icon: Wrench },
  { name: "Workforce", href: "/workforce", icon: UserCog },
  { name: "Dispatch", href: "/dispatch", icon: TruckIcon },
  { name: "Messaging", href: "/messaging", icon: MessageSquare },
]

const platformNav = [
  { name: "Automations", href: "/automations", icon: Sparkles, badge: "NEW" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [orgExpanded, setOrgExpanded] = useState(true)
  const [productsExpanded, setProductsExpanded] = useState(true)
  const [platformExpanded, setPlatformExpanded] = useState(true)

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-14 items-center px-4">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-semibold italic text-gray-900">Motive</span>
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-100">
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3">
        {/* Organization Section */}
        <div className="mb-1">
          <button
            onClick={() => setOrgExpanded(!orgExpanded)}
            className="flex w-full items-center justify-between px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-500"
          >
            <span>Organization</span>
            {orgExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>

          {orgExpanded && (
            <ul className="space-y-0.5">
              {organizationNav.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-600 border-l-2 border-blue-600 -ml-px"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Products Section */}
        <div className="mb-1 mt-4">
          <button
            onClick={() => setProductsExpanded(!productsExpanded)}
            className="flex w-full items-center justify-between px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-500"
          >
            <span>Products</span>
            {productsExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>

          {productsExpanded && (
            <ul className="space-y-0.5">
              {productsNav.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-600 border-l-2 border-blue-600 -ml-px"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Platform Section */}
        <div className="mb-1 mt-4">
          <button
            onClick={() => setPlatformExpanded(!platformExpanded)}
            className="flex w-full items-center justify-between px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-500"
          >
            <span>Platform</span>
            {platformExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>

          {platformExpanded && (
            <ul className="space-y-0.5">
              {platformNav.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-600 border-l-2 border-blue-600 -ml-px"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex items-center justify-between">
          <button className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100">
            <Settings className="h-5 w-5" />
          </button>
          <button className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100">
            <HelpCircle className="h-5 w-5" />
          </button>
          <button className="relative rounded-md p-1.5 text-gray-500 hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-medium text-white">
              6
            </span>
          </button>
          <button className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
