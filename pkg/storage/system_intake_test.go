package storage

import (
	"context"
	"fmt"
	"time"

	"github.com/facebookgo/clock"
	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

const insertBasicIntakeSQL = "INSERT INTO system_intakes (id, eua_user_id, request_type, requester, archived_at) VALUES (:id, :eua_user_id, :request_type, :requester, :archived_at)"
const insertRelatedBizCaseSQL = `INSERT INTO business_cases (id, eua_user_id, requester, system_intake)
	VALUES(:id, :eua_user_id, :requester, :system_intake)`

func (s *StoreTestSuite) TestCreateSystemIntake() {
	ctx := context.Background()

	s.Run("create a new system intake", func() {
		intake := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			RequestType: models.SystemIntakeRequestTypeNEW,
			Requester:   "Test requester",
		}

		created, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)
		s.Equal(intake.EUAUserID, created.EUAUserID)
		s.Equal(intake.Requester, created.Requester)
		epochTime := time.Unix(0, 0)
		s.Equal(intake.CreatedAt, &epochTime)
		s.Equal(intake.UpdatedAt, &epochTime)
		s.False(created.ID == uuid.Nil)
	})

	euaTests := []string{
		"f",
		"F",
		"5CHAR",
		"$BAD",
	}
	for _, tc := range euaTests {
		s.Run(fmt.Sprintf("cannot save with invalid EUA ID: %s", tc), func() {
			partialIntake := models.SystemIntake{
				RequestType: models.SystemIntakeRequestTypeNEW,
			}
			partialIntake.EUAUserID = null.StringFrom(tc)

			_, err := s.store.CreateSystemIntake(ctx, &partialIntake)

			s.Error(err)
			s.Equal("pq: new row for relation \"system_intakes\" violates check constraint \"eua_id_check\"", err.Error())
		})
	}
}

