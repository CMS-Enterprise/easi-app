create table system_intake_contacts (
  eua_user_id text not null CHECK (eua_user_id ~ '^[A-Z0-9]{4}$'),
  system_intake_id uuid not null REFERENCES system_intakes(id),
  created_at timestamp with time zone,
  PRIMARY KEY (eua_user_id, system_intake_id)
);
