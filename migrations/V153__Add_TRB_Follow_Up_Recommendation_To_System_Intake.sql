CREATE TYPE system_intake_trb_follow_up AS ENUM (
    'STRONGLY_RECOMMENDED',
    'RECOMMENDED_BUT_NOT_CRITICAL',
    'NOT_RECOMMENDED'
);

ALTER TABLE system_intakes
ADD COLUMN trb_follow_up_recommendation system_intake_trb_follow_up;
