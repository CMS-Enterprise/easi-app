UPDATE system_intake SET status = 'NOT_IT_REQUEST' WHERE status = 'CLOSED';
UPDATE system_intake SET status = 'LCID_ISSUED' WHERE status = 'APPROVED';
UPDATE system_intake SET status = 'NEED_BIZ_CASE' WHERE status = 'ACCEPTED';
UPDATE system_intake SET status = 'WITHDRAWN' WHERE status = 'ARCHIVED';
