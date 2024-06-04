SELECT eua_user_id, cedar_system_id
FROM cedar_system_bookmarks
WHERE (eua_user_id, cedar_system_id) = ANY(SELECT UNNEST($1::TEXT[]), UNNEST($2::TEXT[]));
