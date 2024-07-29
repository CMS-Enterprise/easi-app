SELECT si.*
FROM trb_request_system_intakes trb_si
INNER JOIN system_intakes si
    ON trb_si.system_intake_id = si.id
WHERE trb_si.trb_request_id = :trb_request_id;
