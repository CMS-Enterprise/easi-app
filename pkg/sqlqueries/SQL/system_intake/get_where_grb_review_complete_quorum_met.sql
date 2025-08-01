SELECT *
FROM system_intakes si
WHERE (
    SELECT COUNT(id)
    FROM system_intake_grb_reviewers sigr
    WHERE
        sigr.system_intake_id = si.id
        AND sigr.voting_role = 'VOTING'
        AND sigr.vote IS NOT NULL
) >= 5 -- 5 is the required number of votes for quorum
AND si.grb_review_type = 'ASYNC'
AND si.grb_review_started_at IS NOT NULL
AND si.grb_review_async_end_date IS NOT NULL
AND si.archived_at IS NULL
AND si.grb_review_async_end_date BETWEEN (NOW() - INTERVAL '1 DAY') AND NOW()
ORDER BY si.created_at DESC;
