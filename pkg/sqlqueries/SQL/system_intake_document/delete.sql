DELETE
FROM system_intake_documents
WHERE id = :id
RETURNING
    id,
    system_intake_id,
    file_name,
    document_type,
    other_type,
    bucket,
    s3_key,
    created_by,
    created_at,
    modified_by,
    modified_at,
    uploader_role;
