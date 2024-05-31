SELECT cedar_system_id
FROM cedar_system_bookmarks
WHERE (cedar_system_id, eua_user_id) = UNNEST(:bookmark_requests);
