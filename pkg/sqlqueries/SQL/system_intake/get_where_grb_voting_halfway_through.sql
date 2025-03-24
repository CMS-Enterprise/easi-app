SELECT *
FROM system_intakes
WHERE
    grb_review_type = 'ASYNC'
    AND grb_review_started_at IS NOT NULL,
    AND grb_review_async_end_date IS NOT NULL,
    AND archived_at IS NULL,
    -- The halfway point is calculated as the start date plus half the difference between the start and end date
    --  Odd days get rounded down (if there are 7 days total, the halfway point is 3 days after the start date)
    AND CURRENT_DATE = DATE(grb_review_started_at) + (DATE_PART('day', grb_review_async_end_date - grb_review_started_at) / 2)
ORDER BY created_at DESC;
