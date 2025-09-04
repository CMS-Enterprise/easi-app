package storage

// import (
// 	"context"

// 	"github.com/cms-enterprise/easi-app/pkg/models"
// 	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
// )

// func (s *StoreTestSuite) TestCreateSystemIntakeContact() {
// 	ctx := context.Background()
// 	intake := testhelpers.NewSystemIntake()
// 	_, err := s.store.CreateSystemIntake(ctx, &intake)
// 	s.NoError(err)

// 	// TODO move this test to resolvers
// 	s.Run("create a system intake contact", func() {
// 		contact := models.SystemIntakeContact{
// 			// EUAUserID:      "ANON",
// 			SystemIntakeID: intake.ID,
// 		}
// 		createdContact, err := s.store.CreateSystemIntakeContact(ctx, &contact)
// 		s.NoError(err)

// 		createdContact.Roles = []models.SystemIntakeContactRole{models.SystemIntakeContactRoleProductOwner, models.SystemIntakeContactRoleCloudNavigator}
// 		_, err = s.store.UpdateSystemIntakeContact(ctx, createdContact)
// 		s.NoError(err)
// 	})

// 	s.Run("fetches system intake contacts", func() {
// 		fetched, err := s.store.FetchSystemIntakeContactsBySystemIntakeID(ctx, intake.ID)
// 		s.NoError(err)
// 		s.True(len(fetched) > 0)
// 	})
// }

// func (s *StoreTestSuite) TestFetchSystemIntakeContactsBySystemIntakeID() {
// 	// TODO move this test to resolvers
// 	ctx := context.Background()

// 	// create intake
// 	intake := testhelpers.NewSystemIntake()
// 	createdIntake, err := s.store.CreateSystemIntake(ctx, &intake)
// 	s.NoError(err)

// 	// create system intake contacts
// 	_, err = s.store.CreateSystemIntakeContact(ctx, &models.SystemIntakeContact{
// 		// EUAUserID:      "AAAA",
// 		SystemIntakeID: createdIntake.ID,
// 		Component:      "Component",
// 		Roles:          []models.SystemIntakeContactRole{models.SystemIntakeContactRoleProductOwner, models.SystemIntakeContactRoleCloudNavigator},
// 	})
// 	s.NoError(err)

// 	contacts, err := s.store.FetchSystemIntakeContactsBySystemIntakeID(ctx, createdIntake.ID)
// 	s.NoError(err)
// 	s.Len(contacts, 1)

// 	// set that eua to NULL
// 	_, err = s.db.ExecContext(ctx, "UPDATE system_intake_contacts SET eua_user_id = NULL, common_name = 'sam' WHERE system_intake_id = $1", createdIntake.ID)
// 	s.NoError(err)

// 	contacts, err = s.store.FetchSystemIntakeContactsBySystemIntakeID(ctx, createdIntake.ID)
// 	s.NoError(err)
// 	s.Empty(contacts)
// }
