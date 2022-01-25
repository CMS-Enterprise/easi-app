-- Some actions were created in some deployed environments with "" as the value for these columns instead of NULL.

ALTER TABLE actions ADD COLUMN lcid_expiration_change_new_scope text;
ALTER TABLE actions ADD COLUMN lcid_expiration_change_previous_scope text;
ALTER TABLE actions ADD COLUMN lcid_expiration_change_new_next_steps text;
ALTER TABLE actions ADD COLUMN lcid_expiration_change_previous_next_steps text;
ALTER TABLE actions ADD COLUMN lcid_expiration_change_new_cost_baseline text;
ALTER TABLE actions ADD COLUMN lcid_expiration_change_previous_cost_baseline text;