create table cedar_system_bookmark (
  eua_user_id text not null CHECK (eua_user_id ~ '^[A-Z0-9]{4}$'),
  cedar_system_id text not null,
  created_at timestamp with time zone
  PRIMARY KEY (eua_user_id, cedar_system_id)
);
