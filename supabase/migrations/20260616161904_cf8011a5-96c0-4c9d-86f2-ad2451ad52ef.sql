
-- 1. Tighten base profiles SELECT policy to owner-only.
DROP POLICY IF EXISTS "Authenticated browse complete profiles" ON public.profiles;

CREATE POLICY "Users read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 2. Create a safe public view that excludes sensitive columns.
-- Uses default (security definer) view semantics so RLS on the base table
-- does not block other authenticated users from browsing safe fields.
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public AS
SELECT
  id,
  full_name,
  full_name_telugu,
  gender,
  date_of_birth,
  height_cm,
  marital_status,
  religion,
  caste,
  sub_caste,
  gotra,
  rasi,
  nakshatra,
  nakshatra_pada,
  manglik,
  mother_tongue,
  education,
  profession,
  annual_income,
  employed_in,
  city,
  state,
  country,
  about,
  photo_url,
  family_type,
  family_status,
  siblings,
  verified,
  plan,
  profile_complete,
  last_seen,
  created_at,
  updated_at,
  birth_place
FROM public.profiles
WHERE profile_complete = true;

ALTER VIEW public.profiles_public SET (security_invoker = false);

REVOKE ALL ON public.profiles_public FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.profiles_public TO anon, authenticated;
GRANT ALL ON public.profiles_public TO service_role;
