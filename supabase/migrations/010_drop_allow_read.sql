-- ══ Remover políticas abertas "allow read" (USING true) ══
-- Após a migration 009 (REVOKE do anon), ainda existiam políticas "allow read"
-- no papel public com USING(true) — elas permitiam qualquer usuário AUTENTICADO
-- ler os dados de todos os alunos. As políticas de dono+admin (001/008) já
-- cobrem o acesso correto, então estas são removidas.

DROP POLICY IF EXISTS "allow read" ON public.profiles;
DROP POLICY IF EXISTS "allow read" ON public.checkups;
DROP POLICY IF EXISTS "allow read" ON public.sessions;
DROP POLICY IF EXISTS "allow read" ON public.exercise_logs;
DROP POLICY IF EXISTS "allow read" ON public.protocol_extras;
DROP POLICY IF EXISTS "allow read" ON public.student_notes;