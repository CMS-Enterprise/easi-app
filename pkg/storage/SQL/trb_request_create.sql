INSERT INTO trb_request(
        id,
        name,
        archived,
        type,
        status,
        created_by,
        modified_by
    )
VALUES (
        :id,
        :name,
        :archived,
        :type,
        :status,
        :created_by,
        :modified_by
    )
RETURNING
    id,
    name,
    archived,
    type,
    status,
    created_by,
    created_at,
    modified_by,
    modified_at;
