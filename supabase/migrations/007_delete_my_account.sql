-- ══ Exclusão de conta pelo próprio usuário (App Store 5.1.1(v)) ══
-- Remove todos os dados do usuário autenticado e, por fim, a conta em auth.users.
-- SECURITY DEFINER: roda com privilégios do dono (postgres), que pode apagar de auth.users.
CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  uid uuid := auth.uid();
  t text;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  FOREACH t IN ARRAY ARRAY[
    'exercise_logs',
    'student_notes',
    'protocol_extras',
    'protocol_blocks',
    'checkups',
    'sessions'
  ]
  LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('DELETE FROM public.%I WHERE user_id = $1', t) USING uid;
    END IF;
  END LOOP;

  IF to_regclass('public.profiles') IS NOT NULL THEN
    DELETE FROM public.profiles WHERE id = uid;
  END IF;

  DELETE FROM auth.users WHERE id = uid;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_my_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;
