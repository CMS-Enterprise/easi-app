-- can I do all these in one statement?

ALTER TABLE trb_advice_letter_recommendations
ADD COLUMN position_in_letter INTEGER;

-- TODO - add FK to advice letter table (how to populate for existing rows?)

-- use FK to advice letter table if I add it, FK to trb_request table if not 
-- ALTER TABLE trb_advice_letter_recommendations
-- ADD CONSTRAINT unique_position_per_letter UNIQUE (trb_advice_letter_id, position_in_letter);
