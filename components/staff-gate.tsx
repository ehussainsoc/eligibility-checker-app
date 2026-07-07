"use client"

import { useState, type ReactNode } from "react"
import { Lock } from "lucide-react"

const PASSCODE = process.env.NEXT_PUBLIC_STAFF_PASSCODE

export function StaffGate({ children }: { children: ReactNode }) {
  // If no passcode is configured, the dashboard is open.
  const [unlocked, setUnlocked] = useState(!PASSCODE)
  const [value, setValue] = useState("")
  const [error, setError] = useState(false)

  if (unlocked) return <>{children}</>

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value === PASSCODE) {
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-sm flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
        <Lock className="size-6 text-primary" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-card-foreground">
        Staff access
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter the staff passcode to view applications.
      </p>
      <input
        type="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Passcode"
        aria-label="Staff passcode"
        className="mt-5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
      />
      {error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          Incorrect passcode.
        </p>
      )}
      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Unlock
      </button>
    </form>
  )
}