func (s *StoreTestSuite) TestUpdateSystemIntake() {
	ctx := context.Background()

	s.Run("update an existing system intake", func() {
		intake, err := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			RequestType: models.SystemIntakeRequestTypeNEW,
			Requester:   "Test requester",
		})
		s.NoError(err)
		now := time.Now()

		intake.UpdatedAt = &now
		intake.ISSO = null.StringFrom("test isso")

		updated, err := s.store.UpdateSystemIntake(ctx, intake)
		s.NoError(err, "failed to update system intake")
		s.Equal(intake.ISSO, updated.ISSO)
	})

	s.Run("EUA ID will not update", func() {
		originalIntake := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			RequestType: models.SystemIntakeRequestTypeNEW,
			Requester:   "Test requester",
		}
		createdIntake, err := s.store.CreateSystemIntake(ctx, &originalIntake)
		s.NoError(err)
		originalEUA := originalIntake.EUAUserID
		createdIntake.EUAUserID = null.StringFrom("NEWS")

		_, err = s.store.UpdateSystemIntake(ctx, createdIntake)
		s.NoError(err, "failed to update system intake")

		updated, err := s.store.FetchSystemIntakeByID(ctx, originalIntake.ID)
		s.NoError(err)

		s.Equal(originalEUA, updated.EUAUserID)
	})

	s.Run("Lifecycle fields only upon update", func() {
		now := time.Now()
		originalIntake := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			RequestType: models.SystemIntakeRequestTypeNEW,
			Requester:   "Test requester",

			// These fields should NOT be written during a create
			LifecycleID:        null.StringFrom("ABCDEF"),
			LifecycleExpiresAt: &now,
			LifecycleScope:     models.HTMLPointer("ABCDEF"),
			DecisionNextSteps:  models.HTMLPointer("ABCDEF"),
		}
		_, err := s.store.CreateSystemIntake(ctx, &originalIntake)
		s.NoError(err)

		partial, err := s.store.FetchSystemIntakeByID(ctx, originalIntake.ID)
		s.NoError(err)
		s.Empty(partial.LifecycleID)
		s.Empty(partial.LifecycleExpiresAt)
		s.Empty(partial.LifecycleScope)
		s.Empty(partial.DecisionNextSteps)

		// Update
		lcid := "H200110" // historical first LCID issued on 2020-01-11
		content1 := models.HTMLPointer("ABC")
		content2 := models.HTMLPointer("XYZ")
		partial.LifecycleID = null.StringFrom(lcid)
		partial.LifecycleExpiresAt = &now
		partial.LifecycleScope = content1
		partial.DecisionNextSteps = content2

		_, err = s.store.UpdateSystemIntake(ctx, partial)
		s.NoError(err, "failed to update system intake")

		updated, err := s.store.FetchSystemIntakeByID(ctx, originalIntake.ID)
		s.NoError(err)

		s.Equal(lcid, updated.LifecycleID.String)
		s.NotEmpty(updated.LifecycleExpiresAt)
		s.Equal(content1, updated.LifecycleScope)
		s.Equal(content2, updated.DecisionNextSteps)
	})

	s.Run("Rejection fields only upon update", func() {
		originalIntake := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			RequestType: models.SystemIntakeRequestTypeNEW,
			Requester:   "Test requester",

			// These fields should NOT be written during a create
			RejectionReason:   models.HTMLPointer("ABCDEF"),
			DecisionNextSteps: models.HTMLPointer("ABCDEF"),
		}
		_, err := s.store.CreateSystemIntake(ctx, &originalIntake)
		s.NoError(err)

		partial, err := s.store.FetchSystemIntakeByID(ctx, originalIntake.ID)
		s.NoError(err)
		s.Empty(partial.RejectionReason)
		s.Empty(partial.DecisionNextSteps)

		// Update
		content1 := models.HTMLPointer("ABC")
		content2 := models.HTMLPointer("XYZ")
		partial.RejectionReason = content1
		partial.DecisionNextSteps = content2

		_, err = s.store.UpdateSystemIntake(ctx, partial)
		s.NoError(err, "failed to update system intake")

		updated, err := s.store.FetchSystemIntakeByID(ctx, originalIntake.ID)
		s.NoError(err)

		s.Equal(content1, updated.RejectionReason)
		s.Equal(content2, updated.DecisionNextSteps)
	})

	s.Run("Update contract details information", func() {
		originalIntake := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			RequestType: models.SystemIntakeRequestTypeNEW,
			Requester:   "Test requester",

			ProcessStatus:      null.StringFrom("ABCDEF"),
			ExistingFunding:    null.BoolFrom(false),
			FundingNumber:      null.StringFrom(""),
			FundingSource:      null.StringFrom(""),
			CostIncrease:       null.StringFrom("YES"),
			CostIncreaseAmount: null.StringFrom("$10 million"),
			ExistingContract:   null.StringFrom("NOT_NEEDED"),
		}
		_, err := s.store.CreateSystemIntake(ctx, &originalIntake)
		s.NoError(err)

		partial, err := s.store.FetchSystemIntakeByID(ctx, originalIntake.ID)
		s.NoError(err)

		// Update
		processStatus := "Just an idea"
		existingFunding := true
		fundingNumber := "123456"
		fundingSource := "CLIA"
		existingContract := "IN_PROGRESS"
		contractor := "TrussWorks, Inc."
		contractVehicle := "Fixed price contract"
		now := time.Now()
		partial.ProcessStatus = null.StringFrom(processStatus)
		partial.ExistingFunding = null.BoolFrom(existingFunding)
		partial.FundingNumber = null.StringFrom(fundingNumber)
		partial.FundingSource = null.StringFrom(fundingSource)
		partial.ExistingContract = null.StringFrom(existingContract)
		partial.Contractor = null.StringFrom(contractor)
		partial.ContractVehicle = null.StringFrom(contractVehicle)
		partial.ContractStartDate = &now
		partial.ContractEndDate = &now

		_, err = s.store.UpdateSystemIntake(ctx, partial)
		s.NoError(err, "failed to update system intake")

		updated, err := s.store.FetchSystemIntakeByID(ctx, originalIntake.ID)
		s.NoError(err)

		s.Equal(processStatus, updated.ProcessStatus.String)
		s.Equal(existingFunding, updated.ExistingFunding.Bool)
		s.Equal(fundingNumber, updated.FundingNumber.String)
		s.Equal(fundingSource, updated.FundingSource.String)
		s.Equal(existingContract, updated.ExistingContract.String)
		s.Equal(contractor, updated.Contractor.String)
		s.Equal(contractVehicle, updated.ContractVehicle.String)
		s.NotEmpty(updated.ContractStartDate)
		s.NotEmpty(updated.ContractEndDate)
	})

	s.Run("LifecycleID format", func() {
		originalIntake := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			RequestType: models.SystemIntakeRequestTypeNEW,
			Requester:   "Test requester",
		}

		_, err := s.store.CreateSystemIntake(ctx, &originalIntake)
		s.NoError(err)

		partial, err := s.store.FetchSystemIntakeByID(ctx, originalIntake.ID)
		s.NoError(err)

		fails := []string{
			"20001",    // short
			"2000110",  // long
			"20001A",   // non-numeric
			"A20001",   // short with prefix
			"A2000110", // long with prefix
			"AA123456", // too many character prefix
		}

		for _, fail := range fails {
			partial.LifecycleID = null.StringFrom(fail)
			_, err = s.store.UpdateSystemIntake(ctx, partial)
			s.Error(err, "expected lcid format error")
		}
	})

	s.Run("exhaust lifecycleID generation", func() {
		for ix := 0; ix < 10; ix++ {
			original := models.SystemIntake{
				EUAUserID:   testhelpers.RandomEUAIDNull(),
				RequestType: models.SystemIntakeRequestTypeNEW,
				Requester:   fmt.Sprintf("LCID Exhaust %d", ix),
			}

			_, err := s.store.CreateSystemIntake(ctx, &original)
			s.NoError(err)

			partial, err := s.store.FetchSystemIntakeByID(ctx, original.ID)
			s.NoError(err)

			lcid, err := s.store.GenerateLifecycleID(ctx)
			s.NoError(err)

			partial.LifecycleID = null.StringFrom(lcid)
			_, err = s.store.UpdateSystemIntake(ctx, partial)
			s.NoError(err)
		}

		// the 11th attempt should generate an LCID that looks like "2136510" (~"YYddd10"),
		// and this should violate the db constraint of a 6-digit LCID
		original := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			RequestType: models.SystemIntakeRequestTypeNEW,
			Requester:   "LCID Exhaust 10",
		}

		_, err := s.store.CreateSystemIntake(ctx, &original)
		s.NoError(err)

		partial, err := s.store.FetchSystemIntakeByID(ctx, original.ID)
		s.NoError(err)

		lcid, err := s.store.GenerateLifecycleID(ctx)
		s.NoError(err)

		partial.LifecycleID = null.StringFrom(lcid)
		_, err = s.store.UpdateSystemIntake(ctx, partial)
		s.Error(err)
	})

	s.Run("new backfill fields", func() {
		t1 := clock.NewMock().Now().UTC()
		t2 := clock.NewMock().Now().UTC()
		original := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			RequestType: models.SystemIntakeRequestTypeNEW,

			ProjectAcronym: null.StringFrom("JIT"),
			GRTDate:        &t1,
			GRBDate:        &t2,
		}

		_, err := s.store.CreateSystemIntake(ctx, &original)
		s.NoError(err)

		partial, err := s.store.FetchSystemIntakeByID(ctx, original.ID)
		s.NoError(err)
		s.Equal(original.ProjectAcronym.ValueOrZero(), partial.ProjectAcronym.ValueOrZero())
		s.Equal(original.GRTDate.String(), partial.GRTDate.String())
		s.Equal(original.GRBDate.String(), partial.GRBDate.String())

		n1 := t1.Add(time.Hour)
		n2 := t2.Add(time.Minute)
		partial.ProjectAcronym = null.StringFrom("RBG")
		partial.GRTDate = &n1
		partial.GRBDate = &n2

		_, err = s.store.UpdateSystemIntake(ctx, partial)
		s.NoError(err)

		finished, err := s.store.FetchSystemIntakeByID(ctx, original.ID)
		s.NoError(err)

		s.Equal(partial.ProjectAcronym.ValueOrZero(), finished.ProjectAcronym.ValueOrZero())
		s.NotEqual(original.ProjectAcronym.ValueOrZero(), finished.ProjectAcronym.ValueOrZero())
		s.Equal(partial.GRTDate.String(), finished.GRTDate.String())
		s.NotEqual(original.GRTDate.String(), finished.GRTDate.String())
		s.Equal(partial.GRBDate.String(), finished.GRBDate.String())
		s.NotEqual(original.GRBDate.String(), finished.GRBDate.String())
	})
}

