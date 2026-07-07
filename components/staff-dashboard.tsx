"use client"

import useSWR from "swr"
import { Check, Minus, RefreshCw, Users } from "lucide-react"
import { supabase, isSupabaseConfigured, type ApplicantRow } from "@/lib/supabase"

const GRANT_LABELS: Record<string, string> = {
  "youth-jobs-grant": "Youth Jobs Grant",
  "care-leaver-bursary": "Care Leaver Bursary",
  "sme-incentive": "SME Incentive",
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

async function fetchApplicants(): Promise<ApplicantRow[]> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    )
  }
  const { data, error } = await supabase
    .from("applicants")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as ApplicantRow[]
}

function GrantCell({ eligible }: { eligible: boolean }) {
  return eligible ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
      <Check className="size-3" aria-hidden="true" />
      Eligible
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Minus className="size-3" aria-hidden="true" />
      No
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "approved"
      ? "bg-primary text-primary-foreground"
      : status === "rejected"
        ? "bg-destructive/10 text-destructive"
        : "bg-secondary text-secondary-foreground"
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${tone}`}
    >
      {status}
    </span>
  )
}

export function StaffDashboard() {
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    "applicants",
    fetchApplicants,
  )

  const totalApplicants = data?.length ?? 0
  const totalFunding =
    data?.reduce((sum, a) => sum + (a.total_funding ?? 0), 0) ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total applicants</p>
          <p className="mt-1 text-3xl font-bold text-card-foreground">
            {totalApplicants}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Total potential funding
          </p>
          <p className="mt-1 text-3xl font-bold text-primary">
            {formatCurrency(totalFunding)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Applicants</h2>
        <button
          type="button"
          onClick={() => mutate()}
          className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <RefreshCw
            className={`size-4 ${isValidating ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
          Failed to load applicants: {error.message}. Make sure the{" "}
          <code>applicants</code> table exists and read access is allowed.
        </div>
      ) : isLoading ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          Loading applicants…
        </div>
      ) : totalApplicants === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
          <Users className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium text-card-foreground">
            No applications yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Submitted applications will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Age</th>
                <th className="px-4 py-3 font-medium">Youth Jobs Grant</th>
                <th className="px-4 py-3 font-medium">Care Leaver Bursary</th>
                <th className="px-4 py-3 font-medium">SME Incentive</th>
                <th className="px-4 py-3 font-medium">Total Funding</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Reasons</th>
                <th className="px-4 py-3 font-medium">Date Submitted</th>
              </tr>
            </thead>
            <tbody>
              {data!.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-border last:border-0 align-top hover:bg-secondary/30"
                >
                  <td className="px-4 py-3 font-medium text-card-foreground">
                    {a.full_name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{a.email}</td>
                  <td className="px-4 py-3 text-card-foreground">{a.age}</td>
                  <td className="px-4 py-3">
                    <GrantCell eligible={a.youth_jobs_grant} />
                  </td>
                  <td className="px-4 py-3">
                    <GrantCell eligible={a.care_leaver_bursary} />
                  </td>
                  <td className="px-4 py-3">
                    <GrantCell eligible={a.sme_incentive} />
                  </td>
                  <td className="px-4 py-3 font-semibold text-primary">
                    {formatCurrency(a.total_funding)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3">
                    <details className="max-w-xs">
                      <summary className="cursor-pointer text-xs font-medium text-primary">
                        View reasons
                      </summary>
                      <div className="mt-2 flex flex-col gap-2">
                        {Object.entries(a.reasons ?? {}).map(([id, list]) => (
                          <div key={id}>
                            <p className="text-xs font-semibold text-card-foreground">
                              {GRANT_LABELS[id] ?? id}
                            </p>
                            <ul className="mt-1 flex flex-col gap-0.5">
                              {list.map((reason, i) => (
                                <li
                                  key={i}
                                  className="text-xs leading-relaxed text-muted-foreground"
                                >
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </details>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatDate(a.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
