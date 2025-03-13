UPDATE
    system_intake_grb_reviewers
SET
    vote         = :vote,
    vote_comment = :vote_comment
WHERE
    id = :reviewer_id
    AND user_id = :user_id
RETURNING
    id,
    system_intake_id,
    user_id,
    voting_role,
    grb_role,
    vote,
    vote_comment,
    modified_at,
    modified_by,
    created_at,
    created_by;
