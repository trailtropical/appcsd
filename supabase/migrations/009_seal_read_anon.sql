-- ══ Fechar leitura ANAW/anon de TODAS as tabelas de dados de alunos ══
-- Motivo: auditoria encontrou que o papel `anon` (chave pública do client)
-- conseguia LER todos os perfis/checkups/sessions/logs sem login nenhum.
-- Escritas já estão bloqueadas pelo RLS; corrigimos a leitura.
--
-- Estratégia em 2 camadas para não depender do nome exato de políticas antigas:
--  1) REVOKE SELECT do papel `anon` → aniquila QUALQUER política aberta, mesmo
--     sem saber o nome dela (política sem privilégio = sem acesso).
--  2) DROP das políticas padrão do dashboard ("Enable read access for all users"),
--     que costumam liberar `true` para todos os papéis.
-- As políticas de "dono + admin" (migrations 001/008) continuam valendo para
-- o papel `authenticated` e o admin continua lendo tudo via is_admin().

-- ── 1) Revogar privilégio de leitura do papel anon ─────────────────────────
REVOKE SELECT ON public.profiles        FROM anon;
REVOKE SELECT ON public.checkups        FROM anon;
REVOKE SELECT ON public.sessions        FROM anon;
REVOKE SELECT ON public.exercise_logs   FROM anon;
REVOKE SELECT ON public.protocol_extras FROM anon;
REVOKE SELECT ON public.protocol_blocks FROM anon;
REVOKE SELECT ON public.student_notes   FROM anon;

-- Reforço: anon não pode escrever em nada.
REVOKE INSERT, UPDATE, DELETE ON public.profiles        FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.checkups        FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.sessions        FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.exercise_logs   FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.protocol_extras FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.protocol_blocks FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.student_notes   FROM anon;

-- ── 2) Derrubar políticas abertas típicas do dashboard (se existirem) ───────
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.checkups;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.sessions;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.exercise_logs;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.protocol_extras;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.protocol_blocks;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.student_notes;

-- ── 3) Auditoria pós-correção (rode e confira que retorna 0) ────────────────
-- das políticas ainda existentes que liberem leitura ao papel anon/public:
SELECT policyname, tablename, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
  AND cmd = 'SELECT'
  AND (roles && ARRAY['anon', 'public']);