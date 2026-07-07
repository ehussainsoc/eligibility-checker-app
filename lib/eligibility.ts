export type YesNo = "yes" | "no" | ""
export type UcDuration = "lt6" | "gte6" | "na" | ""
export type SeekingDuration = "lt6" | "gte6" | ""

export type FormData = {
  fullName: string
  email: string
  dateOfBirth: string
  employmentStatus: string
  universalCredit: YesNo
  universalCreditDuration: UcDuration
  seekingWorkDuration: SeekingDuration
  careLeaver: YesNo
  applyingForApprenticeship: YesNo
}

export type GrantResult = {
  id: string
  name: string
  amount: number
  eligible: boolean
  reasons: string[]
}

export type EligibilityResult = {
  age: number
  grants: GrantResult[]
  totalFunding: number
}

export const GRANT_AMOUNTS = {
  youthJobsGrant: 3000,
  careLeaverBursary: 2000,
  smeIncentive: 1500,
}

export const EMPLOYMENT_OPTIONS = [
  "Employed Full Time",
  "Employed Part Time",
  "Self Employed",
  "Unemployed",
  "Student",
  "Other",
]

export const UC_DURATION_OPTIONS: { value: UcDuration; label: string }[] = [
  { value: "lt6", label: "Less than 6 months" },
  { value: "gte6", label: "6 months or more" },
  { value: "na", label: "Not applicable" },
]

export const SEEKING_DURATION_OPTIONS: {
  value: SeekingDuration
  label: string
}[] = [
  { value: "lt6", label: "Less than 6 months" },
  { value: "gte6", label: "6 months or more" },
]

// The `applicants` table stores durations as integers. We map the selected
// category to a sentinel month value so we don't have to change the schema.
export function ucDurationToMonths(v: UcDuration): number {
  if (v === "gte6") return 6
  if (v === "lt6") return 1
  return 0 // "na" or empty
}

export function seekingToMonths(v: SeekingDuration): number {
  if (v === "gte6") return 6
  if (v === "lt6") return 1
  return 0
}

// Reverse mapping used by the staff dashboard to display readable labels.
export function ucMonthsToLabel(n: number, onUniversalCredit: boolean): string {
  if (!onUniversalCredit) return "Not applicable"
  if (n >= 6) return "6 months or more"
  if (n >= 1) return "Less than 6 months"
  return "Not applicable"
}

export function seekingMonthsToLabel(n: number): string {
  return n >= 6 ? "6 months or more" : "Less than 6 months"
}

export function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  return age
}

export function evaluateEligibility(data: FormData): EligibilityResult {
  const age = calculateAge(data.dateOfBirth)
  const onUc = data.universalCredit === "yes"
  const ucSixPlus = data.universalCreditDuration === "gte6"
  const seekingSixPlus = data.seekingWorkDuration === "gte6"

  // Youth Jobs Grant: age 18–24, on Universal Credit for 6+ months, and
  // seeking work for 6+ months.
  const yjgAgeOk = age >= 18 && age <= 24
  const yjgReasons = [
    yjgAgeOk
      ? `Age ${age} is within the required 18–24 range.`
      : `Age ${age} is outside the required 18–24 range.`,
    onUc
      ? "Receiving Universal Credit."
      : "Not receiving Universal Credit (required).",
    ucSixPlus
      ? "On Universal Credit for 6 months or more."
      : "Not on Universal Credit for 6 months or more (required).",
    seekingSixPlus
      ? "Seeking work for 6 months or more."
      : "Not seeking work for 6 months or more (required).",
  ]
  const youthJobsGrant: GrantResult = {
    id: "youth-jobs-grant",
    name: "Youth Jobs Grant",
    amount: GRANT_AMOUNTS.youthJobsGrant,
    eligible: yjgAgeOk && onUc && ucSixPlus && seekingSixPlus,
    reasons: yjgReasons,
  }

  // Care Leaver Bursary: age 16–24 and is a care leaver.
  const clbAgeOk = age >= 16 && age <= 24
  const clbCareOk = data.careLeaver === "yes"
  const careLeaverBursary: GrantResult = {
    id: "care-leaver-bursary",
    name: "Care Leaver Bursary",
    amount: GRANT_AMOUNTS.careLeaverBursary,
    eligible: clbAgeOk && clbCareOk,
    reasons: [
      clbAgeOk
        ? `Age ${age} is within the required 16–24 range.`
        : `Age ${age} is outside the required 16–24 range.`,
      clbCareOk
        ? "Identified as a care leaver."
        : "Not identified as a care leaver (required).",
    ],
  }

  // SME Incentive: age 16–24 and applying for an apprenticeship.
  const smeAgeOk = age >= 16 && age <= 24
  const smeApplyingOk = data.applyingForApprenticeship === "yes"
  const smeIncentive: GrantResult = {
    id: "sme-incentive",
    name: "SME Incentive",
    amount: GRANT_AMOUNTS.smeIncentive,
    eligible: smeAgeOk && smeApplyingOk,
    reasons: [
      smeAgeOk
        ? `Age ${age} is within the required 16–24 range.`
        : `Age ${age} is outside the required 16–24 range.`,
      smeApplyingOk
        ? "Applying for an apprenticeship."
        : "Not applying for an apprenticeship (required).",
    ],
  }

  const grants = [youthJobsGrant, careLeaverBursary, smeIncentive]
  const totalFunding = grants
    .filter((g) => g.eligible)
    .reduce((sum, g) => sum + g.amount, 0)

  return { age, grants, totalFunding }
}
