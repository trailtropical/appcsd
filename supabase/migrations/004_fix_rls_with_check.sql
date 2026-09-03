-- ✅ Fix RLS: policies FOR ALL precisam de WITH CHECK para permitir INSERT
-- (sem WITH CHECK, o INSERT é negado com "new row violates row-level security policy")

-- protocol_extras: garante que admin pode inserir
DROP POLICY IF EXISTS "admins manage extras" ON protocol_extras;
CREATE POLICY "admins manage extras" ON protocol_extras
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- student_notes: mesma correção (Enviar observação)
DROP POLICY IF EXISTS "admins manage notes" ON student_notes;
CREATE POLICY "admins manage notes" ON student_notes
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
