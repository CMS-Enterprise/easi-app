create table bidness_case (
   id uuid PRIMARY KEY not null,
   eua_user_id text not null,
   project_name text,
   requester text,
   requester_phone_number text,
   bidness_owner text,
   bidness_need text,
   cms_benefit text,
   priority_alignment text,
   success_indicators text,

   as_is_title text,
   as_is_summary text,
   as_is_pros text,
   as_is_cons text,
   as_is_cost_savings text,

   preferred_title text,
   preferred_summary text,
   preferred_acquisition_approach text,
   preferred_pros text,
   preferred_cons text,
   preferred_cost_savings text,

   alternative_a_title text,
   alternative_a_summary text,
   alternative_a_acquisition_approach text,
   alternative_a_pros text,
   alternative_a_cons text,
   alternative_a_cost_savings text,

   alternative_b_title text,
   alternative_b_summary text,
   alternative_b_acquisition_approach text,
   alternative_b_pros text,
   alternative_b_cons text,
   alternative_b_cost_savings text
);

CREATE TYPE lifecycle_cost_phase AS ENUM ('Initiate', 'Operations & Maintenance');
CREATE TYPE lifecycle_cost_solution AS ENUM ('As Is', 'Preferred', 'A', 'B');
CREATE TYPE lifecycle_cost_year AS ENUM ('1', '2', '3', '4', '5');

create table estimated_lifecycle_cost (
    id uuid PRIMARY KEY not null,
    bidness_case uuid not null REFERENCES bidness_case(id),
    solution lifecycle_cost_solution not null,
    year lifecycle_cost_year not null,
    phase lifecycle_cost_phase not null,
    cost int not null
)
