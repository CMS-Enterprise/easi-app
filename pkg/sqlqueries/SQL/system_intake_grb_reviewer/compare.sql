WITH current_reviewers AS (
  SELECT * FROM system_intake_grb_reviewers WHERE system_intake_id=:system_intake_id
)

SELECT
	grb.id,
  grb.user_id,
	grb.grb_role,
	grb.voting_role,
	si.project_name,
  si.created_at AS intake_created_at,
	grb.system_intake_id,
	ua.username,
	ua.common_name,
  ua.family_name,
  ua.email,
  ua.locale,
  ua.given_name,
  ua.has_logged_in,
	(
		SELECT EXISTS(
			SELECT 1 FROM current_reviewers cr WHERE grb.user_id=cr.user_id
		)
	) as is_current_reviewer
FROM system_intake_grb_reviewers grb
LEFT JOIN system_intakes si ON si.id=grb.system_intake_id
LEFT JOIN user_account ua ON grb.user_id=ua.id
WHERE grb.system_intake_id!=:system_intake_id
ORDER BY si.created_at DESC;
