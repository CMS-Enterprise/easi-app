CREATE TYPE trb_guidance_recommendation_category_type AS ENUM (
  'REQUIREMENT',
  'RECOMMENDATION',
  'CONSIDERATION',
  'UNCATEGORIZED'
  );

ALTER TABLE trb_guidance_letter_recommendations
  ADD COLUMN category trb_guidance_recommendation_category_type;

UPDATE trb_guidance_letter_recommendations
SET category = 'UNCATEGORIZED';

ALTER TABLE trb_guidance_letter_recommendations
  ALTER COLUMN category SET NOT NULL;
