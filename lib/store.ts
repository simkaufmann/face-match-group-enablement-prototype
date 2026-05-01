"use client"

import { create } from "zustand"

export interface Vehicle {
  id: string
  name: string
  vin: string
  groupId: string | null
  faceMatchEnabled: boolean | null // null means inherit from group
}

export interface Driver {
  id: string
  name: string
  email: string
  groupId: string | null
  photoUrl?: string
  faceEnrolled: boolean
}

export interface Group {
  id: string
  name: string
  description: string
  vehicleCount: number
  driverCount: number
  parentGroupId: string | null
  glsSettings: {
    faceMatch: {
      enabled: boolean | null // null means inherit from parent/company
      source: "company" | "group" | "inherited"
    }
  }
}

export interface CompanySettings {
  faceMatchEnabled: boolean
  faceMatchMode: "fleet-wide" | "group-level"
  faceMatchGroups: string[]
}

interface AppState {
  // Company Settings
  companySettings: CompanySettings
  setCompanySettings: (settings: Partial<CompanySettings>) => void

  // Groups
  groups: Group[]
  addGroup: (group: Group) => void
  updateGroup: (id: string, updates: Partial<Group>) => void
  deleteGroup: (id: string) => void

  // Vehicles
  vehicles: Vehicle[]
  addVehicle: (vehicle: Vehicle) => void
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void
  assignVehicleToGroup: (vehicleId: string, groupId: string | null) => void

  // Drivers
  drivers: Driver[]
  addDriver: (driver: Driver) => void
  updateDriver: (id: string, updates: Partial<Driver>) => void

  // Audit Log
  auditLog: AuditEntry[]
  addAuditEntry: (entry: Omit<AuditEntry, "id" | "timestamp">) => void
}

export interface AuditEntry {
  id: string
  timestamp: Date
  action: string
  entity: "group" | "vehicle" | "driver" | "company"
  entityId: string
  entityName: string
  field: string
  oldValue: string
  newValue: string
  user: string
}

// Initial mock data
const initialGroups: Group[] = [
  {
    id: "g1",
    name: "West Coast Division",
    description: "All operations in CA, OR, WA",
    vehicleCount: 45,
    driverCount: 52,
    parentGroupId: null,
    glsSettings: {
      faceMatch: { enabled: true, source: "group" },
    },
  },
  {
    id: "g2",
    name: "East Coast Division",
    description: "All operations in NY, NJ, PA",
    vehicleCount: 38,
    driverCount: 41,
    parentGroupId: null,
    glsSettings: {
      faceMatch: { enabled: null, source: "inherited" },
    },
  },
  {
    id: "g3",
    name: "Los Angeles Region",
    description: "LA metro area operations",
    vehicleCount: 20,
    driverCount: 24,
    parentGroupId: "g1",
    glsSettings: {
      faceMatch: { enabled: null, source: "inherited" },
    },
  },
  {
    id: "g4",
    name: "San Francisco Region",
    description: "SF Bay Area operations",
    vehicleCount: 15,
    driverCount: 18,
    parentGroupId: "g1",
    glsSettings: {
      faceMatch: { enabled: false, source: "group" },
    },
  },
  {
    id: "g5",
    name: "Midwest Division",
    description: "Operations in IL, OH, MI, IN",
    vehicleCount: 62,
    driverCount: 71,
    parentGroupId: null,
    glsSettings: {
      faceMatch: { enabled: null, source: "inherited" },
    },
  },
  {
    id: "g6",
    name: "Southwest Division",
    description: "Operations in TX, AZ, NM",
    vehicleCount: 55,
    driverCount: 63,
    parentGroupId: null,
    glsSettings: {
      faceMatch: { enabled: null, source: "inherited" },
    },
  },
  {
    id: "g7",
    name: "Southeast Division",
    description: "Operations in FL, GA, NC, SC",
    vehicleCount: 48,
    driverCount: 54,
    parentGroupId: null,
    glsSettings: {
      faceMatch: { enabled: null, source: "inherited" },
    },
  },
  {
    id: "g8",
    name: "Pacific Northwest",
    description: "Operations in WA, OR",
    vehicleCount: 22,
    driverCount: 26,
    parentGroupId: "g1",
    glsSettings: {
      faceMatch: { enabled: null, source: "inherited" },
    },
  },
  {
    id: "g9",
    name: "Chicago Metro",
    description: "Chicago metropolitan area",
    vehicleCount: 35,
    driverCount: 40,
    parentGroupId: "g5",
    glsSettings: {
      faceMatch: { enabled: null, source: "inherited" },
    },
  },
  {
    id: "g10",
    name: "Dallas-Fort Worth",
    description: "DFW metropolitan area",
    vehicleCount: 28,
    driverCount: 32,
    parentGroupId: "g6",
    glsSettings: {
      faceMatch: { enabled: null, source: "inherited" },
    },
  },
  {
    id: "g11",
    name: "Houston Metro",
    description: "Houston metropolitan area",
    vehicleCount: 24,
    driverCount: 27,
    parentGroupId: "g6",
    glsSettings: {
      faceMatch: { enabled: null, source: "inherited" },
    },
  },
  {
    id: "g12",
    name: "Florida Operations",
    description: "All Florida operations",
    vehicleCount: 30,
    driverCount: 35,
    parentGroupId: "g7",
    glsSettings: {
      faceMatch: { enabled: null, source: "inherited" },
    },
  },
  {
    id: "g13",
    name: "New York Metro",
    description: "NYC and surrounding areas",
    vehicleCount: 25,
    driverCount: 28,
    parentGroupId: "g2",
    glsSettings: {
      faceMatch: { enabled: null, source: "inherited" },
    },
  },
  {
    id: "g14",
    name: "Long Haul - West",
    description: "Cross-country routes - Western US",
    vehicleCount: 18,
    driverCount: 22,
    parentGroupId: null,
    glsSettings: {
      faceMatch: { enabled: null, source: "inherited" },
    },
  },
  {
    id: "g15",
    name: "Long Haul - East",
    description: "Cross-country routes - Eastern US",
    vehicleCount: 16,
    driverCount: 19,
    parentGroupId: null,
    glsSettings: {
      faceMatch: { enabled: null, source: "inherited" },
    },
  },
  {
    id: "g16",
    name: "Local Delivery - Urban",
    description: "Urban last-mile delivery",
    vehicleCount: 42,
    driverCount: 48,
    parentGroupId: null,
    glsSettings: {
      faceMatch: { enabled: null, source: "inherited" },
    },
  },
  {
    id: "g17",
    name: "Local Delivery - Suburban",
    description: "Suburban delivery routes",
    vehicleCount: 38,
    driverCount: 44,
    parentGroupId: null,
    glsSettings: {
      faceMatch: { enabled: null, source: "inherited" },
    },
  },
  {
    id: "g18",
    name: "Refrigerated Fleet",
    description: "Temperature-controlled vehicles",
    vehicleCount: 28,
    driverCount: 32,
    parentGroupId: null,
    glsSettings: {
      faceMatch: { enabled: null, source: "inherited" },
    },
  },
  {
    id: "g19",
    name: "Hazmat Certified",
    description: "Hazardous materials transport",
    vehicleCount: 12,
    driverCount: 15,
    parentGroupId: null,
    glsSettings: {
      faceMatch: { enabled: null, source: "inherited" },
    },
  },
  {
    id: "g20",
    name: "Training Fleet",
    description: "New driver training vehicles",
    vehicleCount: 8,
    driverCount: 24,
    parentGroupId: null,
    glsSettings: {
      faceMatch: { enabled: null, source: "inherited" },
    },
  },
]

