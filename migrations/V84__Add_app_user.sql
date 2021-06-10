DO
$do$
BEGIN
  CREATE USER app_user;
  EXCEPTION WHEN DUPLICATE_OBJECT THEN
  RAISE NOTICE 'not creating user app_user -- it already exists';
END
$do$;

ALTER USER app_user WITH PASSWORD '${appuserpassword}';

-- Assign the crud role (create, read, update, delete) to the
-- app_user
GRANT crud TO app_user;
