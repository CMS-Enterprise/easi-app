DROP USER IF EXISTS app_user;

CREATE USER app_user WITH PASSWORD '${appuserpassword}';

-- Assign the crud role (create, read, update, delete) to the
-- app_user
GRANT crud TO app_user;
