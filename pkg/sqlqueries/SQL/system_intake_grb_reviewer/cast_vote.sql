UPDATE
    system_intake_grb_reviewers
SET
    vote         = :vote,
    vote_comment = :vote_comment,
    date_voted   = NOW(),
    modified_at  = NOW(),
    modified_by  = :user_id
WHERE
    system_intake_id = :system_intake_id
    AND user_id = :user_id
RETURNING
    id,
    system_intake_id,
    user_id,
    voting_role,
    grb_role,
    vote,
    vote_comment,
    date_voted,
    modified_at,
    modified_by,
    created_at,
    created_by;
