SELECT DISTINCT si.*
FROM system_intakes si
JOIN system_intake_contacts sic
    ON sic.system_intake_id = si.id
WHERE
    sic.user_id = :user_id
    AND sic.is_requester = TRUE
ORDER BY si.created_at DESC;