const initialVehicles: Vehicle[] = [
  { id: "v1", name: "Truck 101", vin: "1HGBH41JXMN109186", groupId: "g3", faceMatchEnabled: null },
  { id: "v2", name: "Truck 102", vin: "2HGBH41JXMN109187", groupId: "g3", faceMatchEnabled: null },
  { id: "v3", name: "Truck 103", vin: "3HGBH41JXMN109188", groupId: "g4", faceMatchEnabled: null },
  { id: "v4", name: "Van 201", vin: "4HGBH41JXMN109189", groupId: "g2", faceMatchEnabled: null },
  { id: "v5", name: "Van 202", vin: "5HGBH41JXMN109190", groupId: null, faceMatchEnabled: null },
]

const initialDrivers: Driver[] = [
  { id: "d1", name: "Alice Johnson", email: "alice@example.com", groupId: "g3", faceEnrolled: true },
  { id: "d2", name: "Bob Smith", email: "bob@example.com", groupId: "g3", faceEnrolled: true },
  { id: "d3", name: "Carol Williams", email: "carol@example.com", groupId: "g4", faceEnrolled: false },
  { id: "d4", name: "David Brown", email: "david@example.com", groupId: "g2", faceEnrolled: true },
  { id: "d5", name: "Eva Martinez", email: "eva@example.com", groupId: null, faceEnrolled: false },
]

