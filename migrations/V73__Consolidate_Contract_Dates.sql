ALTER TABLE system_intakes ADD COLUMN contract_start_date DATE;
ALTER TABLE system_intakes ADD COLUMN contract_end_date DATE;

UPDATE system_intakes SET contract_start_date =
    (contract_start_year || '-' || contract_start_month || '-01')::DATE
    WHERE
          contract_start_month IS NOT NULL
      AND contract_start_month != ''
      AND contract_start_year IS NOT NULL
      AND contract_start_year != '';

UPDATE system_intakes SET contract_end_date =
    (contract_end_year || '-' || contract_end_month || '-01')::DATE
    WHERE
          contract_end_month IS NOT NULL
      AND contract_end_month != ''
      AND contract_end_year IS NOT NULL
      AND contract_end_year != '';
