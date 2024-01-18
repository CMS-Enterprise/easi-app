CREATE DOMAIN ZERO_STRING AS TEXT CHECK (length(value) > 0);

COMMENT ON DOMAIN ZERO_STRING IS 'ZERO_STRING is text that is cannot be an empty string';
