INSERT INTO trb_request_documents (
  id,
  trb_request_id,
  file_name,
  document_type,
  other_type,
  bucket,
  file_key,
  created_by,
  modified_by
) VALUES (
  :id,
  :trb_request_id,
  :file_name,
  :document_type,
  :other_type,
  :bucket,
  :file_key,
  :created_by,
  :modified_by
) RETURNING
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
