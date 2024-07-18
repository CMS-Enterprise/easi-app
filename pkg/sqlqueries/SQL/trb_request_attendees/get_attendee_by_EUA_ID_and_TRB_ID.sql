SELECT *
  FROM trb_request_attendees
  WHERE eua_user_id = :eua_user_id
  AND trb_request_id = :trb_request_id;
