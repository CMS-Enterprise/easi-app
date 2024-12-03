SELECT si.*, sis.system_id
FROM system_intakes si
LEFT JOIN system_intake_systems sis ON sis.system_intake_id = si.id
WHERE
    (sis.system_id, si.state) = ANY(SELECT UNNEST(CAST(:cedar_system_ids AS TEXT[])), UNNEST(CAST(:states AS SYSTEM_INTAKE_STATE[])));
