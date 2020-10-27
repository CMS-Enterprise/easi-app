ALTER TABLE business_case ADD COLUMN preferred_security_is_approved bool;
ALTER TABLE business_case ADD COLUMN preferred_security_is_being_reviewed text;

ALTER TABLE business_case ADD COLUMN alternative_a_security_is_approved bool;
ALTER TABLE business_case ADD COLUMN alternative_a_security_is_being_reviewed text;

ALTER TABLE business_case ADD COLUMN alternative_b_security_is_approved bool;
ALTER TABLE business_case ADD COLUMN alternative_b_security_is_being_reviewed text;
