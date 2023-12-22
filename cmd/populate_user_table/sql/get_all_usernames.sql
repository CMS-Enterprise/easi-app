/*
Can refactor this to not do all 

*/

SELECT username
FROM (

-- Subquery for actions table
SELECT actor_eua_user_id AS username
FROM actions
UNION

-- Subquery for cedar_system_bookmarks table
SELECT eua_user_id AS username
FROM cedar_system_bookmarks
UNION

SELECT created_by AS username
FROM governance_request_feedback
UNION
SELECT modified_by AS username
FROM governance_request_feedback
UNION

  -- Subquery for system_intakes table
  SELECT username
  FROM (
    SELECT eua_user_id AS username
    FROM system_intakes
    -- UNION
    -- SELECT eua_user_id AS username
    -- FROM system_intakes
  ) AS system_intakes_usernames
  
  UNION
  
  -- Subquery for business_cases table
  SELECT username
  FROM (
    SELECT eua_user_id AS username
    FROM business_cases
    -- UNION
    -- SELECT eua_user_id AS username
    -- FROM business_cases
  ) AS business_cases_usernames
  
  UNION
  
  -- Subquery for trb_request table
  SELECT username
  FROM (
    SELECT trb_lead AS username
    FROM trb_request
    UNION
    SELECT created_by AS username
    FROM trb_request
    UNION
    SELECT modified_by AS username
    FROM trb_request
  ) AS trb_request_usernames
) AS combined_usernames 
WHERE username IS NOT NULL;
