-- Add new columns to support updated contract cost questions
ALTER TABLE system_intakes
ADD COLUMN current_estimated_cost TEXT,
ADD COLUMN current_estimated_cost_it_portion TEXT,
ADD COLUMN estimated_total_contract_value TEXT,
ADD COLUMN estimated_total_contract_value_it_portion TEXT;
