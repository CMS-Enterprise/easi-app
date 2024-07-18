SELECT *
  FROM trb_request_attendees
  WHERE (eua_user_id, trb_request_id) = ANY
  (SELECT UNNEST(CAST(:eua_user_ids AS TEXT[])), UNNEST(CAST(:trb_request_ids AS UUID[])));
