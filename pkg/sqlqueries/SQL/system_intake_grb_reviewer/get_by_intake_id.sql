SELECT
  id,
  user_id,
  voting_role,
  grb_role,
  system_intake_id,
  modified_at,
  modified_by,
  created_at,
  created_by
FROM system_intake_grb_reviewers
WHERE system_intake_id = ANY(:system_intake_ids);
