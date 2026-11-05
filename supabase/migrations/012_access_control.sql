-- ══ Controle de acesso: compras, primeiro acesso e bloqueio ══
-- Objetivo: só quem comprou na Hotmart pode ativar a conta no app.
-- O webhook grava a compra e cria o usuário; o app só libera a criação de
-- senha para e-mails com compra aprovada e ainda sem senha.

-- ── Compras ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text DEFAULT '',
  product text DEFAULT '',
  transaction_id text NOT NULL,
  status text NOT NULL DEFAULT 'approved',
  purchased_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_transaction
  ON public.purchases (transaction_id);
CREATE INDEX IF NOT EXISTS idx_purchases_email
  ON public.purchases (lower(email));
CREATE INDEX IF NOT EXISTS idx_purchases_status
  ON public.purchases (status);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Só o admin lê as compras. O app nunca acessa esta tabela diretamente;
-- a validação do primeiro acesso é feita pela Edge Function "first-access".
DROP POLICY IF EXISTS "admins read purchases" ON public.purchases;
CREATE POLICY "admins read purchases" ON public.purchases
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ── Flags no perfil ───────────────────────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_set boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS access_blocked boolean NOT NULL DEFAULT false;

-- Padroniza o e-mail do perfil em minúsculas (o webhook e o app comparam assim).
UPDATE public.profiles
SET email = lower(email)
WHERE email IS NOT NULL AND email <> lower(email);

-- Contas que já existem e já têm senha não devem passar pelo primeiro acesso.
UPDATE public.profiles p
SET password_set = true
FROM auth.users u
WHERE u.id = p.id
  AND coalesce(u.encrypted_password, '') <> ''
  AND p.password_set = false;

-- ── Tentativas (limite de requisições) ────────────────────
CREATE TABLE IF NOT EXISTS public.access_attempts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL,
  ip text DEFAULT '',
  action text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_access_attempts_email
  ON public.access_attempts (lower(email), created_at DESC);

ALTER TABLE public.access_attempts ENABLE ROW LEVEL SECURITY;
-- Sem policies: apenas a service role (Edge Function) acessa.

-- ── Consulta de compra aprovada (usada pela Edge Function) ─
CREATE OR REPLACE FUNCTION public.has_approved_purchase(p_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.purchases
    WHERE lower(email) = lower(p_email)
      AND status = 'approved'
  );
$$;

REVOKE ALL ON FUNCTION public.has_approved_purchase(text) FROM PUBLIC, anon, authenticated;