func (s *StoreTestSuite) TestLifecyclePrefixBoundaries() {
	easternTZ, err := time.LoadLocation("America/New_York")
	if err != nil {
		s.Fail("couldn't load EST: %v\n", err)
	}

	testCases := map[string]struct {
		ts       time.Time
		expected string
	}{
		"still previous year": {
			ts:       time.Date(2011, time.January, 1, 0, 1, 0, 0, time.UTC),
			expected: "10365",
		},
		"very beginning of year": {
			ts:       time.Date(2013, time.January, 1, 0, 0, 1, 0, easternTZ),
			expected: "13001",
		},
		"very end of year": {
			ts:       time.Date(2013, time.December, 31, 23, 59, 0, 0, easternTZ),
			expected: "13365",
		},
		"acceptance criteria": {
			ts:       time.Date(2020, time.September, 29, 12, 1, 0, 0, easternTZ),
			expected: "20273",
		},
	}

	for name, tc := range testCases {
		s.Run(fmt.Sprintf("%s %s", name, tc.ts), func() {
			out := generateLifecyclePrefix(tc.ts, easternTZ)
			s.Equal(tc.expected, out, tc.ts)
		})
	}
}

func (s *StoreTestSuite) TestFetchSystemIntakeByID() {
	ctx := context.Background()

	s.Run("golden path to fetch a system intake", func() {
		intake := testhelpers.NewSystemIntake()
		id := intake.ID

		_, err := s.db.NamedExec(insertBasicIntakeSQL, &intake)
		s.NoError(err)

		fetched, err := s.store.FetchSystemIntakeByID(ctx, id)

		s.NoError(err, "failed to fetch system intake")
		s.Equal(intake.ID, fetched.ID)
		s.Equal(intake.EUAUserID, fetched.EUAUserID)
	})

	s.Run("cannot without an ID that exists in the db", func() {
		badUUID, _ := uuid.Parse("")
		fetched, err := s.store.FetchSystemIntakeByID(ctx, badUUID)

		s.Error(err)
		s.IsType(&apperrors.ResourceNotFoundError{}, err)
		s.Nil(fetched)
	})

	s.Run("fetches biz case id if exists", func() {
		intake := testhelpers.NewSystemIntake()
		id := intake.ID
		bizCase := testhelpers.NewBusinessCase(id)

		err := sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
			_, err := tx.NamedExec(insertBasicIntakeSQL, &intake)
			s.NoError(err)
			_, err = tx.NamedExec(insertRelatedBizCaseSQL, &bizCase)
			s.NoError(err)

			return nil
		})
		s.NoError(err)

		fetched, err := s.store.FetchSystemIntakeByID(ctx, id)

		s.NoError(err, "failed to fetch system intake")
		s.Equal(intake.ID, fetched.ID)
		s.Equal(&bizCase.ID, fetched.BusinessCaseID)
	})
}

