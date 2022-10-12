CREATE TYPE trb_where_in_process_option AS ENUM (
    'I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM',
    'CONTRACTING_WORK_HAS_STARTED',
    'DEVELOPMENT_HAS_RECENTLY_STARTED',
    'DEVELOPMENT_IS_SIGNIFICANTLY_UNDERWAY',
    'THE_SYSTEM_IS_IN_OPERATION_AND_MAINTENANCE',
    'OTHER',
    'UNKNOWN'
);

CREATE TYPE trb_collab_group_option AS ENUM (
    'SECURITY',
    'ENTERPRISE_ARCHITECTURE',
    'CLOUD',
    'PRIVACY_ADVISOR',
    'GOVERNANCE_REVIEW_BOARD',
    'OTHER'
);

CREATE TABLE trb_request_forms (
    id UUID PRIMARY KEY NOT NULL,
    trb_request_id uuid NOT NULL REFERENCES trb_request(id),
    component TEXT NOT NULL,
    needs_assistance_with TEXT NOT NULL,
    has_solution_in_mind BOOLEAN,
    where_in_process trb_where_in_process_option NOT NULL DEFAULT 'UNKNOWN',
    has_expected_start_end_dates BOOLEAN,
    collab_groups trb_collab_group_option[],

    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX trb_request_forms_unique_idx ON trb_request_forms(trb_request_id);
