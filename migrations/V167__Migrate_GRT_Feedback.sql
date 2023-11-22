/* Modify governance_request_feedback to support old feedback entries from grt_feedback table */
ALTER TABLE governance_request_feedback
	ALTER COLUMN created_by DROP NOT NULL;

/* Update governance_request_feedback with old values from grt_feedback */
INSERT INTO governance_request_feedback (
	id,
	intake_id,
	feedback,
	source_action,
	target_form,
	type,
	created_by,
	created_at,
	modified_by,
	modified_at
) SELECT
	id,
	intake_id,
	feedback,
	'PROGRESS_TO_NEW_STEP', -- TODO: Not sure if this makes sense for source_action
	'NO_TARGET_PROVIDED', -- TODO: Not sure if this makes sense for target_form
	CASE
		WHEN feedback_type::text = 'GRB' THEN 'GRB'::feedback_type
		ELSE 'REQUESTER'::feedback_type
	END,
	NULL, -- created_by
	created_at,
	NULL, -- modified_by
	updated_at
FROM grt_feedback;

DROP TABLE grt_feedback;
