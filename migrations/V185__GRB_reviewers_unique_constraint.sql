ALTER TABLE system_intake_grb_reviewers
  ADD CONSTRAINT unique_system_intake_id_user_id UNIQUE (system_intake_id, user_id);
