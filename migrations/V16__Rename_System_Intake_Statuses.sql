-- There is no way to remove enums, so I've renamed the unused ones instead
ALTER TYPE system_intake_status RENAME VALUE 'REVIEWED' TO 'ACCEPTED';
ALTER TYPE system_intake_status RENAME VALUE 'REJECTED' TO 'CLOSED';
