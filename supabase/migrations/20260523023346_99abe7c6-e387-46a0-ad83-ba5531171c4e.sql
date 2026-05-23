
-- 1) Replace permissive profiles SELECT policy with owner-only access
DROP POLICY IF EXISTS "Profiles viewable by authenticated users" ON public.profiles;

CREATE POLICY "Users view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 2) Public-safe view exposing only non-sensitive columns for browsing
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = false) AS
SELECT
  id, full_name, full_name_telugu, gender, date_of_birth, height_cm,
  marital_status, religion, caste, sub_caste, gotra, rasi, nakshatra,
  nakshatra_pada, manglik, mother_tongue, education, profession,
  annual_income, employed_in, city, state, country, about, photo_url,
  family_type, family_status, siblings, verified, plan, profile_complete,
  last_seen, created_at, updated_at, birth_place
FROM public.profiles
WHERE profile_complete = true;

REVOKE ALL ON public.public_profiles FROM PUBLIC, anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- 3) Lock down SECURITY DEFINER helper functions from direct API execution
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_accepted_interest(uuid, uuid) FROM PUBLIC, anon, authenticated;
