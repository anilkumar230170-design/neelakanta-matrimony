DROP POLICY IF EXISTS "Users send messages" ON public.messages;

CREATE POLICY "Users send messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = sender_id
  AND public.has_accepted_interest(auth.uid(), receiver_id)
);