package storage

import (
	"go.uber.org/zap"
)

// TruncateAllTablesDANGEROUS is a function to reset all tables in the DB. It should only be called within test code.
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
	grt_feedback,
	system_intake_contacts,
	system_intake_funding_sources,
	system_intakes,
	trb_request_documents,
	trb_request_forms,
	trb_request_attendees,
	trb_request_feedback,
	trb_admin_notes,
	trb_request
	`

	_, err := s.db.Exec("TRUNCATE " + tables)
	if err != nil {
		return err
	}

	return nil
}
