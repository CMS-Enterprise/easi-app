SELECT
	system_intakes.*,
	business_cases.id as business_case_id,
	(SELECT CAST(COALESCE(JSONB_AGG(
		JSONB_BUILD_OBJECT(
			'id',
			sicn.id,
			'system_intake_id',
			sicn.system_intake_id,
			'contract_number',
			sicn.contract_number,
			'created_by',
			sicn.created_by,
			'created_at',
			sicn.created_at,
			'modified_by',
			sicn.modified_by,
            'modified_at',
            sicn.modified_at
			)
		),'[]') AS JSONB) 
        FROM system_intake_contract_numbers sicn 
        WHERE sicn.system_intake_id = system_intakes.id) AS contract_numbers
FROM
    system_intakes
LEFT JOIN business_cases ON business_cases.system_intake = system_intakes.id
WHERE system_intakes.lcid=$1
			AND system_intakes.archived_at IS NULL AND system_intakes.status != 'WITHDRAWN';
