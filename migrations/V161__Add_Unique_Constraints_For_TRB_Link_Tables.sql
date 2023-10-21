-- add unique constraints on these tables so they can be referenced by the link tables for category-specific admin notes
-- the new constraints won't exclude anything new, since the "id" column on all tables is the PK, it has a unique constraint already
ALTER TABLE trb_admin_notes ADD UNIQUE (id, trb_request_id);
ALTER TABLE trb_advice_letter_recommendations ADD UNIQUE (id, trb_request_id);
ALTER TABLE trb_request_documents ADD UNIQUE (id, trb_request_id);
