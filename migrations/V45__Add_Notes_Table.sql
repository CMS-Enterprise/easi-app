CREATE TABLE note (
    id uuid PRIMARY KEY not null,
    system_intake uuid not null REFERENCES system_intake(id),
    created_at timestamp with time zone,
    eua_user_id text not null,
    author_name text,
    content text);
