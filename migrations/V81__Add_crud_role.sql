DO
$do$
BEGIN
  IF EXISTS (
    SELECT -- SELECT list can stay empty for this
    FROM   pg_catalog.pg_roles
    WHERE  rolname = 'crud') THEN

    REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM crud;
    REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM crud;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL PRIVILEGES ON TABLES FROM crud;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL PRIVILEGES ON SEQUENCES FROM crud;

    DROP ROLE crud;
  END IF;
END
$do$;

CREATE ROLE crud;

-- Modify existing tables and sequences.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO crud;
REVOKE ALL PRIVILEGES ON TABLE flyway_schema_history FROM crud;
GRANT USAGE, UPDATE ON ALL SEQUENCES IN SCHEMA public TO crud;

-- Modify future tables and sequences.
-- Do not include `FOR ROLE` in the following statements so that:
-- 1. when this runs in RDS, it will apply to the role running migrations.
-- 2. when this runs in Docker, it will apply to the `postgres` role.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO crud;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, UPDATE ON SEQUENCES TO crud;
