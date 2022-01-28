ALTER TABLE system_intake
  ADD CONSTRAINT eua_id_check CHECK (eua_user_id ~ '[A-Z0-9]{4}');
