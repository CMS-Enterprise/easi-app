package services

import (
	"context"
	"errors"

	"github.com/facebookgo/clock"
	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s ServicesTestSuite) TestFetchNotes() {
	cfg := NewConfig(nil, nil)
	cfg.clock = clock.NewMock()

	idError := uuid.Nil
	idFound := uuid.New()
	fetcher := func(_ context.Context, id uuid.UUID) ([]*models.Note, error) {
		if id == idError {
			return nil, errors.New("forced error")
		}
		if id == idFound {
			return []*models.Note{
				{
					ID:             uuid.New(),
					SystemIntakeID: id,
					Content:        null.StringFrom("alpha"),
				},
				{
					ID:             uuid.New(),
					SystemIntakeID: id,
					Content:        null.StringFrom("omega"),
				},
			}, nil
		}
		return nil, nil
	}

	s.Run("unhappy paths", func() {
		errorCases := map[string]struct {
			ctx context.Context
			id  uuid.UUID
			fn  func(ctx context.Context, id uuid.UUID) ([]*models.Note, error)
		}{
			"anonymous user": {
				ctx: context.Background(),
				id:  idFound,
				fn:  NewFetchNotes(cfg, fetcher, AuthorizeRequireGRTJobCode),
			},
			"not reviewer": {
				ctx: appcontext.WithPrincipal(context.Background(), testhelpers.NewRequesterPrincipal()),
				id:  idFound,
				fn:  NewFetchNotes(cfg, fetcher, AuthorizeRequireGRTJobCode),
			},
			"errors when talking to storage layer": {
				ctx: appcontext.WithPrincipal(context.Background(), testhelpers.NewReviewerPrincipal()),
				id:  idError,
				fn:  NewFetchNotes(cfg, fetcher, AuthorizeRequireGRTJobCode),
			},
		}

		for name, tc := range errorCases {
			s.Run(name, func() {
				_, err := tc.fn(tc.ctx, tc.id)
				s.Error(err)
			})
		}
	})

	s.Run("happy paths", func() {
		happyCases := map[string]struct {
			id    uuid.UUID
			fn    func(ctx context.Context, id uuid.UUID) ([]*models.Note, error)
			count int
		}{
			"zero length": {
				id:    uuid.New(),
				fn:    NewFetchNotes(cfg, fetcher, AuthorizeRequireGRTJobCode),
				count: 0,
			},
			"several results": {
				id:    uuid.New(),
				fn:    NewFetchNotes(cfg, fetcher, AuthorizeRequireGRTJobCode),
				count: 0,
			},
		}

		for name, tc := range happyCases {
			s.Run(name, func() {
				results, err := tc.fn(
					appcontext.WithPrincipal(context.Background(), testhelpers.NewReviewerPrincipal()),
					tc.id,
				)
				s.NoError(err)
				s.Equal(tc.count, len(results))
			})
		}
	})

}
