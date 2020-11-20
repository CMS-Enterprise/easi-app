CREATE TABLE files (
    id uuid primary key not null,
    file_type text not null,
    bucket text not null,
    file_key text not null,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    virus_scanned boolean,
    virus_clean boolean,
)
