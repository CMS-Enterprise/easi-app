SELECT *
FROM trb_request_forms
WHERE trb_request_id=ANY(:trb_request_ids)
