CREATE TABLE IF NOT EXISTS system_intake_internal_grb_review_discussion_posts (
  id UUID PRIMARY KEY NOT NULL,
  content TEXT NOT NULL,
  voting_role grb_reviewer_voting_role_type,
  grb_role grb_reviewer_role_type,
  system_intake_id UUID NOT NULL
    REFERENCES system_intakes(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  reply_to_id UUID
    REFERENCES system_intake_internal_grb_review_discussion_posts (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  created_by UUID NOT NULL REFERENCES user_account(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_by UUID REFERENCES user_account(id),
  modified_at TIMESTAMP WITH TIME ZONE
);

CREATE OR REPLACE FUNCTION prevent_nested_replies_fn() RETURNS TRIGGER AS $$
DECLARE
    parent_reply_to_id UUID;
BEGIN
    -- If reply_to_id is not NULL, check if it points to a top-level post
    IF NEW.reply_to_id IS NOT NULL THEN
        -- Fetch the reply_to_id of the parent post
        SELECT reply_to_id INTO parent_reply_to_id
        FROM system_intake_internal_grb_review_discussion_posts
        WHERE id = NEW.reply_to_id;

        -- If parent_reply_to_id is NOT NULL, the parent post is a reply, so raise an error
        IF parent_reply_to_id IS NOT NULL THEN
            RAISE EXCEPTION 'Replies can only be made to top-level posts';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_nested_replies_trigger
BEFORE INSERT OR UPDATE ON system_intake_internal_grb_review_discussion_posts
FOR EACH ROW EXECUTE FUNCTION prevent_nested_replies_fn();