func (s *StoreTestSuite) TestFetchSystemIntakes() {
	s.Run("fetches all intakes", func() {
		ctx := context.Background()

		// seed the db with intakes that we DO expect to be returned
		expected := map[string]bool{}
		for ix := 0; ix < 5; ix++ {
			intake := testhelpers.NewSystemIntake()
			result, err := s.store.CreateSystemIntake(ctx, &intake)
			s.NoError(err)
			expected[result.ID.String()] = false
		}

		intakes, err := s.store.FetchSystemIntakes(ctx)
		s.NoError(err)

		for _, intake := range intakes {
			id := intake.ID.String()
			expected[id] = true
		}

		// failure if we did not see all the expected seeded not-WITHDRAWN intakes
		for id, found := range expected {
			s.True(found, "did not receive expected intake", id)
		}
	})
}

func (s *StoreTestSuite) TestUpdateAdminLead() {
	ctx := context.Background()

	s.Run("golden path to update admin lead", func() {
		intake := testhelpers.NewSystemIntake()

		_, err := s.db.NamedExec(insertBasicIntakeSQL, &intake)
		s.NoError(err)

		adminLead := "Test Lead"

		_, err = s.store.UpdateAdminLead(ctx, intake.ID, adminLead)
		fetchedIntake, _ := s.store.FetchSystemIntakeByID(ctx, intake.ID)

		s.NoError(err, "failed to fetch system intakes")
		s.Equal(fetchedIntake.AdminLead.String, adminLead)
	})
}

