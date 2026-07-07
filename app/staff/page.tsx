import Link from "next/link"
import { ArrowLeft, ClipboardList } from "lucide-react"
import { StaffDashboard } from "@/components/staff-dashboard"
import { StaffGate } from "@/components/staff-gate"

export const metadata = {
  title: "Staff Dashboard — Applicants",
}

export default function StaffPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-primary">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-6 sm:px-6">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary-foreground/15">
            <ClipboardList
              className="size-6 text-primary-foreground"
              aria-hidden="true"
            />
          </span>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-primary-foreground text-balance">
              Staff Dashboard
            </h1>
            <p className="text-sm text-primary-foreground/80">
              Review submitted apprenticeship funding applications.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground/15 px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/25"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Application form
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <StaffGate>
          <StaffDashboard />
        </StaffGate>
      </div>
    </main>
  )
}
