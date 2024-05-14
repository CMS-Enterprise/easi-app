SELECT
	(
		SELECT
			COALESCE(
				SUM(
					CASE
						WHEN trs.system_id = $1
						AND tr.state = 'OPEN' THEN 1
						ELSE 0
					END
				),
				0
			)
		FROM
			trb_request_systems trs
			LEFT JOIN trb_request tr ON trs.system_id = tr.id :: TEXT
	) AS trb_count,
	(
		SELECT
			COALESCE(
				SUM(
					CASE
						WHEN sis.system_id = $1
						AND si.state = 'OPEN' THEN 1
						ELSE 0
					END
				),
				0
			)
		FROM
			system_intake_systems sis
			LEFT JOIN system_intakes si ON sis.system_id = si.id :: TEXT
	) AS intake_count;
