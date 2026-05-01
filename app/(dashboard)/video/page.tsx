"use client"

import { Header } from "@/components/dashboard/header"
import { Video } from "lucide-react"

export default function VideoPage() {
  return (
    <div className="flex flex-col">
      <Header title="Video" description="Review dash cam footage" />

      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Video className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            Video Review
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            This is a prototype focused on Face Match group enablement. Video
            review functionality is not included in this prototype.
          </p>
        </div>
      </div>
    </div>
  )
}
