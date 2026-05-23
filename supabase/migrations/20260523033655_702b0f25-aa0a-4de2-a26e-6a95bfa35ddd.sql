
ALTER FUNCTION public.enforce_interest_receiver_update() SECURITY INVOKER;
ALTER FUNCTION public.enforce_message_receiver_update() SECURITY INVOKER;
REVOKE ALL ON FUNCTION public.enforce_interest_receiver_update() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.enforce_message_receiver_update() FROM PUBLIC, anon, authenticated;
