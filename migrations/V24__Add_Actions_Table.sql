CREATE TYPE action_type AS ENUM ('SUBMIT');

create table actions (
    id uuid primary key not null,
    action_type action_type not null,
    actor_name text not null,
    actor_email text not null,
    created_at timestamp with time zone,
    intake_id uuid references system_intake(id)
)