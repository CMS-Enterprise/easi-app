CREATE TYPE trb_guidance_recommendation_category_type AS ENUM (
  'REQUIREMENT',
  'RECOMMENDATION',
  'CONSIDERATION'
  );

ALTER TABLE trb_guidance_letter_recommendations
  ADD COLUMN category trb_guidance_recommendation_category_type DEFAULT 'RECOMMENDATION';
