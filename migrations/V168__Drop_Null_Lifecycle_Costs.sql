/*
 * We shouldn't be adding entries to this table with NULL costs (which we were, prior to https://github.com/CMSgov/easi-app/pull/2313)
 * This migration aims to drop all `NULL` costs from this table and modify the table's constraints to prevent this from happening again.
 */
DELETE FROM estimated_lifecycle_costs WHERE cost IS NULL;
ALTER TABLE estimated_lifecycle_costs ALTER COLUMN cost SET NOT NULL;
