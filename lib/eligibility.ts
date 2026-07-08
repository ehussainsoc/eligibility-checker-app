export type FormData = {
  fullName: string
  email: string
  dateOfBirth: string
  employmentStatus: string
  universalCredit: "yes" | "no" | ""
  universalCreditDuration: string
  seekingWorkDuration: string
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
  careLeaverBursary: 3000,
  smeIncentive: 2000,
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

  const ucDuration =
  data.universalCreditDuration === "6 months or more" ? 6 : 0

const seekingDuration =
  data.seekingWorkDuration === "6 months or more" ? 6 : 0

  // Youth Jobs Grant
  const yjgAgeOk = age >= 18 && age <= 24
  const yjgUcOk = data.universalCredit === "yes"
  const yjgUcDurationOk = ucDuration >= 6
  const yjgSeekingOk = seekingDuration >= 6

  const youthJobsGrant: GrantResult = {
    id: "youth-jobs-grant",
    name: "Youth Jobs Grant",
    amount: GRANT_AMOUNTS.youthJobsGrant,
    eligible: yjgAgeOk && yjgUcOk && yjgUcDurationOk && yjgSeekingOk,
    reasons: [
      yjgAgeOk
        ? `Age ${age} is within the required 18–24 range.`
        : `Age ${age} is outside the required 18–24 range.`,
      yjgUcOk
        ? "Currently receiving Universal Credit."
        : "Not currently receiving Universal Credit.",
      yjgUcDurationOk
        ? `On Universal Credit for ${ucDuration} months.`
        : `Must be on Universal Credit for at least 6 months.`,
      yjgSeekingOk
        ? `Seeking work for ${seekingDuration} months.`
        : `Must have been seeking work for at least 6 months.`,
    ],
  }

  // Care Leaver Bursary
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
        ? "Applicant is a care leaver."
        : "Applicant is not a care leaver.",
    ],
  }

  // SME Incentive
  const smeAgeOk = age >= 18 && age <= 24
  const smeApplyingOk = data.applyingForApprenticeship === "yes"

  const smeIncentive: GrantResult = {
    id: "sme-incentive",
    name: "SME Incentive",
    amount: GRANT_AMOUNTS.smeIncentive,
    eligible: smeAgeOk && smeApplyingOk,
    reasons: [
      smeAgeOk
        ? `Age ${age} is within the required 18–24 range.`
        : `Age ${age} is outside the required 18–24 range.`,
      smeApplyingOk
        ? "Applicant is applying for an apprenticeship."
        : "Applicant is not applying for an apprenticeship.",
    ],
  }

  const grants = [youthJobsGrant, careLeaverBursary, smeIncentive]

  const totalFunding = grants
    .filter((grant) => grant.eligible)
    .reduce((sum, grant) => sum + grant.amount, 0)

  return {
    age,
    grants,
    totalFunding,
  }
}