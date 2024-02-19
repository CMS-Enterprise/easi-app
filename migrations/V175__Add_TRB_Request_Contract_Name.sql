-- Using a NULLable ZERO_STRING here so that you either have a valid non-empty string
-- or an explicitly NULL value (i.e. not "")
ALTER TABLE trb_request ADD COLUMN contract_name ZERO_STRING;

CREATE TYPE trb_request_relation_type AS ENUM (
  'NEW_SYSTEM',
  'EXISTING_SYSTEM',
  'EXISTING_SERVICE'
);

ALTER TABLE trb_request ADD COLUMN system_relation_type trb_request_relation_type;
