package storage

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlqueries"
)

// SetTRBRequestSystems links given System IDs to given TRB Request ID
// This function opts to take a *sqlx.Tx instead of a NamedPreparer because the SQL calls inside this function are heavily intertwined, and we never want to call them outside the scope of a transaction
func (s *Store) SetTRBRequestSystems(ctx context.Context, tx *sqlx.Tx, trbRequestID uuid.UUID, systemIDs []string) error {
	if trbRequestID == uuid.Nil {
		return errors.New("unexpected nil trb request ID when linking trb request to system id")
	}

	if _, err := tx.NamedExec(sqlqueries.TRBRequestSystemForm.Delete, map[string]interface{}{
		"system_ids":     pq.StringArray(systemIDs),
		"trb_request_id": trbRequestID,
	}); err != nil {
		appcontext.ZLogger(ctx).Error("Failed to delete system ids linked to trb request", zap.Error(err))
		return err
	}

	// no need to run insert if we are not inserting new system ids
	if len(systemIDs) < 1 {
		return nil
	}

	userID := appcontext.Principal(ctx).Account().ID

	setTRBRequestSystemsLinks := make([]models.TRBRequestSystem, len(systemIDs))

	for i, systemID := range systemIDs {
		systemIDLink := models.NewTRBRequestSystem(userID)
		systemIDLink.ID = uuid.New()
		systemIDLink.ModifiedBy = &userID
		systemIDLink.TRBRequestID = trbRequestID
		systemIDLink.SystemID = systemID

		setTRBRequestSystemsLinks[i] = systemIDLink
	}

	if _, err := tx.NamedExec(sqlqueries.TRBRequestSystemForm.Set, setTRBRequestSystemsLinks); err != nil {
		appcontext.ZLogger(ctx).Error("Failed to insert linked trb request to system ids", zap.Error(err))
		return err
	}

	return nil
}

// TRBRequestSystemsByTRBRequestIDLOADER gets multiple groups of system ids by TRB Request ID
func (s *Store) TRBRequestSystemsByTRBRequestIDLOADER(ctx context.Context, paramTableJSON string) (map[string][]*models.TRBRequestSystem, error) {
	stmt, err := s.db.PrepareNamed(sqlqueries.TRBRequestSystemForm.SelectByTRBRequestIDLOADER)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var systems []*models.TRBRequestSystem
	err = stmt.Select(&systems, map[string]interface{}{
		"param_table_json": paramTableJSON,
	})
	if err != nil {
		return nil, err
	}

	ids, err := extractTRBRequestIDs(paramTableJSON)
	if err != nil {
		return nil, err
	}

	store := map[string][]*models.TRBRequestSystem{}

	for _, id := range ids {
		store[id] = []*models.TRBRequestSystem{}
	}

	for _, system := range systems {
		key := system.TRBRequestID.String()
		store[key] = append(store[key], system)
	}

	return store, nil
}

// TRBRequestsByCedarSystemID gets TRB Requests related to given Cedar System ID
func (s *Store) TRBRequestsByCedarSystemID(ctx context.Context, cedarSystemID string) ([]*models.TRBRequest, error) {
	var trbRequests []*models.TRBRequest
	return trbRequests, s.db.Select(&trbRequests, sqlqueries.TRBRequestSystemForm.SelectByCedarSystemID, cedarSystemID)
}
