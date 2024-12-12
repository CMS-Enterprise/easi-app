WITH searched_trb_request_ids AS (
    SELECT UNNEST(CAST(:trb_request_ids AS UUID[])) AS trb_request_id
),

related_trb_requests_by_system AS (
    SELECT
        stids.trb_request_id AS searched_trb_request_id,
        trb_sys_two.trb_request_id
    FROM searched_trb_request_ids stids
    INNER JOIN trb_request_systems trb_sys_one
        ON stids.trb_request_id=trb_sys_one.trb_request_id
    INNER JOIN trb_request_systems trb_sys_two
        ON trb_sys_one.system_id=trb_sys_two.system_id
    WHERE stids.trb_request_id != trb_sys_two.trb_request_id -- filter out original searched TRB Request
),

related_trb_requests_by_contract_number AS (
    SELECT
        stids.trb_request_id AS searched_trb_request_id,
        trb_cn_two.trb_request_id
    FROM searched_trb_request_ids stids
    INNER JOIN trb_request_contract_numbers trb_cn_one
        ON stids.trb_request_id=trb_cn_one.trb_request_id
    INNER JOIN trb_request_contract_numbers trb_cn_two
        ON trb_cn_one.contract_number=trb_cn_two.contract_number
    WHERE stids.trb_request_id != trb_cn_two.trb_request_id -- filter out original searched TRB Request
),

related_trb_requests AS (
    SELECT
        searched_trb_request_id,
        trb_request_id
    FROM related_trb_requests_by_system
    UNION
    SELECT
        searched_trb_request_id,
        trb_request_id
    FROM related_trb_requests_by_contract_number
)

SELECT
    related_trb_requests.searched_trb_request_id AS related_request_id,
    trb_request.*
FROM trb_request
INNER JOIN related_trb_requests
    ON
        related_trb_requests.trb_request_id=trb_request.id
ORDER BY searched_trb_request_id, trb_request.created_at;
