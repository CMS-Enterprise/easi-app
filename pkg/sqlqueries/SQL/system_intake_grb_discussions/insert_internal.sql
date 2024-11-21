INSERT INTO system_intake_internal_grb_review_discussion_posts (
  id,
  content,
  voting_role,
  grb_role,
  system_intake_id,
  reply_to_id,
  created_by,
  created_at,
  modified_by,
  modified_at
) VALUES (
  :id,
  :content,
  :voting_role,
  :grb_role,
  :system_intake_id,
  :reply_to_id,
  :created_by,
  :created_at,
  :modified_by,
  :modified_at
)
RETURNING
id,
content,
voting_role,
grb_role,
system_intake_id,
reply_to_id,
created_by,
created_at,
modified_by,
modified_at;
