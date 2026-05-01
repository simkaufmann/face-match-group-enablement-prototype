"use client"

import { Header } from "@/components/dashboard/header"
import { Shield } from "lucide-react"
import Link from "next/link"

export default function SafetyPage() {
  return (
    <div className="flex flex-col">
      <Header title="Safety" description="Monitor and improve fleet safety" />

      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            Safety Dashboard
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            This is a prototype focused on Face Match group enablement. Visit
            the Driver ID Settings to configure Face Match at the group level.
          </p>
          <Link
            href="/admin/driver-id"
            className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go to Driver ID Settings
          </Link>
        </div>
      </div>
    </div>
  )
}
