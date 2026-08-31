-- ══ sessions — persist per-signal progression tiers + previous signal counts ══
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS signal_tiers jsonb DEFAULT '{}'::jsonb;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS prev_signals jsonb DEFAULT '{}'::jsonb;