func (s *StoreTestSuite) TestUpdateReviewDates() {
	ctx := context.Background()

	s.Run("update both dates", func() {
		intake := testhelpers.NewSystemIntake()

		_, err := s.db.NamedExec(insertBasicIntakeSQL, &intake)
		s.NoError(err)

		grbDate, _ := time.Parse(time.RFC3339, "2021-12-22T00:00:00Z")
		grtDate, _ := time.Parse(time.RFC3339, "2022-01-02T00:00:00Z")

		_, err = s.store.UpdateReviewDates(ctx, intake.ID, &grbDate, &grtDate)
		fetchedIntake, _ := s.store.FetchSystemIntakeByID(ctx, intake.ID)

		s.NoError(err, "failed to fetch system intakes")
		s.Equal(fetchedIntake.GRBDate.Format("2006-01-02"), "2021-12-22")
		s.Equal(fetchedIntake.GRTDate.Format("2006-01-02"), "2022-01-02")
	})

	s.Run("update just GRB", func() {
		intake := testhelpers.NewSystemIntake()

		_, err := s.db.NamedExec(insertBasicIntakeSQL, &intake)
		s.NoError(err)

		grbDate, _ := time.Parse(time.RFC3339, "2021-12-22T00:00:00Z")
		updatedIntake, err := s.store.UpdateReviewDates(ctx, intake.ID, &grbDate, nil)

		s.NoError(err, "failed to fetch system intakes")
		s.Equal(updatedIntake.GRBDate.Format("2006-01-02"), "2021-12-22")
		s.Nil(updatedIntake.GRTDate)
	})

	s.Run("update just GRT", func() {
		intake := testhelpers.NewSystemIntake()

		_, err := s.db.NamedExec(insertBasicIntakeSQL, &intake)
		s.NoError(err)

		grtDate, _ := time.Parse(time.RFC3339, "2022-01-02T00:00:00Z")
		updatedIntake, err := s.store.UpdateReviewDates(ctx, intake.ID, nil, &grtDate)

		s.NoError(err, "failed to fetch system intakes")
		s.Nil(updatedIntake.GRBDate)
		s.Equal(updatedIntake.GRTDate.Format("2006-01-02"), "2022-01-02")
	})
}

func (s *StoreTestSuite) TestUpdateSystemIntakeLinkedCedarSystem() {
	ctx := context.Background()

	s.Run("update linked CEDAR system ID", func() {
		intake := testhelpers.NewSystemIntake()

		_, err := s.db.NamedExec(insertBasicIntakeSQL, &intake)
		s.NoError(err)

		cedarSystemID := null.StringFrom("555-55-5")
		updatedIntake, err := s.store.UpdateSystemIntakeLinkedCedarSystem(ctx, intake.ID, cedarSystemID)

		s.NoError(err)
		s.Equal(updatedIntake.CedarSystemID, cedarSystemID)
	})

	s.Run("update linked CEDAR system ID to null", func() {
		intake := testhelpers.NewSystemIntake()

		_, err := s.db.NamedExec(insertBasicIntakeSQL, &intake)
		s.NoError(err)

		var cedarSystemID *string
		updatedIntake, err := s.store.UpdateSystemIntakeLinkedCedarSystem(ctx, intake.ID, null.StringFromPtr(cedarSystemID))

		s.NoError(err)
		s.False(updatedIntake.CedarSystemID.Valid)
	})
}
