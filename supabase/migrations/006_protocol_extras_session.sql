-- ══ protocol_extras : associar o extra a um treino específico (0=A,1=B,2=C) ══
-- Extra passa a valer apenas para o treino onde foi adicionado (ex.: Treino A só no A).
ALTER TABLE protocol_extras ADD COLUMN IF NOT EXISTS session_idx integer;
-- Antigos sem session_idx: trata como Treino A (comportamento anterior de 'todos').
UPDATE protocol_extras SET session_idx = 0 WHERE session_idx IS NULL;