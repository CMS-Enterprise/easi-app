SELECT *
FROM system_intakes si
WHERE (
    SELECT COUNT(id)
    FROM system_intake_grb_reviewers sigr
    WHERE
        sigr.id = si.id
        AND sigr.voting_role = 'VOTING'
        AND sigr.vote IS NOT NULL
) >= 5
AND si.grb_review_type = 'ASYNC'
AND si.grb_review_started_at IS NOT NULL
AND si.grb_review_async_end_date IS NOT NULL
AND si.archived_at IS NULL
AND si.grb_review_async_end_date BETWEEN NOW() AND (NOW() - INTERVAL '1 DAY')
ORDER BY si.created_at DESC;
