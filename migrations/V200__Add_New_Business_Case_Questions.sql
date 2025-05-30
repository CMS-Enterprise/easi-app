ALTER TABLE business_cases ADD COLUMN collaboration_needed TEXT;
ALTER TABLE business_cases ADD COLUMN project_acronym TEXT;
ALTER TABLE business_cases ADD COLUMN response_to_grt_feedback TEXT;

ALTER TABLE business_cases ADD COLUMN preferred_target_contract_award_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE business_cases ADD COLUMN preferred_target_completion_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE business_cases ADD COLUMN preferred_zero_trust_alignment TEXT;
ALTER TABLE business_cases ADD COLUMN preferred_hosting_cloud_strategy TEXT;
ALTER TABLE business_cases ADD COLUMN preferred_workforce_training_reqs TEXT;

ALTER TABLE business_cases ADD COLUMN alternative_a_target_contract_award_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE business_cases ADD COLUMN alternative_a_target_completion_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE business_cases ADD COLUMN alternative_a_zero_trust_alignment TEXT;
ALTER TABLE business_cases ADD COLUMN alternative_a_hosting_cloud_strategy TEXT;
ALTER TABLE business_cases ADD COLUMN alternative_a_workforce_training_reqs TEXT;

ALTER TABLE business_cases ADD COLUMN alternative_b_target_contract_award_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE business_cases ADD COLUMN alternative_b_target_completion_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE business_cases ADD COLUMN alternative_b_zero_trust_alignment TEXT;
ALTER TABLE business_cases ADD COLUMN alternative_b_hosting_cloud_strategy TEXT;
ALTER TABLE business_cases ADD COLUMN alternative_b_workforce_training_reqs TEXT;
