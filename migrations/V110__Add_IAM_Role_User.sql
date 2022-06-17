-- RDS postgres has a role named 'rds_iam' which doesn't exist in development
-- Unfortunately it's required in development to run prod migrations.
-- This script checks for the role's existence before creating it.

-- https://stackoverflow.com/questions/8092086/create-postgresql-role-user-if-it-doesnt-exist
DO
$do$
BEGIN
  IF NOT EXISTS (
    SELECT -- SELECT list can stay empty for this
    FROM   pg_catalog.pg_roles
    WHERE  rolname = 'rds_iam') THEN
    CREATE ROLE rds_iam;
  END IF;
END
$do$;

-- Add IAM User
DO
$do$
BEGIN
  CREATE USER app_user_iam;
  EXCEPTION WHEN DUPLICATE_OBJECT THEN
  RAISE NOTICE 'not creating user app_user_iam -- it already exists';
END
$do$;

-- Assign the crud role (create, read, update, delete) to the
-- app_user
GRANT crud TO app_user_iam;
GRANT rds_iam TO app_user_iam;
