ALTER TABLE trb_advice_letter_recommendations ADD COLUMN deleted_at timestamp with time zone DEFAULT NULL;

/* Deleted items do not have an order, and have NULL position_in_letter */
ALTER TABLE trb_advice_letter_recommendations ALTER COLUMN position_in_letter DROP NOT NULL;

/* Add a constraint that forces either
 * 1) Being a deleted entity means you do not have a position_in_letter
 * 2) Being a non-deleted entity means you MUST have a position_in_letter
 */
ALTER TABLE trb_advice_letter_recommendations ADD CONSTRAINT trb_advice_letter_recommendations_order_or_deleted
	CHECK ((deleted_at IS NULL AND position_in_letter IS NOT NULL) OR (deleted_at IS NOT NULL AND position_in_letter IS NULL));
