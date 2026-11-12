-- ══ Bloquear escrita do aluno na tabela profiles ══
-- Motivo: a política "users manage own profile" (FOR ALL) deixava o aluno
-- logado alterar QUALQUER coluna do próprio perfil pela API pública, inclusive:
--   • role            → virar 'admin' e ler os dados de todos os alunos (is_admin)
--   • access_blocked  → desfazer o próprio bloqueio por reembolso
--   • password_set    → reabrir o "primeiro acesso" da conta
--   • nome/photo_url  → injetar HTML/JS que roda no painel admin
--
-- O app (index.html) e o painel (admin.html) NUNCA escrevem em profiles pelo
-- navegador: só leem. Quem escreve são as Edge Functions (service role),
-- o trigger handle_new_user e delete_my_account (SECURITY DEFINER).
-- Portanto o papel `authenticated` não precisa de escrita nenhuma aqui.

-- ── 1) Tirar o privilégio de escrita (vale para todas as colunas) ─────────
REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM anon;

-- ── 2) Trocar a política FOR ALL por uma só de leitura ──────────────────
DROP POLICY IF EXISTS "users manage own profile" ON public.profiles;
DROP POLICY IF EXISTS "users read own profile" ON public.profiles;
CREATE POLICY "users read own profile" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());
-- "admins read profiles" (migration 008) continua valendo.

-- ── 3) Conferências (rode depois e confira os resultados) ───────────────

-- 3a) Deve retornar 0 linhas: nenhuma escrita para authenticated/anon.
SELECT grantee, privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public' AND table_name = 'profiles'
  AND grantee IN ('authenticated', 'anon')
  AND privilege_type IN ('INSERT', 'UPDATE', 'DELETE');

-- 3b) Quem é admin hoje? Deve aparecer SÓ trailtropicalpodcast@gmail.com.
--     Se aparecer outro e-mail, alguém pode ter se promovido: avise antes de mexer.
SELECT id, email, role FROM public.profiles WHERE role = 'admin';
