import { GraduationCap } from "lucide-react"
import { EligibilityChecker } from "@/components/eligibility-checker"
export const dynamic = "force-dynamic"
export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-primary">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-6 sm:px-6">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary-foreground/15">
            <GraduationCap
              className="size-6 text-primary-foreground"
              aria-hidden="true"
            />
          </span>
          <div>
            <h1 className="text-lg font-bold text-primary-foreground text-balance">
              Apprenticeship Funding Eligibility Checker
            </h1>
            <p className="text-sm text-primary-foreground/80">
              Find out which grants and incentives you may qualify for.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <EligibilityChecker />
      </div>
    </main>
  )
}
