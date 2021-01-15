package storage

import (
	"context"
	"fmt"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
)

var fakeSystems []*models.System

func init() {
	t1 := time.Date(2020, time.January, 1, 8, 0, 0, 0, time.UTC)
	t2 := t1.AddDate(2, 0, -1)
	fakeSystems = []*models.System{
		{
			LCID:        "X990000",
			CreatedAt:   &t1,
			UpdatedAt:   &t1,
			IssuedAt:    &t1,
			ExpiresAt:   &t2,
			ProjectName: "Three Amigos",
			OwnerID:     "FAKE0",
			OwnerName:   "Lucky Dusty Ned",
		},
		{
			LCID:        "X990001",
			CreatedAt:   &t1,
			UpdatedAt:   &t1,
			IssuedAt:    &t1,
			ExpiresAt:   &t2,
			ProjectName: "Three Musketeers",
			OwnerID:     "FAKE1",
			OwnerName:   "Athos Porthos Aramis",
		},
		{
			LCID:        "X990002",
			CreatedAt:   &t1,
			UpdatedAt:   &t1,
			IssuedAt:    &t1,
			ExpiresAt:   &t2,
			ProjectName: "Three Stooges",
			OwnerID:     "FAKE2",
			OwnerName:   "Moe Larry Curly",
		},
	}
}

// // FetchSystemByLCID uses the Lifecycle ID as the unique identifier for a given System
// func (s *Store) FetchSystemByLCID(ctx context.Context, lcid string) (*models.System, error) {
// 	useFake := true
// 	if useFake {
// 		for _, sys := range fakeSystems {
// 			if lcid == sys.LCID {
// 				return sys, nil
// 			}
// 		}
// 		return nil, fmt.Errorf("system not found: %s", lcid)
// 	}
// 	// TODO: this code would emulate the behavior outlined in `ListSystems(...)`
// 	return nil, fmt.Errorf("not yet implemented")
// }

// ListSystems retrieves a collection of Systems, which are a subset of all SystemIntakes that
// have been "decided" and issued an LCID.
func (s *Store) ListSystems(ctx context.Context) ([]*models.System, error) {
	useFake := true
	if useFake {
		return fakeSystems, nil
	}

	return nil, fmt.Errorf("not yet implemented")
}
