CREATE TYPE action_type AS ENUM ('SUBMIT');

create table actions (
    id uuid primary key not null,
    action_type action_type not null,
    actor_name text not null CHECK (actor_name <> ''),
    actor_email text not null CHECK (actor_name <> ''),
    actor_eua_user_id text not null CHECK (actor_eua_user_id ~ '[A-Z0-9]{4}'),
    created_at timestamp with time zone,
    intake_id uuid references system_intake(id)
)