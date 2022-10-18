CREATE TYPE trb_where_in_process_option AS ENUM (
    'I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM',
    'CONTRACTING_WORK_HAS_STARTED',
    'DEVELOPMENT_HAS_RECENTLY_STARTED',
    'DEVELOPMENT_IS_SIGNIFICANTLY_UNDERWAY',
    'THE_SYSTEM_IS_IN_OPERATION_AND_MAINTENANCE',
    'OTHER'
);

CREATE TYPE trb_collab_group_option AS ENUM (
    'SECURITY',
    'ENTERPRISE_ARCHITECTURE',
    'CLOUD',
    'PRIVACY_ADVISOR',
    'GOVERNANCE_REVIEW_BOARD',
    'OTHER'
);

CREATE TYPE trb_form_status AS ENUM (
    'READY_TO_START',
    'IN_PROGRESS',
    'COMPLETED'
);

CREATE TABLE trb_request_forms (
    id UUID PRIMARY KEY NOT NULL,
    trb_request_id uuid NOT NULL REFERENCES trb_request(id),
    status trb_form_status NOT NULL DEFAULT 'READY_TO_START',
    component TEXT,
    needs_assistance_with TEXT,
    has_solution_in_mind BOOLEAN,
    proposed_solution TEXT,
    where_in_process trb_where_in_process_option,
    where_in_process_other TEXT,
    has_expected_start_end_dates BOOLEAN,
    expected_start_date TIMESTAMP,
    expected_end_date TIMESTAMP,
    collab_groups trb_collab_group_option[],
    collab_date_security TIMESTAMP,
    collab_date_enterprise_architecture TIMESTAMP,
    collab_date_cloud TIMESTAMP,
    collab_date_privacy_advisor TIMESTAMP,
    collab_date_governance_review_board TIMESTAMP,
    collab_date_other TIMESTAMP,
    collab_group_other TEXT,

    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX trb_request_forms_unique_idx ON trb_request_forms(trb_request_id);
