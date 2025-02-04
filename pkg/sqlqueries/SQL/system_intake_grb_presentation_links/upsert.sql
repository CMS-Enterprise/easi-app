INSERT INTO system_intake_grb_presentation_links
(
    id,
    created_by,
    created_at,
    system_intake_id,
    recording_link,
    recording_passcode,
    transcript_link,
    transcript_s3_key,
    transcript_file_name,
    presentation_deck_s3_key,
    presentation_deck_file_name
)
VALUES (
    gen_random_uuid(),
    :created_by,
    :created_at,
    :system_intake_id,
    :recording_link,
    :recording_passcode,
    :transcript_link,
    :transcript_s3_key,
    :transcript_file_name,
    :presentation_deck_s3_key,
    :presentation_deck_file_name
)
ON CONFLICT (system_intake_id) DO UPDATE
SET (
    modified_by,
    modified_at,
    recording_link,
    recording_passcode,
    transcript_link,
    transcript_s3_key,
    transcript_file_name,
    presentation_deck_s3_key,
    presentation_deck_file_name
) = (
    :modified_by,
    now(),
    :recording_link,
    :recording_passcode,
    :transcript_link,
    :transcript_s3_key,
    :transcript_file_name,
    :presentation_deck_s3_key,
    :presentation_deck_file_name
)
RETURNING *;
