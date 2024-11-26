UPDATE user_account
SET
    common_name = :common_name,
    locale = :locale,
    email = :email,
    given_name = :given_name,
    family_name = :family_name,
    zone_info = :zone_info,
    has_logged_in = :has_logged_in

WHERE id = :id
RETURNING
    id,
    username,
    common_name,
    locale,
    email,
    given_name,
    family_name,
    zone_info,
    has_logged_in;
