DELETE FROM trb_request_systems
WHERE system_id <> ALL(:system_ids)
AND trb_request_id = :trb_request_id;
