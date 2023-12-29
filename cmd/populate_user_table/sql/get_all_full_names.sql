
SELECT fullname
FROM (


/* not present in these tables
accessibility_request_documents
accessibility_request_notes
accessibility_request_status_records
accessibility_requests
accessibility_requests_and_statuses
*/
-- Subquery for actions table
-- Note, we already get the EUAID for this field, so maybe, this isn't needed
SELECT actor_name AS fullname
FROM actions
UNION

-- Subquery for business_cases table
SELECT requester AS fullname
FROM business_cases
UNION
SELECT business_owner AS fullname
FROM business_cases
UNION

/* not present in these tables
cedar_system_bookmarks
estimated_lifecycle_costs
feedback_valid_source_target_combinations
flyway_schema_history
governance_request_feedback
*/

-- Subquery for notes table
-- Note, we already get the EUAID for this field, so maybe, this isn't needed
SELECT author_name AS fullname
FROM notes
UNION

/* 
system_intake_contacts
system_intake_documents
system_intake_funding_sources
*/

-- Subquery for system_intakes table
-- Note, we already get the EUAID, which I think we use for requester? This will have to be validated
-- Verify that these aren't duplicated from the contacts table
SELECT requester AS fullname
FROM system_intakes
UNION
SELECT business_owner AS fullname
FROM system_intakes
UNION
SELECT product_manager AS fullname
FROM system_intakes
UNION

--TODO: NEED TO VERIFY THAT THESE FIELDS ARE NAMES AND NOT EUAIDS
SELECT isso AS fullname
FROM system_intakes
UNION
SELECT trb_collaborator AS fullname
FROM system_intakes
UNION
SELECT oit_security_collaborator AS fullname
FROM system_intakes
UNION
SELECT ea_collaborator AS fullname
FROM system_intakes
UNION
SELECT contractor AS fullname -- TODO: verify that this is meant to be an individual... This might just be a string
FROM system_intakes
UNION
SELECT isso AS fullname
FROM system_intakes
UNION

 -- TODO: verify, is this supposed to be be the same as the other top columns
SELECT isso_name AS fullname
FROM system_intakes
UNION
SELECT trb_collaborator_name AS fullname
FROM system_intakes
UNION
SELECT oit_security_collaborator_name AS fullname
FROM system_intakes
UNION
SELECT ea_collaborator_name AS fullname
FROM system_intakes
UNION

-- Unsure if this is EUAID or name, will need to verify
SELECT admin_lead AS fullname
FROM system_intakes
/*not present in these tables

test_dates
trb_admin_notes
trb_admin_notes_trb_admin_note_recommendations_links
trb_admin_notes_trb_request_documents_links
trb_advice_letter_recommendations
trb_advice_letters
trb_lead_options
trb_request
trb_request_attendees
trb_request_documents
trb_request_feedback
trb_request_forms
trb_request_funding_sources
trb_request_system_intakes
user_account
*/


) AS fullname 
WHERE fullname IS NOT NULL AND fullname <>'';
