
-- 1) Prevent self-interest
DROP POLICY IF EXISTS "Users send interests" ON public.interests;
CREATE POLICY "Users send interests"
ON public.interests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id AND sender_id <> receiver_id);

-- 2) Restrict receiver updates on interests to status-only via trigger + tighter policy
CREATE OR REPLACE FUNCTION public.enforce_interest_receiver_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() = OLD.receiver_id AND auth.uid() <> OLD.sender_id THEN
    IF NEW.sender_id IS DISTINCT FROM OLD.sender_id
      OR NEW.receiver_id IS DISTINCT FROM OLD.receiver_id
      OR NEW.message IS DISTINCT FROM OLD.message
      OR NEW.created_at IS DISTINCT FROM OLD.created_at
      OR NEW.id IS DISTINCT FROM OLD.id THEN
      RAISE EXCEPTION 'Receivers can only update status';
    END IF;
    IF NEW.status NOT IN ('accepted'::interest_status_t, 'rejected'::interest_status_t, 'pending'::interest_status_t) THEN
      RAISE EXCEPTION 'Invalid status value';
    END IF;
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_interest_receiver_update_trg ON public.interests;
CREATE TRIGGER enforce_interest_receiver_update_trg
BEFORE UPDATE ON public.interests
FOR EACH ROW EXECUTE FUNCTION public.enforce_interest_receiver_update();

DROP POLICY IF EXISTS "Receiver updates interest status" ON public.interests;
CREATE POLICY "Receiver updates interest status"
ON public.interests
FOR UPDATE
TO authenticated
USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id);

-- 3) Restrict message receiver updates to read_at only
CREATE OR REPLACE FUNCTION public.enforce_message_receiver_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() = OLD.receiver_id THEN
    IF NEW.sender_id IS DISTINCT FROM OLD.sender_id
      OR NEW.receiver_id IS DISTINCT FROM OLD.receiver_id
      OR NEW.content IS DISTINCT FROM OLD.content
      OR NEW.created_at IS DISTINCT FROM OLD.created_at
      OR NEW.id IS DISTINCT FROM OLD.id THEN
      RAISE EXCEPTION 'Receivers can only update read_at';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_message_receiver_update_trg ON public.messages;
CREATE TRIGGER enforce_message_receiver_update_trg
BEFORE UPDATE ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.enforce_message_receiver_update();

DROP POLICY IF EXISTS "Receiver marks message read" ON public.messages;
CREATE POLICY "Receiver marks message read"
ON public.messages
FOR UPDATE
TO authenticated
USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id);
