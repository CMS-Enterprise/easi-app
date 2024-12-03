UPDATE user_account
SET
    common_name = accounts.common_name,
    locale = accounts.locale,
    email = accounts.email,
    given_name = accounts.given_name,
    family_name = accounts.family_name,
    zone_info = accounts.zone_info,
    has_logged_in = accounts.has_logged_in
FROM (
    SELECT
        UNNEST(CAST(:ids AS UUID[])) AS id,
        UNNEST(CAST(:common_names AS TEXT[])) AS common_name,
        UNNEST(CAST(:locales AS TEXT[])) AS locale,
        UNNEST(CAST(:emails AS TEXT[])) AS email,
        UNNEST(CAST(:given_names AS TEXT[])) AS given_name,
        UNNEST(CAST(:family_names AS TEXT[])) AS family_name,
        UNNEST(CAST(:zone_infos AS TEXT[])) AS zone_info,
        UNNEST(CAST(:has_logged_ins AS BOOLEAN[])) AS has_logged_in
) AS accounts
WHERE user_account.id = accounts.id
RETURNING
    user_account.id,
    user_account.username,
    user_account.common_name,
    user_account.locale,
    user_account.email,
    user_account.given_name,
    user_account.family_name,
    user_account.zone_info,
    user_account.has_logged_in;