export const useAppStore = create<AppState>((set, get) => ({
  // Company Settings
  companySettings: {
    faceMatchEnabled: true,
    faceMatchMode: "group-level",
    faceMatchGroups: [],
  },
  setCompanySettings: (settings) =>
    set((state) => ({
      companySettings: { ...state.companySettings, ...settings },
      auditLog: [
        {
          id: crypto.randomUUID(),
          timestamp: new Date(),
          action: "Updated",
          entity: "company",
          entityId: "company",
          entityName: "Company Settings",
          field: Object.keys(settings)[0],
          oldValue: String(state.companySettings[Object.keys(settings)[0] as keyof CompanySettings]),
          newValue: String(Object.values(settings)[0]),
          user: "John Doe",
        },
        ...state.auditLog,
      ],
    })),

  // Groups
  groups: initialGroups,
  addGroup: (group) =>
    set((state) => ({
      groups: [...state.groups, group],
      auditLog: [
        {
          id: crypto.randomUUID(),
          timestamp: new Date(),
          action: "Created",
          entity: "group",
          entityId: group.id,
          entityName: group.name,
          field: "group",
          oldValue: "-",
          newValue: group.name,
          user: "John Doe",
        },
        ...state.auditLog,
      ],
    })),
  updateGroup: (id, updates) =>
    set((state) => {
      const oldGroup = state.groups.find((g) => g.id === id)
      return {
        groups: state.groups.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        auditLog: oldGroup
          ? [
              {
                id: crypto.randomUUID(),
                timestamp: new Date(),
                action: "Updated",
                entity: "group",
                entityId: id,
                entityName: oldGroup.name,
                field: Object.keys(updates)[0],
                oldValue: JSON.stringify(oldGroup[Object.keys(updates)[0] as keyof Group]),
                newValue: JSON.stringify(Object.values(updates)[0]),
                user: "John Doe",
              },
              ...state.auditLog,
            ]
          : state.auditLog,
      }
    }),
  deleteGroup: (id) =>
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== id),
    })),

  // Vehicles
  vehicles: initialVehicles,
  addVehicle: (vehicle) =>
    set((state) => ({
      vehicles: [...state.vehicles, vehicle],
      auditLog: [
        {
          id: crypto.randomUUID(),
          timestamp: new Date(),
          action: "Created",
          entity: "vehicle",
          entityId: vehicle.id,
          entityName: vehicle.name,
          field: "vehicle",
          oldValue: "-",
          newValue: vehicle.name,
          user: "John Doe",
        },
        ...state.auditLog,
      ],
    })),
  updateVehicle: (id, updates) =>
    set((state) => ({
      vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    })),
  assignVehicleToGroup: (vehicleId, groupId) =>
    set((state) => {
      const vehicle = state.vehicles.find((v) => v.id === vehicleId)
      const oldGroup = vehicle?.groupId ? state.groups.find((g) => g.id === vehicle.groupId) : null
      const newGroup = groupId ? state.groups.find((g) => g.id === groupId) : null

      return {
        vehicles: state.vehicles.map((v) =>
          v.id === vehicleId ? { ...v, groupId, faceMatchEnabled: null } : v
        ),
        auditLog: vehicle
          ? [
              {
                id: crypto.randomUUID(),
                timestamp: new Date(),
                action: "Assigned",
                entity: "vehicle",
                entityId: vehicleId,
                entityName: vehicle.name,
                field: "group",
                oldValue: oldGroup?.name || "Unassigned",
                newValue: newGroup?.name || "Unassigned",
                user: "John Doe",
              },
              ...state.auditLog,
            ]
          : state.auditLog,
      }
    }),

  // Drivers
  drivers: initialDrivers,
  addDriver: (driver) =>
    set((state) => ({
      drivers: [...state.drivers, driver],
    })),
  updateDriver: (id, updates) =>
    set((state) => ({
      drivers: state.drivers.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),

  // Audit Log
  auditLog: [
    {
      id: "a1",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      action: "Enabled",
      entity: "group",
      entityId: "g1",
      entityName: "West Coast Division",
      field: "faceMatch",
      oldValue: "Disabled",
      newValue: "Enabled",
      user: "John Doe",
    },
    {
      id: "a2",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      action: "Created",
      entity: "group",
      entityId: "g3",
      entityName: "Los Angeles Region",
      field: "group",
      oldValue: "-",
      newValue: "Los Angeles Region",
      user: "Jane Smith",
    },
  ],
  addAuditEntry: (entry) =>
    set((state) => ({
      auditLog: [
        {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
        ...state.auditLog,
      ],
    })),
}))

// Helper function to calculate effective Face Match status
export function getEffectiveFaceMatchStatus(
  groupId: string | null,
  groups: Group[],
  companySettings: CompanySettings
): { enabled: boolean; source: string } {
  if (!groupId) {
    return { enabled: companySettings.faceMatchEnabled, source: "Company Default" }
  }

  const group = groups.find((g) => g.id === groupId)
  if (!group) {
    return { enabled: companySettings.faceMatchEnabled, source: "Company Default" }
  }

  if (group.glsSettings.faceMatch.enabled !== null) {
    return { enabled: group.glsSettings.faceMatch.enabled, source: group.name }
  }

  // Check parent group
  if (group.parentGroupId) {
    return getEffectiveFaceMatchStatus(group.parentGroupId, groups, companySettings)
  }

  return { enabled: companySettings.faceMatchEnabled, source: "Company Default" }
}
