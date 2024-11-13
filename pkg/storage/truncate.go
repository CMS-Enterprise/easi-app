package storage

import (
	"go.uber.org/zap"
)

// TruncateAllTablesDANGEROUS is a function to reset all tables in the DB. It should only be called within test code.
// this list of tables should match the list of tables in scripts/dev's db:clean task
//
// NOTE: we DO NOT truncate the `user_account` table - it would remove the default users, which is behavior we do not want
func (s *Store) TruncateAllTablesDANGEROUS(logger *zap.Logger) error {
	tables := `
	cedar_system_bookmarks,
	accessibility_request_status_records,
	accessibility_request_notes,
	accessibility_request_documents,
	test_dates,
	accessibility_requests,
	notes,
	actions,
	estimated_lifecycle_costs,
	business_cases,
	governance_request_feedback,
	system_intake_contacts,
	system_intake_contract_numbers,
	system_intake_documents,
	system_intake_funding_sources,
	system_intake_grb_reviewers,
    system_intake_internal_grb_review_discussion_posts,
	system_intake_systems,
	system_intakes,
	trb_admin_notes_trb_request_documents_links,
	trb_admin_notes_trb_admin_note_recommendations_links,
	trb_lead_options,
	trb_request_documents,
	trb_request_funding_sources,
	trb_request_forms,
	trb_request_attendees,
	trb_request_feedback,
	trb_guidance_letter_recommendations,
	trb_admin_notes,
	trb_guidance_letters,
	trb_request_system_intakes,
	trb_request_contract_numbers,
	trb_request_systems,
	trb_request
	`

	_, err := s.db.Exec("TRUNCATE " + tables)
	if err != nil {
		return err
	}

	return nil
}

// DeleteUserAccountDANGEROUS deletes a given user account from the DB
// only to be used in test code as we do not truncate `user_account` table
func (s *Store) DeleteUserAccountDANGEROUS(username string) error {
	_, err := s.db.Exec("DELETE FROM user_account WHERE username = $1", username)
	return err
}
