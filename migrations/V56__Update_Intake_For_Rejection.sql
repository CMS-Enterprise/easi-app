ALTER TABLE system_intake ADD COLUMN rejection_reason text;
ALTER TABLE system_intake ADD COLUMN decision_next_steps text;
UPDATE system_intake
    SET decision_next_steps = lcid_next_steps
    WHERE lcid_next_steps IS NOT NULL;
