
import { supabase } from "@/lib/supabase"
import { evaluateEligibility } from "@/lib/eligibility"
export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"
const grantInfo = {
  youth_jobs_grant: {
    name: "Youth Jobs Grant",
    amount: "£3,000",
    type: "Employer grant",
    reason: "For hiring an unemployed young person aged 18–24 who has been on Universal Credit and seeking work for 6+ months.",
  },
  care_leaver_bursary: {
    name: "Care Leaver Bursary",
    amount: "£3,000",
    type: "Apprentice bursary",
    reason: "For apprentices aged 16–24 who have been in local authority care.",
  },
  sme_incentive: {
    name: "SME Incentive",
    amount: "£2,000",
    type: "Employer incentive",
    reason: "For SMEs taking on an eligible young apprentice aged 16–24.",
  },
}

export default async function StaffPage() {
  const { data: applicants, error } = await supabase
    .from("applicants")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return <main className="p-6">Error loading applicants: {error.message}</main>
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-bold">Staff Eligibility Dashboard</h1>
      <p className="mb-6 text-slate-600">
        Review applicant eligibility, potential grants, and funding reasons.
      </p>

      <div className="grid gap-4">
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
              console.log("Eligibility result:", result)
              const eligibleGrantNames = result.grants
              .filter((grant) => grant.eligible)
              .map((grant) => grant.name)

              const eligibleGrants = [
                eligibleGrantNames.includes("Youth Jobs Grant") && grantInfo.youth_jobs_grant,
                eligibleGrantNames.includes("Care Leaver Bursary") && grantInfo.care_leaver_bursary,
                eligibleGrantNames.includes("SME Incentive") && grantInfo.sme_incentive,
              ].filter(Boolean) as any[]

          return (
            <div key={a.id} className="rounded-xl bg-white p-5 shadow">
              <div className="flex flex-col justify-between gap-3 md:flex-row">
                <div>
                  <h2 className="text-lg font-semibold">{a.full_name}</h2>
                  <p className="text-sm text-slate-600">{a.email}</p>
                  <p className="text-sm text-slate-600">
                    Status: {a.status || "New"}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-sm text-slate-600">Potential Funding</p>
                  <p className="text-2xl font-bold">£{result.totalFunding || 0}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {eligibleGrants.length > 0 ? (
                  eligibleGrants.map((grant) => (
                    <div
                      key={grant.name}
                      className="rounded-lg border border-green-200 bg-green-50 p-4"
                    >
                      <p className="font-semibold text-green-900">
                        {grant.name}
                      </p>
                      <p className="text-sm font-medium text-green-700">
                        {grant.amount} — {grant.type}
                      </p>
                      <p className="mt-2 text-sm text-green-800">
                        {grant.reason}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 md:col-span-3">
                    <p className="font-semibold text-red-900">
                      No eligible grants identified
                    </p>
                    <p className="text-sm text-red-700">
                      Based on the current answers, this applicant does not meet
                      the stored eligibility rules.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-2 text-sm text-slate-700 md:grid-cols-3">
                <p>Employment: {a.employment_status}</p>
                <p>Universal Credit: {a.universal_credit}</p>
                <p>UC Duration: {a.universal_credit_duration}</p>
                <p>Seeking Work: {a.seeking_work_duration}</p>
                <p>Care Leaver: {a.care_leaver}</p>
                <p>Apprenticeship: {a.applying_for_apprenticeship}</p>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}