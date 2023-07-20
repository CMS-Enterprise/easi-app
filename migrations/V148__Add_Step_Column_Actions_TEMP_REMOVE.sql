-- temporary; remove this whole migration once EASI-2888 is merged
ALTER TABLE actions ADD COLUMN step system_intake_step;
