CREATE TYPE REQUESTED_EDITS_SECTION AS ENUM (
    'BUSINESS_INFORMATION',
    'IMPLEMENTATION_DETAILS',
    'DATA',
    'TOOLS_AND_SOFTWARE',
    'SUB_SYSTEMS',
    'TEAM'
);
COMMENT ON TYPE REQUESTED_EDITS_SECTION IS 'Enum representing sections of an entity that can be edited. Currently, it only refers to CEDAR entities. If it changes in the future, we will need to expand the type';

CREATE TABLE requested_edit (
    id UUID PRIMARY KEY,
    primary_key UUID NOT NULL,
    actor_id UUID NOT NULL REFERENCES user_account(id), --foreign key to user table
    section REQUESTED_EDITS_SECTION NOT NULL,

    /*
    The outcome of the edit being requested? Should this live on the field level instead?
    */

    /*
    Metadata columns
    */
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE requested_edit IS 'Table to track requested edits to various entities.';
COMMENT ON COLUMN requested_edit.primary_key IS 'The primary key of the entity being edited. TODO: determine if this needs to be a string for a CEDAR system ID';
COMMENT ON COLUMN requested_edit.actor_id IS 'The user who requested the edit.';
COMMENT ON COLUMN requested_edit.section IS 'The section of the entity being edited.';


CREATE TYPE REQUESTED_EDIT_FIELD_OUTCOME AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);
COMMENT ON TYPE REQUESTED_EDIT_FIELD_OUTCOME IS 'Enum representing the outcome of a requested edit'

CREATE TABLE requested_edit_field (
    id UUID PRIMARY KEY,
    requested_edit_id UUID NOT NULL REFERENCES requested_edit(id),
    field_name TEXT NOT NULL,
    --TODO, consider if we want to store the data type of the field and data like we currently do for change history in MINT?
    old_value TEXT,
    new_value TEXT,

    outcome REQUESTED_EDIT_FIELD_OUTCOME NOT NULL DEFAULT 'PENDING',
    outcome_by UUID REFERENCES user_account(id), --who approved/rejected the edit
    outcome_dts TIMESTAMP WITH TIME ZONE, --when the edit was approved/rejected
    /*
    The outcome of the edit being requested?
    */

    /*
    Metadata columns
    */
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);
COMMENT ON TABLE requested_edit_field IS 'Table to track individual fields within a requested edit.';
COMMENT ON COLUMN requested_edit_field.requested_edit_id IS 'Foreign key to the requested_edit table';
COMMENT ON COLUMN requested_edit_field.field_name IS 'The name of the field being edited.';
COMMENT ON COLUMN requested_edit_field.old_value IS 'The old value of the field before the edit';
COMMENT ON COLUMN requested_edit_field.new_value IS 'The new value of the field after the edit';
COMMENT ON COLUMN requested_edit_field.outcome IS 'The outcome of the requested edit';
COMMENT ON COLUMN requested_edit_field.outcome_by IS 'The user who approved or rejected the edit';
COMMENT ON COLUMN requested_edit_field.outcome_dts IS 'The timestamp when the edit was approved or rejected';
