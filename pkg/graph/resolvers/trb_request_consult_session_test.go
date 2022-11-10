package resolvers

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
)

// TestCreateTRBRequestConsultSession makes a new TRB request
func (s *ResolverSuite) TestCreateTRBRequestConsultSession() {
	ctx := context.Background()
	anonEua := "ANON"
	trbRequest := models.NewTRBRequest(anonEua)
	trbRequest.Type = models.TRBTNeedHelp
	trbRequest.Status = models.TRBSOpen
	trbRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)

	s.Run("create/update/fetch TRB request consult sessions", func() {
		// fetch the consult session
		fetched, err := GetTRBRequestConsultSessionByTRBRequestID(ctx, s.testConfigs.Store, trbRequest.ID)
		s.NoError(err)
		s.NotNil(fetched)

		// sessionTime, _ := time.Parse(time.RFC3339, "2030-10-10T12:00:00+00:00")
		// sessionNotes := "Make sure to bring a pen and paper and some fruit snacks"
		// consultSession := models.TRBRequestConsultSession{
		// 	TRBRequestID: trbRequest.ID,
		// 	SessionTime:  &sessionTime,
		// 	Notes:        &sessionNotes,
		// }
		// consultSession.CreatedBy = anonEua
		// createdConsultSession, err := CreateTRBRequestConsultSession(ctx, s.testConfigs.Store, &consultSession)
		// s.NoError(err)

		// createdConsultSession.Role = models.PersonRoleCloudNavigator
		// createdConsultSession.ModifiedBy = &anonEua
		// updatedConsultSession, err := UpdateTRBRequestConsultSession(ctx, s.testConfigs.Store, createdConsultSession)
		// s.NoError(err)
		// s.EqualValues(updatedConsultSession.Role, models.PersonRoleCloudNavigator)
		// s.EqualValues(updatedConsultSession.ModifiedBy, &anonEua)

		// createdConsultSession.Component = "The Citadel of Ricks"
		// createdConsultSession.ModifiedBy = &anonEua
		// updatedConsultSession, err = UpdateTRBRequestConsultSession(ctx, s.testConfigs.Store, createdConsultSession)
		// s.NoError(err)
		// s.EqualValues(updatedConsultSession.Component, "The Citadel of Ricks")
		// s.EqualValues(updatedConsultSession.ModifiedBy, &anonEua)
	})
}
