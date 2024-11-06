-- Using a NULLable ZERO_STRING here so that you either have a valid non-empty string
-- or an explicitly NULL value (i.e. not "")
ALTER TABLE system_intakes ADD COLUMN contract_name ZERO_STRING;
