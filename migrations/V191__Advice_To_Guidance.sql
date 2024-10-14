-- table name
ALTER TABLE trb_advice_letter_recommendations
  RENAME TO trb_guidance_letter_recommendations;

-- constraints
ALTER TABLE trb_guidance_letter_recommendations
  RENAME CONSTRAINT trb_advice_letter_recommendations_created_by_check
    TO trb_guidance_letter_recommendations_created_by_check;

ALTER TABLE trb_guidance_letter_recommendations
  RENAME CONSTRAINT trb_advice_letter_recommendations_modified_by_check
    TO trb_guidance_letter_recommendations_modified_by_check;

ALTER TABLE trb_guidance_letter_recommendations
  RENAME CONSTRAINT trb_advice_letter_recommendations_order_or_deleted
    TO trb_guidance_letter_recommendations_order_or_deleted;

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

-- column
ALTER TABLE trb_admin_notes_trb_admin_note_recommendations_links
  RENAME COLUMN trb_advice_letter_recommendation_id
    TO trb_guidance_letter_recommendation_id;
