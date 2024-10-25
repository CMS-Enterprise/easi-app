CREATE TYPE trb_guidance_insight_category_type AS ENUM (
  'REQUIREMENT',
  'RECOMMENDATION',
  'CONSIDERATION'
  );

ALTER TABLE trb_guidance_letter_insights
  ADD COLUMN category trb_guidance_insight_category_type DEFAULT 'RECOMMENDATION';
