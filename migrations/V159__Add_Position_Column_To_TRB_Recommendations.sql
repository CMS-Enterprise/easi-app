/*
This migration allows us to track the position/ordering of multiple recommendations attached to a TRB advice letter,
using a position_in_letter column added to the trb_advice_letter_recommendations table.
The column is initially created as nullable so it doesn't cause errors with existing rows.
We then populate the column for those existing rows, then mark the column non-nullable.

Unfortunately, we can't add any other constraints on position_in_letter besides non-nullability:

* We can't add a uniqueness constraint on (trb_request_id, position_in_letter),
which would guarantee that all recommendations on a single request/letter have a distinct position,
due to the DeleteTRBAdviceLetterRecommendation() resolver running UPDATE and DELETE queries concurrently.

* Trying to add a constraint to avoid gaps in the ordering for a single request/letter would be highly complicated, potentially impossible,
and also probably wouldn't work due to the same issue with concurrent UPDATE and DELETE queries.
*/

-- 1. add nullable column that we can populate
ALTER TABLE trb_advice_letter_recommendations
ADD COLUMN position_in_letter INTEGER;


-- 2. populate position_in_letter column using a CTE
-- row_number() is a "window function" that operates over sets of rows grouped with the PARTITION BY clause
-- row_number() starts at 1, so subtract 1 to get 0-based index
-- Postgres docs: https://www.postgresql.org/docs/14/tutorial-window.html
-- also see https://www.postgresql.org/docs/14/functions-window.html
WITH positions AS (
	SELECT
		id,
		(row_number() OVER (PARTITION BY trb_request_id ORDER BY created_at ASC)) - 1
      AS position_in_letter
	FROM trb_advice_letter_recommendations
)
UPDATE trb_advice_letter_recommendations
SET position_in_letter = positions.position_in_letter
FROM positions
WHERE trb_advice_letter_recommendations.id = positions.id;


-- 3. make position_in_letter column not nullable, now that it's populated
ALTER TABLE trb_advice_letter_recommendations
ALTER COLUMN position_in_letter SET NOT NULL;
