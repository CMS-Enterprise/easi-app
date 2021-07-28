package storage

// DANGEROUSClearDatabaseTables clears system intakes and all cascading tables.
// Do not use on production code, only in tests.
func (s *Store) DANGEROUSClearDatabaseTables() error {
	truncateTablesSQL := `
		TRUNCATE TABLE system_intakes CASCADE
`
	_, err := s.db.Exec(truncateTablesSQL)
	return err
}
