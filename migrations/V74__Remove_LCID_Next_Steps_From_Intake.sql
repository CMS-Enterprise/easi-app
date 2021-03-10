UPDATE system_intakes
    SET decision_next_steps = lcid_next_steps
    WHERE lcid_next_steps IS NOT NULL and decision_next_steps IS NULL;
ALTER TABLE system_intakes DROP COLUMN lcid_next_steps;
