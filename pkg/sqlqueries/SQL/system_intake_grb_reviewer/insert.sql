INSERT INTO system_intake_grb_reviewers (
  id,
  user_id,
  system_intake_id,
  voting_role,
  grb_role,
  created_by,
  created_at,
  modified_by,
  modified_at
) VALUES (
  :id,
  :user_id,
  :system_intake_id,
  :voting_role,
  :grb_role,
  :created_by,
  :created_at,
  :modified_by,
  :modified_at
);
