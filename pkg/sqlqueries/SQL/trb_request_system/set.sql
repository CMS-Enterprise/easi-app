INSERT INTO trb_request_systems (
		id,
		trb_request_id,
		system_id,
		created_by,
		modified_by
	)
	VALUES (
		:id,
		:trb_request_id,
		:system_id,
		:created_by,
		:modified_by
	) ON CONFLICT DO NOTHING;
