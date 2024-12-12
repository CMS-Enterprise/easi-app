SELECT
    id,
    trb_request_id,
    file_name,
    document_type,
    other_type,
    bucket,
    s3_key,
    created_by,
    modified_by,
    created_at,
    modified_at,
    deleted_at
FROM trb_request_documents
WHERE
    trb_request_id = :trb_request_id
    AND deleted_at IS NULL;
