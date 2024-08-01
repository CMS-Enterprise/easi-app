SELECT *
FROM trb_request_feedback
WHERE trb_request_id = :trb_request_id
ORDER BY created_at DESC LIMIT 1
