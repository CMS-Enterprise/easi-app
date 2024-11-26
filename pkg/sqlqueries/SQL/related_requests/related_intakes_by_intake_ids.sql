WITH searched_intake_ids AS (
    SELECT UNNEST(CAST(:system_intake_ids AS UUID[])) AS system_intake_id
),

related_intakes_by_system AS (
    SELECT
        sids.system_intake_id AS searched_intake_id,
        sis_two.system_intake_id
    FROM searched_intake_ids sids
    INNER JOIN system_intake_systems sis_one
        ON sids.system_intake_id=sis_one.system_intake_id
    INNER JOIN system_intake_systems sis_two
        ON sis_one.system_id=sis_two.system_id
    WHERE sids.system_intake_id != sis_two.system_intake_id -- filter out original searched intake
),

related_intakes_by_contract_number AS (
    SELECT
        sids.system_intake_id AS searched_intake_id,
        sicn_two.system_intake_id
    FROM searched_intake_ids sids
    INNER JOIN system_intake_contract_numbers sicn_one
        ON sids.system_intake_id=sicn_one.system_intake_id
    INNER JOIN system_intake_contract_numbers sicn_two
        ON sicn_one.contract_number=sicn_two.contract_number
    WHERE sids.system_intake_id != sicn_two.system_intake_id -- filter out original searched intake
),

related_intakes AS (
    SELECT
        searched_intake_id,
        system_intake_id
    FROM related_intakes_by_system
    UNION
    SELECT
        searched_intake_id,
        system_intake_id
    FROM related_intakes_by_contract_number
)

SELECT
    related_intakes.searched_intake_id AS related_request_id,
    system_intakes.*
FROM system_intakes
INNER JOIN related_intakes
    ON
        related_intakes.system_intake_id=system_intakes.id
ORDER BY searched_intake_id, system_intakes.created_at;
