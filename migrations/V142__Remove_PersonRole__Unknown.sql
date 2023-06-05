UPDATE trb_request_attendees SET role = 'OTHER' WHERE role = 'UNKNOWN';

ALTER TYPE person_role RENAME TO person_role_old;

CREATE TYPE person_role AS ENUM (
    'PRODUCT_OWNER',
    'SYSTEM_OWNER',
    'SYSTEM_MAINTAINER',
    'CONTRACT_OFFICE_RSREPRESENTATIVE',
    'CLOUD_NAVIGATOR',
    'PRIVACY_ADVISOR',
    'CRA',
    'OTHER'
);

ALTER TABLE trb_request_attendees ALTER COLUMN role TYPE person_role USING role::TEXT::person_role;

DROP TYPE person_role_old;
