-- can I do all these in one statement?

ALTER TABLE trb_advice_letter_recommendations
ADD COLUMN order_in_letter INTEGER;

-- TODO - add FK to advice letter table (how to populate for existing rows?)

-- needs FK to advice letter table 
-- ALTER TABLE trb_advice_letter_recommendations
-- ADD CONSTRAINT unique_ordering_per_letter UNIQUE (trb_advice_letter_id, order_in_letter);
