SELECT eua_user_id, cedar_system_id
FROM cedar_system_bookmarks
WHERE (eua_user_id, cedar_system_id) = ANY
      (SELECT UNNEST(CAST(:eua_user_ids AS TEXT[])), UNNEST(CAST(:cedar_system_ids AS TEXT[])));

-- unnest doc
-- unnest takes an array and turns it into rows
-- example, [1,2,3,4] becomes
-- col
-- 1
-- 2
-- 3
-- 4
-- multiple arrays being unnested next to each other in the example above looks like this
-- example, [1,2,3,4,5,6] [60,50,40,30,20,10]
-- col1   col2
-- 1      60
-- 2      50
-- 3      40
-- 4      30
-- 5      20
-- 6      10

-- it is important to note that SELECT UNNEST(ARRAY), UNNEST(ARRAY), will act as in the example above,
-- but SELECT * FROM UNNEST(ARRAY), UNNEST(ARRAY) (difference - `* FROM`) will result in every item being paired
-- with every other item, giving you 25 pairs, in the example above
