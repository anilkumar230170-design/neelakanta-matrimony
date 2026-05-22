REVOKE EXECUTE ON FUNCTION public.has_accepted_interest(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_accepted_interest(uuid, uuid) TO authenticated;