export type FormData = {
  fullName: string
  email: string
  dateOfBirth: string
  employmentStatus: string
  universalCredit: "yes" | "no" | ""
  universalCreditDuration: string // months
  seekingWorkDuration: string // months
  careLeaver: "yes" | "no" | ""
  applyingForApprenticeship: "yes" | "no" | ""
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
  const ucDuration = Number.parseInt(data.universalCreditDuration || "0", 10)
  const seekingDuration = Number.parseInt(data.seekingWorkDuration || "0", 10)

  // Youth Jobs Grant
  const yjgReasons: string[] = []
  const yjgAgeOk = age >= 18 && age <= 24
  const yjgUcOk = data.universalCredit === "yes"
  const yjgUcDurationOk = ucDuration >= 6
  const yjgSeekingOk = seekingDuration >= 6
  yjgReasons.push(
    yjgAgeOk
      ? `Age ${age} is within the required 18–24 range.`
      : `Age ${age} is outside the required 18–24 range.`,
  )
  yjgReasons.push(
    yjgUcOk
      ? "Currently receiving Universal Credit."
      : "Not currently receiving Universal Credit.",
  )
  yjgReasons.push(
    yjgUcDurationOk
      ? `On Universal Credit for ${ucDuration} months (6+ required).`
      : `On Universal Credit for ${ucDuration} months (6+ required).`,
  )
  yjgReasons.push(
    yjgSeekingOk
      ? `Seeking work for ${seekingDuration} months (6+ required).`
      : `Seeking work for ${seekingDuration} months (6+ required).`,
  )
  const youthJobsGrant: GrantResult = {
    id: "youth-jobs-grant",
    name: "Youth Jobs Grant",
    amount: GRANT_AMOUNTS.youthJobsGrant,
    eligible: yjgAgeOk && yjgUcOk && yjgUcDurationOk && yjgSeekingOk,
    reasons: yjgReasons,
  }

  // Care Leaver Bursary
  const clbReasons: string[] = []
  const clbAgeOk = age >= 16 && age <= 24
  const clbCareOk = data.careLeaver === "yes"
  clbReasons.push(
    clbAgeOk
      ? `Age ${age} is within the required 16–24 range.`
      : `Age ${age} is outside the required 16–24 range.`,
  )
  clbReasons.push(
    clbCareOk ? "Identified as a care leaver." : "Not identified as a care leaver.",
  )
  const careLeaverBursary: GrantResult = {
    id: "care-leaver-bursary",
    name: "Care Leaver Bursary",
    amount: GRANT_AMOUNTS.careLeaverBursary,
    eligible: clbAgeOk && clbCareOk,
    reasons: clbReasons,
  }

  // SME Incentive
  const smeReasons: string[] = []
  const smeAgeOk = age >= 16 && age <= 24
  const smeApplyingOk = data.applyingForApprenticeship === "yes"
  smeReasons.push(
    smeAgeOk
      ? `Age ${age} is within the required 16–24 range.`
      : `Age ${age} is outside the required 16–24 range.`,
  )
  smeReasons.push(
    smeApplyingOk
      ? "Applying for an apprenticeship."
      : "Not applying for an apprenticeship.",
  )
  const smeIncentive: GrantResult = {
    id: "sme-incentive",
    name: "SME Incentive",
    amount: GRANT_AMOUNTS.smeIncentive,
    eligible: smeAgeOk && smeApplyingOk,
    reasons: smeReasons,
  }

  const grants = [youthJobsGrant, careLeaverBursary, smeIncentive]
  const totalFunding = grants
    .filter((g) => g.eligible)
    .reduce((sum, g) => sum + g.amount, 0)

  return { age, grants, totalFunding }
}
