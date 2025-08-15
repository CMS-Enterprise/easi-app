SELECT
    id,
    content,
    voting_role,
    grb_role,
    system_intake_id,
    reply_to_id,
    modified_at,
    modified_by,
    created_at,
    created_by,
    discussion_board_type
FROM system_intake_internal_grb_review_discussion_posts
WHERE system_intake_id = ANY(:system_intake_ids);
