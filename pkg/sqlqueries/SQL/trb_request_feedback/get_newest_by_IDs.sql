SELECT
  DISTINCT ON (trb_request_id) *
FROM
  trb_request_feedback
WHERE trb_request_id = ANY(:trb_request_ids)
ORDER BY trb_request_id, created_at DESC;
