-- add unique constraints on these tables so they can be referenced by the link tables for category-specific admin notes
-- the foreign keys in the link tables with code like `REFERENCES trb_admin_notes(id, trb_request_id)` won't work unless there's a unique constraint on the referenced columns

-- the new constraints won't exclude anything new; since the "id" column on all tables is the PK, it's unique by itself, so all the (id, trb_request_id) will be unique as well.
ALTER TABLE trb_admin_notes ADD UNIQUE (id, trb_request_id);
ALTER TABLE trb_advice_letter_recommendations ADD UNIQUE (id, trb_request_id);
ALTER TABLE trb_request_documents ADD UNIQUE (id, trb_request_id);
