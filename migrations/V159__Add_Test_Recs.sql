INSERT INTO trb_request (id, name, type, created_by)
VALUES
  ('cd5e0275-d025-4bac-85b1-fdbf25750b4e', 'test request A', 'NEED_HELP', 'ABCD'),
  ('a3fc420c-f9ee-464c-9f97-e322b808bf5a', 'test request B', 'NEED_HELP', 'ABCD');

INSERT INTO trb_advice_letters (id, trb_request_id, created_by)
VALUES
  ('78d84d8b-9a2e-40b5-9f57-b161a03aa77b', 'cd5e0275-d025-4bac-85b1-fdbf25750b4e', 'ABCD'),
  ('ef460660-53cd-4f52-86b6-e168fa6fd609', 'a3fc420c-f9ee-464c-9f97-e322b808bf5a', 'ABCD');

INSERT INTO trb_advice_letter_recommendations (id, trb_request_id, links, title, recommendation, created_by, created_at)
VALUES
  ('0a075156-a20f-480a-b110-d21e4135d330', 'cd5e0275-d025-4bac-85b1-fdbf25750b4e', '{}', 'recA1 title', 'recA1 body', 'ABCD', '2022-02-05 22:31:05.079316+00'),
  ('ccaa463c-98ed-4fc7-b757-41ed00dcfa4a', 'cd5e0275-d025-4bac-85b1-fdbf25750b4e', '{}', 'recA2 title', 'recA2 body', 'ABCD', '2023-10-05 22:31:05.079316+00'),
  ('2453fd94-fe7d-4334-a101-3aec59582c0c', 'a3fc420c-f9ee-464c-9f97-e322b808bf5a', '{}', 'recB title', 'recB body', 'ABCD', '2040-10-05 22:31:05.079316+00');
