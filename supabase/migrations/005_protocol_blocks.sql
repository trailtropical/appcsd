-- ══ protocol_blocks : Fase 2 — bloqueio de exercício do aluno (filtro aplicado no app) ══
CREATE TABLE IF NOT EXISTS protocol_blocks (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id text NOT NULL,
  added_by uuid REFERENCES auth.users(id),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_protocol_blocks_user ON protocol_blocks(user_id);
ALTER TABLE protocol_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own blocks" ON protocol_blocks
  FOR SELECT USING (auth.uid() = user_id);
-- admin: ler/gerenciar (WITH CHECK libera o INSERT; sem ele o INSERT seria negado)
CREATE POLICY "admins manage blocks" ON protocol_blocks
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );