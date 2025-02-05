ALTER TABLE system_intake
    DROP CONSTRAINT eua_id_check,
    ADD CONSTRAINT eua_id_check CHECK (public.system_intake.eua_user_id ~ '^[A-Z0-9]{4}$');
ALTER TABLE business_case
    DROP CONSTRAINT eua_id_check,
    ADD CONSTRAINT eua_id_check CHECK (public.business_case.eua_user_id ~ '^[A-Z0-9]{4}$');
