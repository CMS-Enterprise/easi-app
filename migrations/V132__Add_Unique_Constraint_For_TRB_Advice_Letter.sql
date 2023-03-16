ALTER TABLE trb_advice_letters ADD CONSTRAINT trb_request_trb_advice_letter_one_to_one UNIQUE (id, trb_request_id);
