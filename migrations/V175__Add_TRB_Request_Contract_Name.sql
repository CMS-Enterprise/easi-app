-- Now that we're using this enum in TRB requests, we need to rename it to be more generic
ALTER TYPE system_intake_relation_type RENAME TO request_relation_type;
ALTER TABLE trb_request ADD COLUMN system_relation_type request_relation_type;

-- Using a NULLable ZERO_STRING here so that you either have a valid non-empty string
-- or an explicitly NULL value (i.e. not "")
ALTER TABLE trb_request ADD COLUMN contract_name ZERO_STRING;
