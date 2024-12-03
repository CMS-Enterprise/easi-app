UPDATE
    system_intake_grb_reviewers
SET
    voting_role=:voting_role,
    grb_role=:grb_role,
    modified_at=CURRENT_TIMESTAMP,
    modified_by=:modified_by
WHERE id=:reviewer_id
RETURNING
    id,
    system_intake_id,
    user_id,
    voting_role,
    grb_role,
    modified_at,
    modified_by,
    created_at,
    created_by;
