WITH searched_intake_ids AS (
	SELECT UNNEST(CAST(:system_intake_ids AS UUID[])) AS system_intake_id
),
related_trb_requests_by_system AS (
  SELECT
		sids.system_intake_id AS searched_intake_id,
 		trb_sys.trb_request_id
	FROM searched_intake_ids sids
	INNER JOIN system_intake_systems si_sys
	ON sids.system_intake_id=si_sys.system_intake_id
	INNER JOIN trb_request_systems trb_sys
	ON si_sys.system_id=trb_sys.system_id
),
related_trb_requests_by_contract_number AS (
  SELECT
		sids.system_intake_id AS searched_intake_id,
		trb_cn.trb_request_id
	FROM searched_intake_ids sids
	INNER JOIN system_intake_contract_numbers si_cn
	ON sids.system_intake_id=si_cn.system_intake_id
	INNER JOIN trb_request_contract_numbers trb_cn
	ON si_cn.contract_number=trb_cn.contract_number
),
related_trb_requests AS (
	SELECT
		searched_intake_id,
		trb_request_id
	FROM related_trb_requests_by_system
	UNION
	SELECT
		searched_intake_id,
		trb_request_id
	FROM related_trb_requests_by_contract_number
)
SELECT
	related_trb_requests.searched_intake_id AS related_request_id,
	trb_request.*
FROM trb_request
INNER JOIN related_trb_requests
ON
	related_trb_requests.trb_request_id=trb_request.id
ORDER BY searched_intake_id, trb_request.created_at;
