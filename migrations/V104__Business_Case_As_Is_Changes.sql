--  Removing 'As Is' from lifecycle_cost_solution enum
ALTER TYPE lifecycle_cost_solution 
    RENAME TO lifecycle_cost_solution_temp;
    
CREATE TYPE lifecycle_cost_solution AS ENUM ('Preferred', 'A', 'B');

ALTER TABLE estimated_lifecycle_costs
    RENAME solution TO solution_temp;

ALTER TABLE estimated_lifecycle_costs ADD solution lifecycle_cost_solution not null;

UPDATE estimated_lifecycle_costs SET solution = solution_temp::text::lifecycle_cost_solution;

ALTER TABLE estimated_lifecycle_costs
    DROP solution_temp;

DROP TYPE lifecycle_cost_solution_temp;

-- Renaming as_is_summary and dropping all other 'As Is' columns
ALTER TABLE business_cases 
    RENAME COLUMN as_is_summary TO current_solution_summary;

ALTER TABLE business_cases 
    DROP COLUMN as_is_title,
    DROP COLUMN as_is_pros,
    DROP COLUMN as_is_cons,
    DROP COLUMN as_is_cost_savings;
   
