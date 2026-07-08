import { supabase } from "@/lib/supabase"
import { evaluateEligibility } from "@/lib/eligibility"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

const grantInfo = {
  youth_jobs_grant: {
    id: "youth-jobs-grant",
    name: "Youth Jobs Grant",
    amount: 3000,
    type: "Employer grant",
    recipient: "Employer",
    reason:
      "For hiring an unemployed young person aged 18–24 who has been on Universal Credit and seeking work for 6+ months.",
  },
  care_leaver_bursary: {
    id: "care-leaver-bursary",
    name: "Care Leaver Bursary",
    amount: 3000,
    type: "Apprentice bursary",
    recipient: "Apprentice",
    reason: "For apprentices aged 16–24 who have been in local authority care.",
  },
  sme_incentive: {
    id: "sme-incentive",
    name: "SME Incentive",
    amount: 2000,
    type: "Employer incentive",
    recipient: "Employer",
    reason: "For SMEs taking on an eligible young apprentice aged 18–24.",
  },
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function StaffPage() {
  const { data: applicants, error } = await supabase
    .from("applicants")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return <main className="p-6">Error loading applicants: {error.message}</main>
  }

  const totalApplicants = applicants?.length || 0

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-3xl font-bold">Staff Eligibility Dashboard</h1>
          <p className="mt-2 text-primary-foreground/80">
            Review applicant eligibility, employer funding, apprentice bursaries
            and combined potential support.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Applicants</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalApplicants}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">New Applications</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {applicants?.filter((a) => (a.status || "New") === "New")
                .length || 0}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Dashboard Status</p>
            <p className="mt-2 text-3xl font-bold text-primary">Live</p>
          </div>
        </div>

        <div className="grid gap-5">
          {applicants?.map((a) => {
            const result = evaluateEligibility({
              fullName: a.full_name || "",
              email: a.email || "",
              dateOfBirth: a.date_of_birth || "",
              employmentStatus: a.employment_status || "",
              universalCredit: a.universal_credit || "",
              universalCreditDuration: a.universal_credit_duration || "",
              seekingWorkDuration: a.seeking_work_duration || "",
              careLeaver: a.care_leaver || "",
              applyingForApprenticeship: a.applying_for_apprenticeship || "",
            })

            const eligibleGrantNames = result.grants
              .filter((grant) => grant.eligible)
              .map((grant) => grant.name)

            const eligibleGrants = [
              eligibleGrantNames.includes("Youth Jobs Grant") &&
                grantInfo.youth_jobs_grant,
              eligibleGrantNames.includes("Care Leaver Bursary") &&
                grantInfo.care_leaver_bursary,
              eligibleGrantNames.includes("SME Incentive") &&
                grantInfo.sme_incentive,
            ].filter(Boolean) as (typeof grantInfo)[keyof typeof grantInfo][]

            const employerFunding = eligibleGrants
              .filter((grant) => grant.recipient === "Employer")
              .reduce((sum, grant) => sum + grant.amount, 0)

            const apprenticeFunding = eligibleGrants
              .filter((grant) => grant.recipient === "Apprentice")
              .reduce((sum, grant) => sum + grant.amount, 0)

            const combinedFunding = employerFunding + apprenticeFunding

            return (
              <div
                key={a.id}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 border-b bg-slate-50 p-5 md:flex-row md:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900">
                        {a.full_name}
                      </h2>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {a.status || "New"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{a.email}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Age: {result.age}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border bg-white px-4 py-3">
                      <p className="text-xs font-medium text-slate-500">
                        Employer Funding
                      </p>
                      <p className="mt-1 text-2xl font-bold text-primary">
                        {formatCurrency(employerFunding)}
                      </p>
                    </div>

                    <div className="rounded-xl border bg-white px-4 py-3">
                      <p className="text-xs font-medium text-slate-500">
                        Apprentice Funding
                      </p>
                      <p className="mt-1 text-2xl font-bold text-primary">
                        {formatCurrency(apprenticeFunding)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
                      <p className="text-xs font-medium text-slate-500">
                        Combined Potential
                      </p>
                      <p className="mt-1 text-2xl font-bold text-primary">
                        {formatCurrency(combinedFunding)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid gap-3 md:grid-cols-3">
                    {eligibleGrants.length > 0 ? (
                      eligibleGrants.map((grant) => (
                        <div
                          key={grant.id}
                          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
                        >
                          <p className="font-semibold text-emerald-950">
                            {grant.name}
                          </p>
                          <p className="mt-1 text-sm font-medium text-emerald-700">
                            {formatCurrency(grant.amount)} — {grant.type}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-emerald-900">
                            Paid to: {grant.recipient}
                          </p>
                          <p className="mt-2 text-sm text-emerald-800">
                            {grant.reason}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4 md:col-span-3">
                        <p className="font-semibold text-red-900">
                          No eligible grants identified
                        </p>
                        <p className="text-sm text-red-700">
                          Based on the current answers, this applicant does not
                          meet the stored eligibility rules.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 md:grid-cols-3">
                    <p>
                      <span className="font-semibold">Employment:</span>{" "}
                      {a.employment_status}
                    </p>
                    <p>
                      <span className="font-semibold">Universal Credit:</span>{" "}
                      {a.universal_credit}
                    </p>
                    <p>
                      <span className="font-semibold">UC Duration:</span>{" "}
                      {a.universal_credit_duration}
                    </p>
                    <p>
                      <span className="font-semibold">Seeking Work:</span>{" "}
                      {a.seeking_work_duration}
                    </p>
                    <p>
                      <span className="font-semibold">Care Leaver:</span>{" "}
                      {a.care_leaver}
                    </p>
                    <p>
                      <span className="font-semibold">Apprenticeship:</span>{" "}
                      {a.applying_for_apprenticeship}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}