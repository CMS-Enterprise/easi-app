SELECT
    si. *
FROM
    system_intakes si
    LEFT JOIN system_intake_systems sis ON sis.system_intake_id = si.id
WHERE
    sis.system_id = $1;
