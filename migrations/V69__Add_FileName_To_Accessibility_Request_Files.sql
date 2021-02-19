ALTER TABLE accessibility_request_files ADD COLUMN file_name TEXT;
UPDATE accessibility_request_files SET file_name = file_key;
ALTER TABLE accessibility_request_files ALTER COLUMN file_name SET NOT NULL;
ALTER TABLE accessibility_request_files ADD COLUMN file_size integer NOT NULL;
