alter table system_intakes
  add column grb_review_async_reporting_date TIMESTAMP WITH TIME ZONE,
  add column grb_review_async_recording_time TIMESTAMP WITH TIME ZONE,
  add column grb_review_async_end_date TIMESTAMP WITH TIME ZONE,
  add column grb_review_standard_grb_meeting_time TIMESTAMP WITH TIME ZONE,
  add column grb_review_async_grb_meeting_time TIMESTAMP WITH TIME ZONE;
