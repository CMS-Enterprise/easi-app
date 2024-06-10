SELECT eua_user_id, cedar_system_id
FROM cedar_system_bookmarks
WHERE (eua_user_id, cedar_system_id) = ANY
      (SELECT UNNEST(CAST(:eua_user_ids AS TEXT[])), UNNEST(CAST(:cedar_system_ids AS TEXT[])));
