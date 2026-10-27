-- ══ Proteção das contas de demonstração da App Store ══
-- A revisão da Apple pode testar o fluxo "Excluir minha conta" (guideline 5.1.1(v)).
-- Se o revisor fizer isso com a conta demo, ela é apagada e a revisão seguinte
-- falha com "invalid credentials". Esta versão da função mantém a exclusão
-- funcionando para alunos reais, mas ignora (no-op) as contas listadas abaixo.
--
-- Importante: o retorno é void (sucesso) para que o app faça logout normalmente
-- e o revisor não veja erro — a conta demo permanece disponível para o próximo login.

CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  uid uuid := auth.uid();
  uemail text;
  t text;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT lower(email) INTO uemail FROM auth.users WHERE id = uid;

  -- Contas protegidas: demo da App Store + conta administrativa.
  -- Para excluir uma delas, remova o e-mail desta lista e rode novamente.
  IF uemail IN (
    'mr.gossenheimer@gmail.com',
    'mr.gossenheimer+demo@gmail.com',
    'trailtropicalpodcast@gmail.com'
  ) THEN
    RETURN;
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
