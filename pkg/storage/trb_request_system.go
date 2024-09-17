package storage

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
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

func (s *Store) TRBRequestSystemsByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([]*models.TRBRequestSystem, error) {
	var trbRequestSystems []*models.TRBRequestSystem
	return trbRequestSystems, namedSelect(ctx, s.db, &trbRequestSystems, sqlqueries.TRBRequestSystemForm.SelectByTRBRequestIDs, args{
		"trb_request_ids": pq.Array(trbRequestIDs),
	})
}

func (s *Store) TRBRequestsByCedarSystemIDs(ctx context.Context, requests []models.TRBRequestsByCedarSystemIDsRequest) ([]*models.TRBRequestsByCedarSystemIDsResponse, error) {
	// build lists for multiple `where` clauses
	var (
		cedarSystemIDs = make([]string, len(requests))
		states         = make([]models.TRBRequestState, len(requests))
	)

	for i, req := range requests {
		cedarSystemIDs[i] = req.CedarSystemID
		states[i] = req.State
	}

	var trbRequests []*models.TRBRequestsByCedarSystemIDsResponse
	return trbRequests, namedSelect(ctx, s.db, &trbRequests, sqlqueries.TRBRequestSystemForm.SelectByCedarSystemIDs, args{
		"cedar_system_ids": pq.Array(cedarSystemIDs),
		"states":           pq.Array(states),
	})
}
