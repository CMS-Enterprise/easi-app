SELECT tr.*
FROM trb_request tr
       LEFT JOIN trb_request_systems trs ON trs.trb_request_id = tr.id
WHERE trs.system_id = :system_id
  AND tr.state = :state;
