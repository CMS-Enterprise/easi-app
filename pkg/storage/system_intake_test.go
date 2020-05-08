package storage

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func newSystemIntake() models.SystemIntake {
	return models.SystemIntake{
		ID:                      uuid.New(),
		EUAUserID:               testhelpers.RandomEUAID(),
		Status:                  models.SystemIntakeStatusDRAFT,
		Requester:               null.StringFrom("Test Requester"),
		Component:               null.StringFrom("Test Component"),
		BusinessOwner:           null.StringFrom("Test Business Owner"),
		BusinessOwnerComponent:  null.StringFrom("Test Business Owner Component"),
		ProductManager:          null.StringFrom("Test Product Manager"),
		ProductManagerComponent: null.StringFrom("Test Product Manager Component"),
		ISSO:                    null.StringFrom("Test ISSO"),
		TRBCollaborator:         null.StringFrom("Test TRB Collaborator"),
		OITSecurityCollaborator: null.StringFrom("Test OIT Collaborator"),
		EACollaborator:          null.StringFrom("Test EA Collaborator"),
		ProjectName:             null.StringFrom("Test Project Name"),
		ExistingFunding:         null.BoolFrom(true),
		FundingSource:           null.StringFrom("123456"),
		BusinessNeed:            null.StringFrom("Test Business Need"),
		Solution:                null.StringFrom("Test Solution"),
		ProcessStatus:           null.StringFrom("Just an idea"),
		EASupportRequest:        null.BoolFrom(false),
		ExistingContract:        null.StringFrom("Yes"),
	}
}

func (s StoreTestSuite) TestSaveSystemIntake() {
	s.Run("save a new system intake", func() {
		intake := newSystemIntake()

		err := s.store.SaveSystemIntake(&intake)

		s.NoError(err, "failed to save system intake")
		var actualIntake models.SystemIntake
		err = s.db.Get(&actualIntake, "SELECT * FROM system_intake WHERE id=$1", intake.ID)
		s.NoError(err, "failed to fetch saved intake")
		s.Equal(actualIntake, intake)
	})

	partialIntake := models.SystemIntake{}
	s.Run("cannot save without EUA ID", func() {
		id, _ := uuid.NewUUID()
		partialIntake.ID = id
		partialIntake.Status = models.SystemIntakeStatusDRAFT

		err := s.store.SaveSystemIntake(&partialIntake)

		s.Error(err)
		s.Equal("pq: new row for relation \"system_intake\" violates check constraint \"eua_id_check\"", err.Error())
	})

	euaTests := []string{
		"f",
		"F",
		"5CHAR",
		"$BAD",
	}
	for _, tc := range euaTests {
		s.Run(fmt.Sprintf("cannot save with invalid EUA ID: %s", tc), func() {
			partialIntake.EUAUserID = "F"

			err := s.store.SaveSystemIntake(&partialIntake)

			s.Error(err)
			s.Equal("pq: new row for relation \"system_intake\" violates check constraint \"eua_id_check\"", err.Error())
		})
	}

	s.Run("cannot save with invalid status", func() {
		partialIntake.EUAUserID = "FAKE"
		partialIntake.Status = "fakeStatus"

		err := s.store.SaveSystemIntake(&partialIntake)

		s.Error(err)
		s.Equal("pq: invalid input value for enum system_intake_status: \"fakeStatus\"", err.Error())
	})

	s.Run("save a partial system intake", func() {
		partialIntake.Status = models.SystemIntakeStatusDRAFT
		partialIntake.Requester = null.StringFrom("Test Requester")

		err := s.store.SaveSystemIntake(&partialIntake)

		s.NoError(err, "failed to save system intake")
		var actualIntake models.SystemIntake
		err = s.db.Get(&actualIntake, "SELECT * FROM system_intake WHERE id=$1", partialIntake.ID)
		s.NoError(err, "failed to fetch saved intake")
		s.Equal(actualIntake, partialIntake)
	})

	s.Run("update a partial system intake", func() {
		partialIntake.Requester = null.StringFrom("Fix Requester")

		err := s.store.SaveSystemIntake(&partialIntake)

		s.NoError(err, "failed to save system intake")
		var actualIntake models.SystemIntake
		err = s.db.Get(&actualIntake, "SELECT * FROM system_intake WHERE id=$1", partialIntake.ID)
		s.NoError(err, "failed to fetch saved intake")
		s.Equal(actualIntake, partialIntake)
	})

	s.Run("EUA ID will not update", func() {
		originalEUA := partialIntake.EUAUserID
		partialIntake.EUAUserID = "NEWS"

		err := s.store.SaveSystemIntake(&partialIntake)

		s.NoError(err, "failed to save system intake")
		var actualIntake models.SystemIntake
		err = s.db.Get(&actualIntake, "SELECT * FROM system_intake WHERE id=$1", partialIntake.ID)
		s.NoError(err, "failed to fetch saved intake")
		s.Equal(originalEUA, actualIntake.EUAUserID)
	})
}

func (s StoreTestSuite) TestFetchSystemIntakeByID() {
	s.Run("golden path to fetch a system intake", func() {
		intake := newSystemIntake()
		id := intake.ID
		tx := s.db.MustBegin()
		_, err := tx.NamedExec("INSERT INTO system_intake (id, eua_user_id, status) VALUES (:id, :eua_user_id, :status)", &intake)
		s.NoError(err)
		err = tx.Commit()
		s.NoError(err)

		fetched, err := s.store.FetchSystemIntakeByID(id)

		s.NoError(err, "failed to fetch system intake")
		s.Equal(intake.ID, fetched.ID)
		s.Equal(intake.EUAUserID, fetched.EUAUserID)
	})

	s.Run("cannot without an ID that exists in the db", func() {
		badUUID, _ := uuid.Parse("")
		fetched, err := s.store.FetchSystemIntakeByID(badUUID)

		s.Error(err)
		s.Equal("sql: no rows in result set", err.Error())
		s.Equal(&models.SystemIntake{}, fetched)
	})
}

func (s StoreTestSuite) TestFetchSystemIntakesByEuaID() {
	s.Run("golden path to fetch system intakes", func() {
		intake := NewSystemIntake()
		intake2 := NewSystemIntake()
		intake2.EUAUserID = intake.EUAUserID
		tx := s.db.MustBegin()
		_, err := tx.NamedExec("INSERT INTO system_intake (id, eua_user_id, status) VALUES (:id, :eua_user_id, :status)", &intake)
		s.NoError(err)
		_, err = tx.NamedExec("INSERT INTO system_intake (id, eua_user_id, status) VALUES (:id, :eua_user_id, :status)", &intake2)
		s.NoError(err)
		err = tx.Commit()
		s.NoError(err)

		fetched, err := s.store.FetchSystemIntakesByEuaID(intake.EUAUserID)

		s.NoError(err, "failed to fetch system intakes")
		s.Len(fetched, 2)
		s.Equal(intake.EUAUserID, fetched[0].EUAUserID)
	})

	s.Run("fetches no results with other EUA ID", func() {
		fetched, err := s.store.FetchSystemIntakesByEuaID(testhelpers.RandomEUAID())

		s.NoError(err)
		s.Len(fetched, 0)
		s.Equal(models.SystemIntakes{}, fetched)
	})
}
