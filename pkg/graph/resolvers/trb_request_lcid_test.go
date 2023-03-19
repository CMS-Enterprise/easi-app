package resolvers

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
)

// TestTRBRequestLCIDCrud tests creation/deletion of TRB request LCIDs
func (s *ResolverSuite) TestTRBRequestLCID() {
	ctx := context.Background()
	anonEua := "ANON"
	store := s.testConfigs.Store

	trbRequest := models.NewTRBRequest(anonEua)
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.State = models.TRBRequestStateOpen
	trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.fetchUserInfoStub, store)
	s.NoError(err)

	s.Run("create/read/delete TRB request LCIDs", func() {
		lcids := []string{"111111", "111222", "111333"}
		for _, lcid := range lcids {
			_, err := CreateTRBRequestLCID(ctx, store, trbRequest.ID, lcid)
			s.NoError(err)
		}

		trbLcids, err := GetTRBRequestLCIDsByTRBRequestID(ctx, store, trbRequest.ID)
		s.NoError(err)
		s.EqualValues(3, len(trbLcids))

		for i, lcid := range lcids {
			s.EqualValues(lcid, trbLcids[i].LCID)
		}

		_, err = DeleteTRBRequestLCID(ctx, store, trbRequest.ID, "111222")
		s.NoError(err)
		trbLcids, err = GetTRBRequestLCIDsByTRBRequestID(ctx, store, trbRequest.ID)
		s.NoError(err)
		s.EqualValues(2, len(trbLcids))
		s.EqualValues("111111", trbLcids[0].LCID)
		s.EqualValues("111333", trbLcids[1].LCID)
	})
}
