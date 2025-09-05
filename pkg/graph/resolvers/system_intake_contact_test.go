package resolvers

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
)

func (s *ResolverSuite) TestCreateSystemIntakeContact() {
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
		fetched, err := SystemIntakeContactsGetBySystemIntakeID(s.ctxWithNewDataloaders(), intake.ID)
		s.NoError(err)
		s.Len(fetched.AllContacts, 2) // includes the requester created with the intake
	})
}

func (s *ResolverSuite) TestSystemIntakeContactDelete() {
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
	deleteContact, err := SystemIntakeContactDelete(s.ctxWithNewDataloaders(), s.testConfigs.Store, createdContact.SystemIntakeContact.ID)
	s.NoError(err)
	s.EqualValues(createdContact.SystemIntakeContact.ID, deleteContact.ID)

	retDel, err := SystemIntakeContactGetByID(s.ctxWithNewDataloaders(), createdContact.SystemIntakeContact.ID)
	s.Nil(retDel)
	s.NoError(err)
}

func (s *ResolverSuite) TestSystemIntakeContactUpdate() {
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

	updateStruct := models.UpdateSystemIntakeContactInput{
		ID:          createdContact.SystemIntakeContact.ID,
		Component:   models.SystemIntakeContactComponentCmsWide,
		Roles:       []models.SystemIntakeContactRole{models.SystemIntakeContactRoleBusinessOwner},
		IsRequester: false,
	}
	updatedContact, err := UpdateSystemIntakeContact(s.ctxWithNewDataloaders(), s.testConfigs.Logger, s.testConfigs.Principal, s.testConfigs.Store, updateStruct, userhelpers.GetUserInfoAccountInfoWrapperFunc(s.fetchUserInfoStub))

	s.NoError(err)
	s.NotNil(updatedContact.SystemIntakeContact)
	s.EqualValues(updateStruct.Component, updatedContact.SystemIntakeContact.Component)
	s.EqualValues(updateStruct.Roles, updatedContact.SystemIntakeContact.Roles)
	s.EqualValues(updateStruct.IsRequester, updatedContact.SystemIntakeContact.IsRequester)
}

func (s *ResolverSuite) TestSystemIntakeContactRequesterConstraints() {

	// 1. Create Intake
	intake := s.createNewIntakeWithResolver()

	// 2. Fetch contacts, ensure only requester
	fetched, err := SystemIntakeContactsGetBySystemIntakeID(s.ctxWithNewDataloaders(), intake.ID)
	s.NoError(err)
	s.Len(fetched.AllContacts, 1)
	s.True(fetched.AllContacts[0].IsRequester)

	requesterContact := fetched.AllContacts[0]

	// 3. Attempt to delete requester, ensure error
	_, err = SystemIntakeContactDelete(s.ctxWithNewDataloaders(), s.testConfigs.Store, requesterContact.ID)
	s.Error(err)

	// 4. Create another contact with isRequester false
	createInput := models.CreateSystemIntakeContactInput{
		SystemIntakeID: intake.ID,
		EuaUserID:      "USR2",
		Component:      models.SystemIntakeContactComponentCmsWide,
		Roles:          []models.SystemIntakeContactRole{models.SystemIntakeContactRoleBusinessOwner},
		IsRequester:    false,
	}
	createdContact, err := CreateSystemIntakeContact(s.ctxWithNewDataloaders(), s.testConfigs.Logger, s.testConfigs.Principal, s.testConfigs.Store, createInput, userhelpers.GetUserInfoAccountInfoWrapperFunc(s.fetchUserInfoStub))
	s.NoError(err)
	s.NotNil(createdContact.SystemIntakeContact)

	// 5. Update that contact to isRequester true, ensure previous requester is now not requester
	updateInput := models.UpdateSystemIntakeContactInput{
		ID:          createdContact.SystemIntakeContact.ID,
		Component:   createdContact.SystemIntakeContact.Component,
		Roles:       createdContact.SystemIntakeContact.Roles,
		IsRequester: true,
	}
	updatedContact, err := UpdateSystemIntakeContact(s.ctxWithNewDataloaders(), s.testConfigs.Logger, s.testConfigs.Principal, s.testConfigs.Store, updateInput, userhelpers.GetUserInfoAccountInfoWrapperFunc(s.fetchUserInfoStub))
	s.NoError(err)
	s.NotNil(updatedContact.SystemIntakeContact)
	s.True(updatedContact.SystemIntakeContact.IsRequester)

	// Fetch contacts, ensure only one isRequester
	fetched, err = SystemIntakeContactsGetBySystemIntakeID(s.ctxWithNewDataloaders(), intake.ID)
	s.NoError(err)
	s.Len(fetched.AllContacts, 2)
	isRequesterCount := 0
	var firstContactID uuid.UUID
	for _, c := range fetched.AllContacts {
		if c.IsRequester {
			isRequesterCount++
		}
		if c.ID != updatedContact.SystemIntakeContact.ID {
			firstContactID = c.ID
		}
	}
	s.Equal(1, isRequesterCount)

	// 6. Attempt to delete first contact, ensure success
	deletedContact, err := SystemIntakeContactDelete(s.ctxWithNewDataloaders(), s.testConfigs.Store, firstContactID)
	s.NoError(err)
	s.EqualValues(firstContactID, deletedContact.ID)

	// 7. Fetch contacts, ensure only one contact and isRequester true
	fetched, err = SystemIntakeContactsGetBySystemIntakeID(s.ctxWithNewDataloaders(), intake.ID)
	s.NoError(err)
	s.Len(fetched.AllContacts, 1)
	onlyContact := fetched.AllContacts[0]
	s.EqualValues(createdContact.SystemIntakeContact.ID, onlyContact.ID)
	s.True(onlyContact.IsRequester)

}
