import { Check, X } from "lucide-react"
import type { EligibilityResult } from "@/lib/eligibility"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount)
}

function GrantCard({
  grant,
}: {
  grant: EligibilityResult["grants"][number]
}) {
  const eligible = grant.eligible
  return (
    <div
      className={`rounded-xl border bg-card p-5 shadow-sm ${
        eligible ? "border-primary/40" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-card-foreground text-balance">
            {grant.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(grant.amount)} potential funding
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            eligible
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {eligible ? (
            <Check className="size-3.5" aria-hidden="true" />
          ) : (
            <X className="size-3.5" aria-hidden="true" />
          )}
          {eligible ? "Eligible" : "Not eligible"}
        </span>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {grant.reasons.map((reason, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
            <span
              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground"
              aria-hidden="true"
            />
            <span className="leading-relaxed">{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function EligibilityResults({ result }: { result: EligibilityResult }) {
  const eligibleGrants = result.grants.filter((g) => g.eligible)
  const ineligibleGrants = result.grants.filter((g) => !g.eligible)

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
        <p className="text-sm font-medium text-muted-foreground">
          Total possible funding
        </p>
        <p className="mt-1 text-4xl font-bold text-primary">
          {formatCurrency(result.totalFunding)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Based on an age of {result.age} and {eligibleGrants.length} eligible{" "}
          {eligibleGrants.length === 1 ? "grant" : "grants"}.
        </p>
      </div>

      {eligibleGrants.length > 0 && (
        <section aria-labelledby="eligible-heading" className="flex flex-col gap-3">
          <h2
            id="eligible-heading"
            className="text-sm font-semibold uppercase tracking-wide text-primary"
          >
            Eligible grants
          </h2>
          {eligibleGrants.map((grant) => (
            <GrantCard key={grant.id} grant={grant} />
          ))}
        </section>
      )}

      {ineligibleGrants.length > 0 && (
        <section aria-labelledby="ineligible-heading" className="flex flex-col gap-3">
          <h2
            id="ineligible-heading"
            className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Ineligible grants
          </h2>
          {ineligibleGrants.map((grant) => (
            <GrantCard key={grant.id} grant={grant} />
          ))}
        </section>
      )}
    </div>
  )
}
