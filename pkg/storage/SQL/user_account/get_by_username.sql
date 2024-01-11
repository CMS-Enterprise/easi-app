SELECT
    id,
    username,
    common_name,
    locale,
    email,
    given_name,
    family_name,
    zone_info,
    has_logged_in

FROM user_account WHERE username = :username
