"use client"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { GraduationCap, RotateCcw } from "lucide-react"
import {
  evaluateEligibility,
  type EligibilityResult,
  type FormData,
} from "@/lib/eligibility"
import { EligibilityResults } from "@/components/eligibility-results"

const EMPLOYMENT_OPTIONS = [
  "Unemployed",
  "Employed part-time",
  "Employed full-time",
  "In education",
  "Self-employed",
]

const initialForm: FormData = {
  fullName: "",
  email: "",
  dateOfBirth: "",
  employmentStatus: "",
  universalCredit: "",
  universalCreditDuration: "",
  seekingWorkDuration: "",
  careLeaver: "",
  applyingForApprenticeship: "",
}

const labelClass = "text-sm font-medium text-card-foreground"
const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"

function YesNoField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: "yes" | "no" | ""
  onChange: (v: "yes" | "no") => void
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className={labelClass}>{label}</legend>
      <div className="flex gap-2">
        {(["yes", "no"] as const).map((option) => (
          <label
            key={option}
            className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${
              value === option
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background text-foreground hover:bg-secondary"
            }`}
          >
            <input
              type="radio"
              name={id}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function EligibilityChecker() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [result, setResult] = useState<EligibilityResult | null>(null)

  const showUcDetails = form.universalCredit === "yes"

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
  
    const result = evaluateEligibility(form)
  
    const { error } = await supabase.from("applicants").insert({
      full_name: form.fullName,
      email: form.email,
      date_of_birth: form.dateOfBirth,
      employment_status: form.employmentStatus,
      universal_credit: form.universalCredit,
      universal_credit_duration: form.universalCreditDuration,
      seeking_work_duration: form.seekingWorkDuration,
      care_leaver: form.careLeaver,
      applying_for_apprenticeship: form.applyingForApprenticeship,
      youth_jobs_grant: result.grants.some(
        (g) => g.name === "Youth Jobs Grant" && g.eligible
      ),
      care_leaver_bursary: result.grants.some(
        (g) => g.name === "Care Leaver Bursary" && g.eligible
      ),
      sme_incentive: result.grants.some(
        (g) => g.name === "SME Incentive" && g.eligible
      ),
      total_funding: result.totalFunding,
      reasons: JSON.stringify(result),
      status: "New",
    })
  
    if (error) {
      alert("There was an error submitting your application. Please try again.")
      console.error(error)
      return
    }
  
    alert(
      "Thank you. Your application has been submitted successfully. Our recruitment team will review your application and contact you if you are shortlisted."
    )
  
    setForm(initialForm)
  }

  function handleReset() {
    setForm(initialForm)
    setResult(null)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
      >
        <h2 className="text-lg font-semibold text-card-foreground">
          Your details
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete the form to check which grants you may qualify for.
        </p>

        <div className="mt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="fullName" className={labelClass}>
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className={inputClass}
              placeholder="Jane Doe"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
              placeholder="jane@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="dob" className={labelClass}>
              Date of birth
            </label>
            <input
              id="dob"
              type="date"
              required
              value={form.dateOfBirth}
              onChange={(e) => update("dateOfBirth", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="employment" className={labelClass}>
              Employment status
            </label>
            <select
              id="employment"
              required
              value={form.employmentStatus}
              onChange={(e) => update("employmentStatus", e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>
                Select an option
              </option>
              {EMPLOYMENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <YesNoField
            id="universalCredit"
            label="Receiving Universal Credit?"
            value={form.universalCredit}
            onChange={(v) => update("universalCredit", v)}
          />

          {showUcDetails && (
            <div className="flex flex-col gap-2">
              <label htmlFor="ucDuration" className={labelClass}>
                Universal Credit duration (months)
              </label>
              <select
  id="ucDuration"
  required
  value={form.universalCreditDuration}
  onChange={(e) => update("universalCreditDuration", e.target.value)}
  className={inputClass}
>
  <option value="">Select an option</option>
  <option value="Less than 6 months">Less than 6 months</option>
  <option value="6 months or more">6 months or more</option>
  <option value="Not applicable">Not applicable</option>
</select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="seekingWork" className={labelClass}>
              Seeking work duration (months)
            </label>
            <select
  id="seekingWork"
  required
  value={form.seekingWorkDuration}
  onChange={(e) => update("seekingWorkDuration", e.target.value)}
  className={inputClass}
>
  <option value="">Select an option</option>
  <option value="Less than 6 months">Less than 6 months</option>
  <option value="6 months or more">6 months or more</option>
</select>
          </div>

          <YesNoField
            id="careLeaver"
            label="Are you a care leaver?"
            value={form.careLeaver}
            onChange={(v) => update("careLeaver", v)}
          />

          <YesNoField
            id="applyingForApprenticeship"
            label="Applying for an apprenticeship?"
            value={form.applyingForApprenticeship}
            onChange={(v) => update("applyingForApprenticeship", v)}
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/40"
          >
            <GraduationCap className="size-4" aria-hidden="true" />
            Submit
          </button>
          {result && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset
            </button>
          )}
        </div>
      </form>

      <div className="lg:sticky lg:top-8">
  <div className="rounded-2xl border bg-card p-8">
    <h2 className="text-xl font-semibold">
      Application Review
    </h2>

    <p className="mt-4 text-muted-foreground">
      Complete the application form and submit it.
    </p>

    <p className="mt-2 text-muted-foreground">
      Our apprenticeship team will review your eligibility and contact you shortly.
    </p>

    <p className="mt-6 text-sm font-medium text-primary">
      
    </p>
  </div>
</div>
    </div>
  )
}
