"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Info, CheckCircle2, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function FleetViewPage() {
  const { companySettings, setCompanySettings, groups } = useAppStore()
  const [editingGeneral, setEditingGeneral] = useState(false)
  const [editingDriverId, setEditingDriverId] = useState(false)
  const [locationUpdatesEnabled, setLocationUpdatesEnabled] = useState(true)
  const [driverAppData, setDriverAppData] = useState(true)
  const [faceMatchId, setFaceMatchId] = useState(companySettings.faceMatchEnabled)
  const [faceMatchTrip, setFaceMatchTrip] = useState(companySettings.faceMatchEnabled)
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false)

  // Get root-level groups
  const rootGroups = groups.filter((g) => !g.parentGroupId)

  const handleSaveDriverId = () => {
    setCompanySettings({ faceMatchEnabled: faceMatchId })
    setEditingDriverId(false)
  }

  const toggleGroup = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    )
  }

  const removeGroup = (groupId: string) => {
    setSelectedGroups((prev) => prev.filter((id) => id !== groupId))
  }

  const getGroupName = (groupId: string) => {
    return groups.find((g) => g.id === groupId)?.name || groupId
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
                {/* AI driver identification methods */}
                <div>
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    AI driver identification methods:
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
                          checked={faceMatchId}
                          onChange={(e) => setFaceMatchId(e.target.checked)}
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
                {faceMatchId && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="mb-3 text-sm font-medium text-gray-700">
                      Enable Face Match for specific groups:
                    </p>
                    
                    {/* Selected Groups Tags */}
                    {selectedGroups.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {selectedGroups.map((groupId) => (
                          <span
                            key={groupId}
                            className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                          >
                            {getGroupName(groupId)}
                            <button
                              onClick={() => removeGroup(groupId)}
                              className="ml-1 rounded-full p-0.5 hover:bg-blue-200"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Group Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
                        className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm shadow-sm hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <span className="text-gray-700">
                          {selectedGroups.length === 0
                            ? "Select groups..."
                            : `${selectedGroups.length} group${selectedGroups.length > 1 ? "s" : ""} selected`}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-gray-400 transition-transform",
                            groupDropdownOpen && "rotate-180"
                          )}
                        />
                      </button>

                      {groupDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                          {rootGroups.map((group) => (
                            <button
                              key={group.id}
                              onClick={() => toggleGroup(group.id)}
                              className={cn(
                                "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100",
                                selectedGroups.includes(group.id) && "bg-blue-50"
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={selectedGroups.includes(group.id)}
                                onChange={() => {}}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{group.name}</p>
                                <p className="text-xs text-gray-500">
                                  {group.vehicleCount} vehicles, {group.driverCount} drivers
                                </p>
                              </div>
                            </button>
                          ))}
                          {rootGroups.length === 0 && (
                            <p className="px-3 py-2 text-sm text-gray-500">No groups available</p>
                          )}
                        </div>
                      )}
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      Face Match will only be required for drivers in the selected groups. Leave empty to apply to all vehicles.
                    </p>
                  </div>
                )}

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
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={faceMatchTrip}
                        onChange={(e) => setFaceMatchTrip(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Face Match (facial recognition)</span>
                    </label>
                  </div>
                </div>

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
              <div className="space-y-6">
                {/* AI driver identification methods */}
                <div>
                  <p className="mb-3 text-sm text-gray-500">AI driver identification methods:</p>
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

                {/* AI trip assignment methods */}
                <div>
                  <p className="mb-3 text-sm text-gray-500">AI trip assignment methods:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-700">Driver App data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={cn(
                          "h-5 w-5",
                          companySettings.faceMatchEnabled ? "text-green-500" : "text-gray-300"
                        )}
                      />
                      <span className="text-sm text-gray-700">Face Match (facial recognition)</span>
                    </div>
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
