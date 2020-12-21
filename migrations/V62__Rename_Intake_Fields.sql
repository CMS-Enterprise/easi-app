ALTER TABLE system_intake ADD COLUMN isso_name text;
UPDATE system_intake
    SET isso_name = isso
    WHERE isso IS NOT NULL;

ALTER TABLE system_intake ADD COLUMN trb_collaborator_name text;
UPDATE system_intake
    SET trb_collaborator_name = trb_collaborator
    WHERE trb_collaborator IS NOT NULL;

ALTER TABLE system_intake ADD COLUMN oit_security_collaborator_name text;
UPDATE system_intake
    SET oit_security_collaborator_name = oit_security_collaborator
    WHERE oit_security_collaborator IS NOT NULL;

ALTER TABLE system_intake ADD COLUMN ea_collaborator_name text;
UPDATE system_intake
    SET ea_collaborator_name = ea_collaborator
    WHERE ea_collaborator IS NOT NULL;
