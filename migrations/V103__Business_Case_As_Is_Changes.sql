ALTER TABLE business_cases 
    RENAME COLUMN as_is_summary TO current_solution_summary;

ALTER TABLE business_cases 
    DROP COLUMN as_is_title,
    DROP COLUMN as_is_pros,
    DROP COLUMN as_is_cons,
    DROP COLUMN as_is_cost_savings;
   
