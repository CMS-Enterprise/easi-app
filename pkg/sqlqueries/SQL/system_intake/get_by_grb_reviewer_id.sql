SELECT si.*
FROM system_intake_grb_reviewers sigr
JOIN system_intakes si ON si.id = sigr.system_intake_id
WHERE
    sigr.id = :grb_reviewer_id
    AND si.archived_at IS NULL;
