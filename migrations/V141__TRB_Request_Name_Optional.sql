ALTER TABLE trb_request ALTER COLUMN name DROP NOT NULL;

UPDATE trb_request SET name = NULL WHERE name = 'Draft';
