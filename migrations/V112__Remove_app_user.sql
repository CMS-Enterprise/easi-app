-- Drop the app_user from the DB in favor of using the app_user_iam in deployed envs and the `postgres` master user locally/in CI
DROP ROLE IF EXISTS app_user;
