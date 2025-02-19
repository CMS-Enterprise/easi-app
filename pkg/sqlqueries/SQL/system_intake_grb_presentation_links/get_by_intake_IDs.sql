SELECT *
FROM system_intake_grb_presentation_links
WHERE system_intake_id = ANY(:system_intake_ids);
