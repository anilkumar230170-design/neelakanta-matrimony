
-- Remove the security-definer view flagged by linter
DROP VIEW IF EXISTS public.public_profiles;

-- Allow authenticated users to browse completed profiles (rows), with column-level restrictions below
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Authenticated browse complete profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (profile_complete = true OR auth.uid() = id);

-- Column-level restriction: hide sensitive columns from the authenticated role
REVOKE SELECT ON public.profiles FROM authenticated;
GRANT SELECT (
  id, full_name, full_name_telugu, gender, date_of_birth, height_cm,
  marital_status, religion, caste, sub_caste, gotra, rasi, nakshatra,
  nakshatra_pada, manglik, mother_tongue, education, profession,
  annual_income, employed_in, city, state, country, about, photo_url,
  family_type, family_status, siblings, verified, plan, profile_complete,
  last_seen, created_at, updated_at, birth_place
) ON public.profiles TO authenticated;

-- Keep INSERT/UPDATE intact for owner
GRANT INSERT, UPDATE ON public.profiles TO authenticated;

-- Secure accessor for own full profile (includes sensitive columns)
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS public.profiles
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.profiles WHERE id = auth.uid();
$$;

REVOKE EXECUTE ON FUNCTION public.get_my_profile() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_profile() TO authenticated;
