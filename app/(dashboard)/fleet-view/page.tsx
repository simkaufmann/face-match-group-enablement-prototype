"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Info, CheckCircle2, Circle, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export default function FleetViewPage() {
  const { companySettings, setCompanySettings, groups } = useAppStore()
  const [editingGeneral, setEditingGeneral] = useState(false)
  const [editingDriverId, setEditingDriverId] = useState(false)
  const [locationUpdatesEnabled, setLocationUpdatesEnabled] = useState(true)
  const [driverAppData, setDriverAppData] = useState(true)
  const [faceMatchEnabled, setFaceMatchEnabled] = useState(companySettings.faceMatchEnabled)
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [groupSearchQuery, setGroupSearchQuery] = useState("")

  // Get all groups and filter by search
  const allGroups = groups
  const filteredGroups = allGroups.filter((g) =>
    g.name.toLowerCase().includes(groupSearchQuery.toLowerCase())
  )

  const handleSaveDriverId = () => {
    setCompanySettings({ faceMatchEnabled: faceMatchEnabled })
    setEditingDriverId(false)
  }

  const toggleGroup = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    )
  }

  const selectAllGroups = () => {
    setSelectedGroups(allGroups.map((g) => g.id))
  }

  const deselectAllGroups = () => {
    setSelectedGroups([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">Fleet View</h1>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* General Section */}
        <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">General</h2>
            <button
              onClick={() => setEditingGeneral(!editingGeneral)}
              className="rounded-md border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {editingGeneral ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="px-6 py-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <div>
                <p className="font-medium text-gray-900">
                  Vehicle location updates while the engine is off
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  This setting only applies to light-duty/OBD-II vehicles (heavy-duty vehicles report location every 30 minutes by default) and will draw a small amount of power from the vehicle&apos;s battery.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Identification Section */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Driver Identification</h2>
            <button
              onClick={() => setEditingDriverId(!editingDriverId)}
              className="rounded-md border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {editingDriverId ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="px-6 py-4">
            {/* Info Banner */}
            <div className="mb-6 flex items-start gap-3 rounded-md border-l-4 border-blue-400 bg-blue-50 px-4 py-3">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
              <p className="text-sm text-gray-700">
                Motive uses multiple methods to identify drivers and suggest or assign them to trips.{" "}
                <a href="#" className="font-medium text-blue-600 hover:underline">
                  Learn more
                </a>
              </p>
            </div>

            {editingDriverId ? (
              /* Edit Mode */
              <div className="space-y-6">
                {/* AI trip assignment methods */}
                <div>
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    AI trip assignment methods:
                  </p>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={driverAppData}
                        onChange={(e) => setDriverAppData(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Driver App data</span>
                    </label>
                    <div>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={faceMatchEnabled}
                          onChange={(e) => setFaceMatchEnabled(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Face Match (facial recognition)</span>
                      </label>
                      <p className="ml-7 mt-1 text-xs text-gray-500">
                        Facial recognition is available when the driver-facing camera is turned on.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Group Selection - Only shown when Face Match is enabled */}
                {faceMatchEnabled && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">
                        Enable Face Match for specific groups:
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={selectAllGroups}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          Select all
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={deselectAllGroups}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          Clear all
                        </button>
                      </div>
                    </div>
                    
                    {/* Search */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search groups..."
                        value={groupSearchQuery}
                        onChange={(e) => setGroupSearchQuery(e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Groups List */}
                    <div className="max-h-64 space-y-1 overflow-y-auto rounded-md border border-gray-200 bg-white">
                      {filteredGroups.length === 0 ? (
                        <p className="px-3 py-4 text-center text-sm text-gray-500">
                          No groups found
                        </p>
                      ) : (
                        filteredGroups.map((group) => {
                          const isSelected = selectedGroups.includes(group.id)
                          const parentGroup = group.parentGroupId
                            ? allGroups.find((g) => g.id === group.parentGroupId)
                            : null
                          return (
                            <button
                              key={group.id}
                              onClick={() => toggleGroup(group.id)}
                              className={cn(
                                "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-gray-50",
                                isSelected && "bg-blue-50 hover:bg-blue-50"
                              )}
                            >
                              {isSelected ? (
                                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-600" />
                              ) : (
                                <Circle className="h-5 w-5 flex-shrink-0 text-gray-300" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className={cn(
                                  "truncate text-sm font-medium",
                                  isSelected ? "text-blue-900" : "text-gray-900"
                                )}>
                                  {group.name}
                                </p>
                                <p className="truncate text-xs text-gray-500">
                                  {parentGroup ? `${parentGroup.name} • ` : ""}
                                  {group.vehicleCount} vehicles, {group.driverCount} drivers
                                </p>
                              </div>
                            </button>
                          )
                        })
                      )}
                    </div>

                    {/* Selected count */}
                    <p className="mt-3 text-xs text-gray-500">
                      {selectedGroups.length === 0 ? (
                        "No groups selected. Face Match will apply to all vehicles."
                      ) : (
                        <>
                          <span className="font-medium text-gray-700">{selectedGroups.length}</span>
                          {" "}group{selectedGroups.length !== 1 ? "s" : ""} selected
                        </>
                      )}
                    </p>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                  <button
                    onClick={() => setEditingDriverId(false)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDriverId}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div>
                <p className="mb-3 text-sm text-gray-500">AI trip assignment methods:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Driver App data</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={cn(
                          "h-5 w-5",
                          companySettings.faceMatchEnabled ? "text-green-500" : "text-gray-300"
                        )}
                      />
                      <span className="text-sm text-gray-700">Face Match (facial recognition)</span>
                    </div>
                    <p className="ml-7 mt-1 text-xs text-gray-500">
                      Facial recognition is available when the driver-facing camera is turned on.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
