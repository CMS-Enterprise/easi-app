alter table business_case add constraint eua_id_check check (eua_user_id ~ '[A-Z0-9]{4}');
alter table business_case add column system_intake uuid not null REFERENCES system_intake(id);
