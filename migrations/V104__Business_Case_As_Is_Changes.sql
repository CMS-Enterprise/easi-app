/*
    Removing 'As Is' from estimated_lifecycle_costs table and lifecycle_cost_solution enum
*/

-- Delete old "As Is" rows from the table
DELETE FROM estimated_lifecycle_costs WHERE solution = 'As Is';

-- Create a new type for the new temp column
CREATE TYPE lifecycle_cost_solution_no_asis_temp AS ENUM ('Preferred', 'A', 'B');

-- Create a new temp column
ALTER TABLE estimated_lifecycle_costs ADD COLUMN solution_temp lifecycle_cost_solution_no_asis_temp;

-- Copy the data from the old column to the new column
UPDATE estimated_lifecycle_costs SET solution_temp = solution::text::lifecycle_cost_solution_no_asis_temp;

-- Drop the old column
ALTER TABLE estimated_lifecycle_costs DROP COLUMN solution;

-- Drop the old type
DROP TYPE lifecycle_cost_solution;

-- Rename the temp type
ALTER TYPE lifecycle_cost_solution_no_asis_temp RENAME TO lifecycle_cost_solution;

-- Rename the temp column
ALTER TABLE estimated_lifecycle_costs RENAME solution_temp TO solution;

-- Add NOT NULL constraint
ALTER TABLE estimated_lifecycle_costs ALTER COLUMN solution SET NOT NULL;

-- Renaming as_is_summary and dropping all other 'As Is' columns
ALTER TABLE business_cases
    RENAME COLUMN as_is_summary TO current_solution_summary;

-- Drop unused business_cases columns
ALTER TABLE business_cases 
    DROP COLUMN as_is_title,
    DROP COLUMN as_is_pros,
    DROP COLUMN as_is_cons,
    DROP COLUMN as_is_cost_savings;
