WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("id" UUID) --noqa
)

SELECT
    user_account.id,
    user_account.username,
    user_account.common_name,
    user_account.locale,
    user_account.email,
    user_account.given_name,
    user_account.family_name,
    user_account.zone_info,
    user_account.has_logged_in

FROM QUERIED_IDS AS qIDs
INNER JOIN user_account ON user_account.id = qIDs.id
