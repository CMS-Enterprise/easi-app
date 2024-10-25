-- table name
ALTER TABLE trb_advice_letter_recommendations
  RENAME TO trb_guidance_letter_insights;

-- constraints
ALTER TABLE trb_guidance_letter_insights
  RENAME CONSTRAINT trb_advice_letter_recommendations_created_by_check
    TO trb_guidance_letter_insights_created_by_check;

ALTER TABLE trb_guidance_letter_insights
  RENAME CONSTRAINT trb_advice_letter_recommendations_modified_by_check
    TO trb_guidance_letter_insights_modified_by_check;

ALTER TABLE trb_guidance_letter_insights
  RENAME CONSTRAINT trb_advice_letter_recommendations_order_or_deleted
    TO trb_guidance_letter_insights_order_or_deleted;

ALTER TABLE trb_guidance_letter_insights
  RENAME COLUMN recommendation TO insight;

-- table name
ALTER TABLE trb_advice_letters
  RENAME TO trb_guidance_letters;

-- constraints
ALTER TABLE trb_guidance_letters
  RENAME CONSTRAINT trb_advice_letters_created_by_check
    TO trb_guidance_letters_created_by_check;

ALTER TABLE trb_guidance_letters
  RENAME CONSTRAINT trb_advice_letters_modified_by_check
    TO trb_guidance_letters_modified_by_check;

ALTER TABLE trb_guidance_letters
  RENAME CONSTRAINT trb_request_trb_advice_letter_one_to_one
    TO trb_request_trb_guidance_letter_one_to_one;

-- enum rename
ALTER TYPE trb_advice_letter_status
  RENAME TO trb_guidance_letter_status;

-- enum type rename
ALTER TYPE trb_admin_note_category
  RENAME VALUE 'ADVICE_LETTER' TO 'GUIDANCE_LETTER';

-- table name
ALTER TABLE trb_admin_notes_trb_admin_note_recommendations_links
  RENAME TO trb_admin_notes_trb_admin_note_insights_links;

-- column
ALTER TABLE trb_admin_notes_trb_admin_note_insights_links
  RENAME COLUMN trb_advice_letter_recommendation_id
    TO trb_guidance_letter_insight_id;
