import Link from "next/link"
import { CheckCircle2, GraduationCap } from "lucide-react"

export default function ConfirmationPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-primary/30 bg-card p-8 text-center shadow-sm sm:p-10">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="size-9 text-primary" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-card-foreground text-balance">
          Application received
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
          Thank you. Your application has been submitted successfully. Our
          recruitment team will review your application and contact you if you
          are shortlisted.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <GraduationCap className="size-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </main>
  )
}
