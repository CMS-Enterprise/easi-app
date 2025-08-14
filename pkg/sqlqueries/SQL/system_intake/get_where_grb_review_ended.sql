SELECT *
FROM system_intakes si
WHERE
    si.grb_review_type = 'ASYNC'
    AND si.grb_review_started_at IS NOT NULL
    AND si.grb_review_async_end_date IS NOT NULL
    AND si.grb_review_async_manual_end_date IS NULL
    AND si.archived_at IS NULL
    AND si.grb_review_async_end_date BETWEEN (NOW() - INTERVAL '1 DAY') AND NOW();
