SELECT *
FROM system_intakes
WHERE id IN (
    SELECT system_intake_id
    FROM system_intake_grb_reviewers
    WHERE user_id=:user_id
) AND state = 'OPEN';
