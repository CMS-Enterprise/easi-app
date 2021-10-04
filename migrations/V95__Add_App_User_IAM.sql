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