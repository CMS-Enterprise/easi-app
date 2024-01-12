CREATE TABLE user_account (
    id UUID PRIMARY KEY NOT NULL,
    username ZERO_STRING NOT NULL,
    common_name ZERO_STRING NOT NULL,
    locale ZERO_STRING NOT NULL,
    email ZERO_STRING NOT NULL,
    given_name ZERO_STRING NOT NULL,
    family_name ZERO_STRING NOT NULL,
    zone_info ZERO_STRING NOT NULL,
    has_logged_in BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE user_account
ADD CONSTRAINT unique_username UNIQUE (username);


-- Create System Account
INSERT INTO "public"."user_account"("id", "username", "common_name", "locale", "email", "given_name", "family_name", "zone_info", "has_logged_in") VALUES('00000001-0001-0001-0001-000000000001', 'EASI_SYSTEM', 'EASI System Account', 'en_US', 'UNKNOWN@UNKNOWN.UNKNOWN', 'EASI', 'System Account', 'UNKNOWN', TRUE) RETURNING "id", "username", "common_name", "locale", "email", "given_name", "family_name", "zone_info", "has_logged_in";
/*
Handle any cases of referenced 'EASI' EUAID account
*/

/* Update any existing pointers to the EASI account to point to the system account instead

*/


-- Create Unkown Account
INSERT INTO "public"."user_account"("id", "username", "common_name", "locale", "email", "given_name", "family_name", "zone_info", "has_logged_in") VALUES('00000000-0000-0000-0000-000000000000', 'UNKNOWN_USER', 'UNKNOWN USER ACCOUNT', 'UNKNOWN', 'UNKNOWN@UNKNOWN.UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNKNOWN', TRUE) RETURNING "id", "username", "common_name", "locale", "email", "given_name", "family_name", "zone_info", "has_logged_in";

/* Update any existing pointers to the UNKN account to point to the system account instead
This should only be in the audit change table
*/
