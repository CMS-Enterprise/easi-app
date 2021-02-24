CREATE TYPE accessibility_request_document_type AS ENUM ('AWARDED_VPAT', 'TEST_PLAN', 'TESTING_VPAT', 'TEST_RESULTS', 'REMEDIATION_PLAN', 'OTHER');

/* add document type in multiple steps to handle existing rows */
ALTER TABLE accessibility_request_documents ADD COLUMN document_type accessibility_request_document_type;
UPDATE accessibility_request_documents SET document_type = 'OTHER';
ALTER TABLE accessibility_request_documents ALTER COLUMN document_type SET NOT NULL;

ALTER TABLE accessibility_request_documents ADD COLUMN other_type TEXT;
UPDATE accessibility_request_documents SET other_type = 'Other' where document_type = 'OTHER';

/* Don't allow other name to be set unless document_type is null. This does not force there to be a value when document_type is OTHER. */
ALTER TABLE accessibility_request_documents ADD CONSTRAINT other_type_is_null_unless_type_is_other CHECK ((document_type = 'OTHER') = (other_type IS NOT NULL AND other_type != ''));
