import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Avoid throwing at module load (which would crash the whole app) when the
// env vars are not set yet. Components should check `isSupabaseConfigured`.
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null

// Shape of a row in the `applicants` table.
export type ApplicantRow = {
  id: string
  created_at: string
  full_name: string
  email: string
  date_of_birth: string
  age: number
  employment_status: string
  universal_credit: boolean
  universal_credit_duration: number
  seeking_work_duration: number
  care_leaver: boolean
  applying_for_apprenticeship: boolean
  youth_jobs_grant: boolean
  care_leaver_bursary: boolean
  sme_incentive: boolean
  total_funding: number
  reasons: Record<string, string[]>
  status: string
}
