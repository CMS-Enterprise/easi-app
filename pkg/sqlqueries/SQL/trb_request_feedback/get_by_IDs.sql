SELECT *
FROM trb_request_feedback
WHERE trb_request_id = ANY(:trb_request_ids)
ORDER BY created_at DESC;
