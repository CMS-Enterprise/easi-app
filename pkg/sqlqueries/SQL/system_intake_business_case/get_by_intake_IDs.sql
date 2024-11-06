SELECT *
FROM
    business_cases
WHERE
business_cases.system_intake = ANY(:system_intake_ids);
