ALTER TABLE system_intakes ADD COLUMN priority_alignment TEXT;

WITH latest_business_case_priority_alignment AS (
    SELECT DISTINCT ON (system_intake)
        system_intake,
        priority_alignment
    FROM business_cases
    WHERE priority_alignment IS NOT NULL
    ORDER BY
        system_intake,
        COALESCE(last_submitted_at, updated_at, created_at) DESC NULLS LAST,
        id DESC
)

UPDATE system_intakes
SET priority_alignment = latest_business_case_priority_alignment.priority_alignment
FROM latest_business_case_priority_alignment
WHERE
    latest_business_case_priority_alignment.system_intake = system_intakes.id
    AND system_intakes.priority_alignment IS NULL;

ALTER TABLE business_cases DROP COLUMN priority_alignment;
