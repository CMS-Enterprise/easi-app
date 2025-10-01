UPDATE system_intakes si
SET decided_at = x.latest_date
FROM (SELECT DISTINCT ON (intake_id)
    intake_id,
    created_at AS latest_date
FROM actions
WHERE action_type IN ('NOT_GOVERNANCE', 'ISSUE_LCID', 'REJECT', 'CLOSE_REQUEST')
ORDER BY intake_id, created_at DESC) x
WHERE si.id = x.intake_id
