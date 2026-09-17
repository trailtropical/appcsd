-- ══ RLS nas tabelas principais (profiles, checkups, sessions) ══
-- Essas tabelas foram criadas pelo dashboard e ficaram SEM RLS: qualquer portador
-- da anon key (que está no client) conseguia ler/editar dados de todos os alunos.
-- As tabelas secundárias (exercise_logs, protocol_extras, student_notes,
-- protocol_blocks) já têm RLS nas migrations 001/004/005.

-- Helper SEM recursão: SECURITY DEFINER ignora a RLS ao checar o papel do usuário.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- ── profiles ──────────────────────────────────────────────
-- Cada usuário gerencia o próprio perfil (o app faz upsert com id = auth.uid()).
DROP POLICY IF EXISTS "users manage own profile" ON public.profiles;
CREATE POLICY "users manage own profile" ON public.profiles
  FOR ALL
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admin lê todos os perfis.
DROP POLICY IF EXISTS "admins read profiles" ON public.profiles;
CREATE POLICY "admins read profiles" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ── checkups ──────────────────────────────────────────────
DROP POLICY IF EXISTS "users manage own checkups" ON public.checkups;
CREATE POLICY "users manage own checkups" ON public.checkups
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admins read checkups" ON public.checkups;
CREATE POLICY "admins read checkups" ON public.checkups
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ── sessions ──────────────────────────────────────────────
DROP POLICY IF EXISTS "users manage own sessions" ON public.sessions;
CREATE POLICY "users manage own sessions" ON public.sessions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admins read sessions" ON public.sessions;
CREATE POLICY "admins read sessions" ON public.sessions
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ── Profile automático ────────────────────────────────────
-- Garante um profile para todo usuário criado, mesmo que o upsert do client
-- falhe (ex.: confirmação de email ativa / requisição ainda anônima).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
