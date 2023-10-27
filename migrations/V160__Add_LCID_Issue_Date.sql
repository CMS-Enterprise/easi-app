/* Add column for tracking when LCIDs were initially issued */
ALTER TABLE system_intakes ADD COLUMN lcid_issued_at timestamp with time zone;

/*
 * Pull from actions column to find initial LCID issuance
 * This isn't a _perfect_ migration, as it's possible to have some intakes that have an LCID but don't
 * have a corresponding entry in the actions table. This is an acceptable case, as this info is not used
 * in any business logic at this time, so we're not going to worry about it.
 */
UPDATE system_intakes
SET lcid_issued_at = (
	SELECT
		created_at
	FROM
		actions
	WHERE
		system_intakes.id = actions.intake_id AND action_type = 'ISSUE_LCID'::action_type ORDER BY created_at ASC LIMIT 1
);
