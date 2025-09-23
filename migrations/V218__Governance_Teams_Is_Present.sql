ALTER TABLE IF EXISTS system_intakes
ADD COLUMN IF NOT EXISTS governance_teams_is_present BOOLEAN DEFAULT NULL;

UPDATE system_intakes si
SET governance_teams_is_present = CASE
    WHEN si.collaborator_508 IS NOT NULL AND si.collaborator_508 <> '' THEN TRUE
    WHEN si.collaborator_name_508 IS NOT NULL AND si.collaborator_name_508 <> ''
        THEN TRUE
    WHEN si.trb_collaborator IS NOT NULL AND si.trb_collaborator <> '' THEN TRUE
    WHEN si.trb_collaborator_name IS NOT NULL AND si.trb_collaborator_name <> ''
        THEN TRUE
    WHEN si.oit_security_collaborator IS NOT NULL AND si.oit_security_collaborator <> ''
        THEN TRUE
    WHEN
        si.oit_security_collaborator_name IS NOT NULL AND
        si.oit_security_collaborator_name <> '' THEN TRUE
    ELSE FALSE
END;
