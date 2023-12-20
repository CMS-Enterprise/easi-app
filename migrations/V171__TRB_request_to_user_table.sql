/* ADD Temp data column to assist with migration*/

ALTER TABLE trb_request
RENAME COLUMN created_by TO created_by_old;

ALTER TABLE trb_request
RENAME COLUMN modified_by TO modified_by_old;

/* ADD Correct Column */
ALTER TABLE trb_request
ADD COLUMN created_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
ADD COLUMN modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE;


/*
Section to migrate user account data. We will have to assume that there will at least be some accounts that are missing form the database, and create temporary accounts.
We do not have access to appcode here, so we have to make an approxmiation of UserInformation.
We may consider adding additional UserInformation to distinguish if a users account is old etc.

*/

/*remove the old columns */
ALTER TABLE trb_request
DROP COLUMN created_by_old,
DROP COLUMN modified_by_old;


/*add constraints */
ALTER TABLE trb_request
ALTER COLUMN created_by SET NOT NULL;
