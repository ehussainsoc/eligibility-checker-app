import { GraduationCap } from "lucide-react"
import { EligibilityChecker } from "@/components/eligibility-checker"
export const dynamic = "force-dynamic"
export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-3xl font-bold">Staff Eligibility Dashboard</h1>
          <p className="mt-2 text-primary-foreground/80">
            Review applicant eligibility, potential grants, and funding reasons.
          </p>
        </div>
      </section>
  
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm border">
            <p className="text-sm text-slate-500">Total Applicants</p>
            <p className="mt-2 text-3xl font-bold">{applicants?.length || 0}</p>
          </div>
  
          <div className="rounded-2xl bg-white p-5 shadow-sm border">
            <p className="text-sm text-slate-500">New Applications</p>
            <p className="mt-2 text-3xl font-bold">
              {applicants?.filter((a) => (a.status || "New") === "New").length || 0}
            </p>
          </div>
  
          <div className="rounded-2xl bg-white p-5 shadow-sm border">
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
            ].filter(Boolean) as any[]
  
            return (
              <div
                key={a.id}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 border-b bg-slate-50 p-5 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {a.full_name}
                    </h2>
                    <p className="text-sm text-slate-500">{a.email}</p>
                    <span className="mt-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {a.status || "New"}
                    </span>
                  </div>
  
                  <div className="rounded-xl bg-white px-5 py-4 text-left shadow-sm md:text-right">
                    <p className="text-sm text-slate-500">Potential Funding</p>
                    <p className="text-3xl font-bold text-primary">
                      £{result.totalFunding || 0}
                    </p>
                  </div>
                </div>
  
                <div className="p-5">
                  <div className="grid gap-3 md:grid-cols-3">
                    {eligibleGrants.length > 0 ? (
                      eligibleGrants.map((grant) => (
                        <div
                          key={grant.name}
                          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
                        >
                          <p className="font-semibold text-emerald-950">
                            {grant.name}
                          </p>
                          <p className="text-sm font-medium text-emerald-700">
                            {grant.amount} — {grant.type}
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
                    <p><span className="font-semibold">Employment:</span> {a.employment_status}</p>
                    <p><span className="font-semibold">Universal Credit:</span> {a.universal_credit}</p>
                    <p><span className="font-semibold">UC Duration:</span> {a.universal_credit_duration}</p>
                    <p><span className="font-semibold">Seeking Work:</span> {a.seeking_work_duration}</p>
                    <p><span className="font-semibold">Care Leaver:</span> {a.care_leaver}</p>
                    <p><span className="font-semibold">Apprenticeship:</span> {a.applying_for_apprenticeship}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )