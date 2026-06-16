
-- Make the view run as the querying user (no more SECURITY DEFINER view warning).
ALTER VIEW public.profiles_public SET (security_invoker = true);

-- Allow authenticated users to read completed profiles on the base table,
-- so the invoker view can return them. Sensitive columns are protected by
-- the column-level REVOKE/GRANT below.
DROP POLICY IF EXISTS "Authenticated browse complete profiles" ON public.profiles;
CREATE POLICY "Authenticated browse complete profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (profile_complete = true OR auth.uid() = id);

-- Drop the redundant owner-only SELECT policy (covered by the OR above).
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;

-- Defense in depth: revoke broad SELECT on the base table and grant only
-- safe columns to authenticated/anon. Owner-only access to sensitive columns
-- is provided via the get_my_profile() SECURITY DEFINER RPC.
REVOKE SELECT ON public.profiles FROM anon, authenticated;

GRANT SELECT (
  id, full_name, full_name_telugu, gender, date_of_birth, height_cm,
  marital_status, religion, caste, sub_caste, gotra, rasi, nakshatra,
  nakshatra_pada, manglik, mother_tongue, education, profession,
  annual_income, employed_in, city, state, country, about, photo_url,
  family_type, family_status, siblings, verified, plan, profile_complete,
  last_seen, created_at, updated_at, birth_place
) ON public.profiles TO authenticated;
