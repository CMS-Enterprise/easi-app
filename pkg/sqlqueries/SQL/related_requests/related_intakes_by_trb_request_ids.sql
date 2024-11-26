WITH searched_trb_request_ids AS (
    SELECT UNNEST(CAST(:trb_request_ids AS UUID[])) AS trb_request_id
),

related_intakes_by_system AS (
    SELECT
        stids.trb_request_id AS searched_trb_request_id,
        si_sys.system_intake_id
    FROM searched_trb_request_ids stids
    INNER JOIN trb_request_systems trb_sys
        ON stids.trb_request_id=trb_sys.trb_request_id
    INNER JOIN system_intake_systems si_sys
        ON si_sys.system_id=trb_sys.system_id
),

related_intakes_by_contract_number AS (
    SELECT
        stids.trb_request_id AS searched_trb_request_id,
        si_cn.system_intake_id
    FROM searched_trb_request_ids stids
    INNER JOIN trb_request_contract_numbers trb_cn
        ON stids.trb_request_id=trb_cn.trb_request_id
    INNER JOIN system_intake_contract_numbers si_cn
        ON si_cn.contract_number=trb_cn.contract_number
),

related_intakes AS (
    SELECT
        searched_trb_request_id,
        system_intake_id
    FROM related_intakes_by_system
    UNION
    SELECT
        searched_trb_request_id,
        system_intake_id
    FROM related_intakes_by_contract_number
)

SELECT
    related_intakes.searched_trb_request_id AS related_request_id,
    system_intakes.*
FROM system_intakes
INNER JOIN related_intakes
    ON
        related_intakes.system_intake_id=system_intakes.id
ORDER BY searched_trb_request_id, system_intakes.created_at;
