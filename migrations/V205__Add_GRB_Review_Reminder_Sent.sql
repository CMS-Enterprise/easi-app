ALTER TABLE IF EXISTS system_intakes
ADD COLUMN grb_review_reminder_last_sent TIMESTAMP WITH TIME ZONE DEFAULT NULL;
