"use client"

import { Header } from "@/components/dashboard/header"
import { FileText } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="flex flex-col">
      <Header title="Reports" description="Generate and view reports" />

      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            Reports
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            This is a prototype focused on Face Match group enablement.
            Reporting functionality is not included in this prototype.
          </p>
        </div>
      </div>
    </div>
  )
}
