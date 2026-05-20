
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.gender_t AS ENUM ('male', 'female');
CREATE TYPE public.marital_status_t AS ENUM ('never_married', 'divorced', 'widowed', 'awaiting_divorce');
CREATE TYPE public.plan_t AS ENUM ('free', 'premium', 'elite');
CREATE TYPE public.interest_status_t AS ENUM ('pending', 'accepted', 'declined');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  full_name_telugu TEXT,
  email TEXT,
  phone TEXT,
  gender public.gender_t NOT NULL,
  date_of_birth DATE,
  height_cm INTEGER,
  marital_status public.marital_status_t DEFAULT 'never_married',
  religion TEXT DEFAULT 'Hindu',
  caste TEXT,
  sub_caste TEXT,
  gotra TEXT,
  rasi TEXT,
  nakshatra TEXT,
  nakshatra_pada SMALLINT,
  manglik BOOLEAN DEFAULT false,
  birth_time TIME,
  birth_place TEXT,
  mother_tongue TEXT DEFAULT 'Telugu',
  education TEXT,
  profession TEXT,
  annual_income TEXT,
  employed_in TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  about TEXT,
  photo_url TEXT,
  father_name TEXT,
  mother_name TEXT,
  family_type TEXT,
  family_status TEXT,
  siblings TEXT,
  partner_preferences JSONB DEFAULT '{}'::jsonb,
  verified BOOLEAN DEFAULT false,
  plan public.plan_t DEFAULT 'free',
  profile_complete BOOLEAN DEFAULT false,
  last_seen TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_gender ON public.profiles(gender);
CREATE INDEX idx_profiles_caste ON public.profiles(caste);
CREATE INDEX idx_profiles_nakshatra ON public.profiles(nakshatra);
CREATE INDEX idx_profiles_city ON public.profiles(city);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by authenticated users"
  ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "Users view own roles"
  ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ INTERESTS ============
CREATE TABLE public.interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.interest_status_t NOT NULL DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(sender_id, receiver_id),
  CHECK (sender_id <> receiver_id)
);

CREATE INDEX idx_interests_receiver ON public.interests(receiver_id, status);
CREATE INDEX idx_interests_sender ON public.interests(sender_id, status);

ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view interests involving them"
  ON public.interests FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users send interests"
  ON public.interests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Receiver updates interest status"
  ON public.interests FOR UPDATE TO authenticated
  USING (auth.uid() = receiver_id);

CREATE POLICY "Sender deletes their interest"
  ON public.interests FOR DELETE TO authenticated
  USING (auth.uid() = sender_id);

-- ============ SHORTLISTS ============
CREATE TABLE public.shortlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, profile_id)
);

ALTER TABLE public.shortlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own shortlists"
  ON public.shortlists FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add to own shortlist"
  ON public.shortlists FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own shortlist"
  ON public.shortlists FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ PROFILE VIEWS ============
CREATE TABLE public.profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_profile_views_profile ON public.profile_views(profile_id, viewed_at DESC);

ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view who saw them"
  ON public.profile_views FOR SELECT TO authenticated
  USING (auth.uid() = profile_id OR auth.uid() = viewer_id);
CREATE POLICY "Users log own views"
  ON public.profile_views FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = viewer_id);

-- ============ MESSAGES ============
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (length(content) > 0 AND length(content) <= 4000),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_pair ON public.messages(
  LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id), created_at DESC
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their messages"
  ON public.messages FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users send messages"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Receiver marks message read"
  ON public.messages FOR UPDATE TO authenticated
  USING (auth.uid() = receiver_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.interests;

-- ============ TRIGGERS ============
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER interests_updated BEFORE UPDATE ON public.interests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, gender)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'gender')::public.gender_t, 'male'::public.gender_t)
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
