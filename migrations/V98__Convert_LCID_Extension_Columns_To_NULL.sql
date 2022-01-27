-- Some actions were created in some deployed environments with '' as the value for these columns instead of NULL.

UPDATE actions SET lcid_expiration_change_new_scope = NULL WHERE lcid_expiration_change_new_scope = '';
UPDATE actions SET lcid_expiration_change_previous_scope = NULL WHERE lcid_expiration_change_previous_scope = '';
UPDATE actions SET lcid_expiration_change_new_next_steps = NULL WHERE lcid_expiration_change_new_next_steps = '';
UPDATE actions SET lcid_expiration_change_previous_next_steps = NULL WHERE lcid_expiration_change_previous_next_steps = '';
UPDATE actions SET lcid_expiration_change_new_cost_baseline = NULL WHERE lcid_expiration_change_new_cost_baseline = '';
UPDATE actions SET lcid_expiration_change_previous_cost_baseline = NULL WHERE lcid_expiration_change_previous_cost_baseline = '';
