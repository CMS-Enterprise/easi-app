ALTER TABLE IF EXISTS cedar_system_bookmarks
ALTER COLUMN cedar_system_id TYPE UUID USING cedar_system_id::UUID;

ALTER TABLE IF EXISTS system_intakes
ALTER COLUMN cedar_system_id TYPE UUID USING cedar_system_id::UUID;

ALTER TABLE IF EXISTS system_intake_systems
ALTER COLUMN system_id TYPE UUID USING system_id::UUID;

ALTER TABLE IF EXISTS accessibility_requests
ALTER COLUMN cedar_system_id TYPE UUID USING cedar_system_id::UUID;

ALTER TABLE IF EXISTS trb_request_systems
ALTER COLUMN system_id TYPE UUID USING system_id::UUID;
