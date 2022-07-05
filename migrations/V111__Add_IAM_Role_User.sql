-- SELECT list in both of the EXISTS queries can stay empty
DO
$do$
BEGIN
  -- Create app_user_iam if it doesn't already exist
  IF NOT EXISTS (
    SELECT
    FROM pg_catalog.pg_roles
    WHERE rolname = 'app_user_iam'
  ) THEN
    CREATE USER app_user_iam;
  END IF;

  GRANT crud TO app_user_iam;

  -- rds_iam role only exists in RDS, not locally
  IF EXISTS (
    SELECT 
    FROM   pg_catalog.pg_roles
    WHERE  rolname = 'rds_iam'
  ) THEN
    GRANT rds_iam TO app_user_iam;
  END IF;
END
$do$;
