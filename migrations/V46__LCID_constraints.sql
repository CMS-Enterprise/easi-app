ALTER TABLE system_intake
    DROP CONSTRAINT lcid_check,
    ADD CONSTRAINT lcid_check CHECK (public.system_intake.lcid ~ '^[A-Z]?[0-9]{6}$');
