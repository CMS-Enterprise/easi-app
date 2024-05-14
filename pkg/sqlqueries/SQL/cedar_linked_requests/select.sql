SELECT
	(SELECT SUM(CASE WHEN trs.system_id = $1 THEN 1 ELSE 0 END) FROM trb_request_systems trs) AS trb_count,
	(SELECT SUM(CASE WHEN sis.system_id = $1 THEN 1 ELSE 0 END) FROM system_intake_systems sis) AS intake_count;
