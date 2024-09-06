SELECT id,
       system_intake_id,
       file_name,
       document_type,
       other_type,
       document_version,
       bucket,
       s3_key,
       created_by,
       modified_by,
       created_at,
       modified_at,
       uploader_role
FROM system_intake_documents
WHERE system_intake_id = ANY(:system_intake_ids);
