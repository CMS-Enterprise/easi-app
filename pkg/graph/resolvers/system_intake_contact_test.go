package resolvers

import (
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
)

func (s *ResolverSuite) TestCreateSystemIntakeContact() {
	// intake := s.createNewIntake()
	intake := s.createNewIntakeWithResolver()
	createInput := models.CreateSystemIntakeContactInput{
		SystemIntakeID: intake.ID,
		EuaUserID:      "USR1",
		Component:      models.SystemIntakeContactComponentCenterForClinicalStandardsAndQualityCcsq,
		Roles:          []models.SystemIntakeContactRole{models.SystemIntakeContactRoleProductOwner, models.SystemIntakeContactRoleCloudNavigator},
		IsRequester:    false,
	}

	createdContact, err := CreateSystemIntakeContact(s.ctxWithNewDataloaders(), s.testConfigs.Logger, s.testConfigs.Principal, s.testConfigs.Store, createInput, userhelpers.GetUserInfoAccountInfoWrapperFunc(s.fetchUserInfoStub))
	s.NoError(err)
	s.NotNil(createdContact.SystemIntakeContact)

	account, err := GetUserAccountByID(s.ctxWithNewDataloaders(), createdContact.SystemIntakeContact.UserID)
	s.NoError(err)
	s.Equal(createInput.EuaUserID, account.Username)

	s.EqualValues(createInput.SystemIntakeID, createdContact.SystemIntakeContact.SystemIntakeID)
	s.EqualValues(createInput.Component, createdContact.SystemIntakeContact.Component)
	s.EqualValues(createInput.Roles, createdContact.SystemIntakeContact.Roles)
	s.EqualValues(createInput.IsRequester, createdContact.SystemIntakeContact.IsRequester)

	s.Run("fetches system intake contacts", func() {
		fetched, err := GetSystemIntakeContactsBySystemIntakeID(s.ctxWithNewDataloaders(), intake.ID)
		s.NoError(err)
		s.Len(fetched.AllContacts, 2) // includes the requester created with the intake
	})
}
