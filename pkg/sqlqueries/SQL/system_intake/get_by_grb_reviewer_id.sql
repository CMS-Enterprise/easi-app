SELECT *
FROM system_intakes
WHERE id = (
    SELECT system_intake_id
    FROM system_intake_grb_reviewers
    WHERE id = :reviewer_id
);
