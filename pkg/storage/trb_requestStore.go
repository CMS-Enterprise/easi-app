package storage

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/models"
)

//TRBRequestCreate creates a new TRBRequest record
func (s *Store) TRBRequestCreate(logger *zap.Logger, trb *models.TRBRequest) (*models.TRBRequest, error) {
	//TODO implement this!

	return nil, nil
}

//TRBRequestGetByID returns an TRBRequest from the db  for a given id
func (s *Store) TRBRequestGetByID(logger *zap.Logger, id uuid.UUID) (*models.TRBRequest, error) {
	//TODO implement this!

	return nil, nil
}

//TRBRequestUpdate returns an TRBRequest from the db  for a given id
func (s *Store) TRBRequestUpdate(logger *zap.Logger, trb *models.TRBRequest) (*models.TRBRequest, error) {
	//TODO implement this!

	return nil, nil
}
