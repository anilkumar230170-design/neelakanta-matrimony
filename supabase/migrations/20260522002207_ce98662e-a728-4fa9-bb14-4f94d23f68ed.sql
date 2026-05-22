-- Private bucket for member photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Helper: do two users share an accepted interest (either direction)?
CREATE OR REPLACE FUNCTION public.has_accepted_interest(_a uuid, _b uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.interests
    WHERE status = 'accepted'
      AND ((sender_id = _a AND receiver_id = _b)
        OR (sender_id = _b AND receiver_id = _a))
  );
$$;

-- Owner can manage own files (folder = user id)
CREATE POLICY "Owner manages own photos"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'profile-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'profile-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Other authenticated users can read a photo only if there is an accepted interest
CREATE POLICY "View photo when interest accepted"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'profile-photos'
  AND public.has_accepted_interest(auth.uid(), ((storage.foldername(name))[1])::uuid)
);