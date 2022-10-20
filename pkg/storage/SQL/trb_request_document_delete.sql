DELETE
FROM trb_request_documents
WHERE id = :id
RETURNING
  id,
  trb_request_id,
  file_name,
  document_type,
  other_type,
  bucket,
  file_key,
  created_by,
  created_at,
  modified_by,
  modified_at
