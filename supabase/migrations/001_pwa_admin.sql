-- ══ profiles — add columns FIRST ══
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS photo_url text DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- ══ exercise_logs ══
CREATE TABLE IF NOT EXISTS exercise_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id text NOT NULL,
  done_at timestamptz NOT NULL DEFAULT now(),
  session_id text NOT NULL,
  checked boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_user ON exercise_logs(user_id, done_at);
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own logs" ON exercise_logs
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "admins read all logs" ON exercise_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ══ protocol_extras ══
CREATE TABLE IF NOT EXISTS protocol_extras (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id text NOT NULL,
  session_id text NOT NULL DEFAULT '',
  added_by uuid REFERENCES auth.users(id),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_protocol_extras_user ON protocol_extras(user_id);
ALTER TABLE protocol_extras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own extras" ON protocol_extras
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admins manage extras" ON protocol_extras
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ══ student_notes ══
CREATE TABLE IF NOT EXISTS student_notes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_student_notes_user ON student_notes(user_id);
ALTER TABLE student_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage notes" ON student_notes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "users read own notes" ON student_notes
  FOR SELECT USING (auth.uid() = user_id);
