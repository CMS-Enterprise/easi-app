SELECT
	(
		SELECT
			tr. *
		FROM
			trb_request tr
			LEFT JOIN trb_request_systems trs ON trs.trb_request_id = tr.id
		WHERE
			trs.system_id = $1
	) AS trb_count,
	(
		SELECT
			si. *
		FROM
			system_intakes si
			LEFT JOIN system_intake_systems sis ON sis.system_intake_id = si.id
		WHERE
			sis.system_id = $1
	) AS intake_count;
