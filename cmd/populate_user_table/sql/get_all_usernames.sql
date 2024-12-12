/*
Can refactor this to not do all

*/

SELECT username
FROM (

-- Sub query for actions table
    SELECT actor_eua_user_id AS username
    FROM actions
    UNION


    -- Sub query for business_cases table

    SELECT eua_user_id AS username
    FROM business_cases

    UNION

    -- Sub query for cedar_system_bookmarks table
    SELECT eua_user_id AS username
    FROM cedar_system_bookmarks
    UNION


    -- Sub query for governance_request_feedback table
    SELECT created_by AS username
    FROM governance_request_feedback
    UNION
    SELECT modified_by AS username
    FROM governance_request_feedback
    UNION

    -- Sub query for notes table
    SELECT eua_user_id AS username
    FROM notes
    UNION
    SELECT modified_by AS username
    FROM notes
    UNION

    -- Sub query for system_intake_contacts table
    SELECT eua_user_id AS username
    FROM system_intake_contacts
    UNION

    -- Sub query for system_intake_documents table
    SELECT created_by AS username
    FROM system_intake_documents
    UNION
    SELECT modified_by AS username
    FROM system_intake_documents
    UNION

    -- funding source doesn't have this


    -- Sub query for trb_admin_notes table
    SELECT created_by AS username
    FROM trb_admin_notes
    UNION
    SELECT modified_by AS username
    FROM trb_admin_notes
    UNION

    -- Sub query for trb_admin_notes_trb_admin_note_recommendations_links table
    SELECT created_by AS username
    FROM trb_admin_notes_trb_admin_note_recommendations_links
    UNION
    SELECT modified_by AS username
    FROM trb_admin_notes_trb_admin_note_recommendations_links

    UNION

    -- Sub query for trb_admin_notes_trb_request_documents_links table
    SELECT created_by AS username
    FROM trb_admin_notes_trb_request_documents_links
    UNION
    SELECT modified_by AS username
    FROM trb_admin_notes_trb_request_documents_links

    UNION

    -- Sub query for trb_guidance_letter_recommendations table
    SELECT created_by AS username
    FROM trb_guidance_letter_recommendations
    UNION
    SELECT modified_by AS username
    FROM trb_guidance_letter_recommendations

    UNION

    -- Sub query for trb_guidance_letters table
    SELECT created_by AS username
    FROM trb_guidance_letters
    UNION
    SELECT modified_by AS username
    FROM trb_guidance_letters

    UNION

    -- Sub query for trb_lead_options table
    SELECT created_by AS username
    FROM trb_lead_options
    UNION
    SELECT modified_by AS username
    FROM trb_lead_options
    UNION
    SELECT eua_user_id AS username
    FROM trb_lead_options

    UNION

    -- Sub query for trb_request table
    SELECT created_by AS username
    FROM trb_request
    UNION
    SELECT modified_by AS username
    FROM trb_request
    UNION
    SELECT trb_lead AS username
    FROM trb_request

    UNION

    -- Sub query for trb_request_attendees table
    SELECT created_by AS username
    FROM trb_request_attendees
    UNION
    SELECT modified_by AS username
    FROM trb_request_attendees
    UNION
    SELECT eua_user_id AS username
    FROM trb_request_attendees

    UNION

    -- Sub query for trb_request_documents table
    SELECT created_by AS username
    FROM trb_request_documents
    UNION
    SELECT modified_by AS username
    FROM trb_request_documents

    UNION

    -- Sub query for trb_request_feedback table
    SELECT unnest(notify_eua_ids) AS username
    FROM trb_request_feedback
    UNION
    SELECT created_by AS username
    FROM trb_request_feedback
    UNION
    SELECT modified_by AS username
    FROM trb_request_feedback

    UNION

    -- Sub query for trb_request_forms table
    SELECT created_by AS username
    FROM trb_request_forms
    UNION
    SELECT modified_by AS username
    FROM trb_request_forms

    UNION

    -- Sub query for trb_request_funding_sources table
    SELECT created_by AS username
    FROM trb_request_funding_sources
    UNION
    SELECT modified_by AS username
    FROM trb_request_funding_sources

    UNION

    -- Sub query for trb_request_system_intakes table
    SELECT created_by AS username
    FROM trb_request_system_intakes
    UNION
    SELECT modified_by AS username
    FROM trb_request_system_intakes
) AS combined_usernames
WHERE username IS NOT NULL;
