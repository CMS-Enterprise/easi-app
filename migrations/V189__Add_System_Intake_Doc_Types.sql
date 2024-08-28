ALTER TYPE system_intake_document_type RENAME VALUE 'DRAFT_ICGE' TO 'DRAFT_IGCE';
ALTER TYPE system_intake_document_type ADD VALUE 'ACQUISITION_PLAN_OR_STRATEGY' BEFORE 'DRAFT_IGCE';
ALTER TYPE system_intake_document_type ADD VALUE 'REQUEST_FOR_ADDITIONAL_FUNDING' AFTER 'DRAFT_IGCE';
ALTER TYPE system_intake_document_type ADD VALUE 'MEETING_MINUTES' AFTER 'REQUEST_FOR_ADDITIONAL_FUNDING';

CREATE TYPE system_intake_document_version AS ENUM('CURRENT', 'HISTORICAL');

ALTER TABLE system_intake_documents ADD COLUMN document_version system_intake_document_version;

UPDATE system_intake_documents SET document_version='CURRENT' WHERE document_version IS NULL;

ALTER TABLE system_intake_documents ALTER COLUMN document_version SET NOT NULL;
