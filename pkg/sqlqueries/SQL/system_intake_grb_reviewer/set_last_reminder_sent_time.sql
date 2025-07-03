UPDATE system_intakes
SET grb_review_reminder_last_sent = :time_sent
WHERE id = :id;
