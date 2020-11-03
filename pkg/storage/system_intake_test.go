package storage

import (
	"context"
	"fmt"
	"math/rand"
	"time"

	"github.com/facebookgo/clock"
	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

const insertBasicIntakeSQL = "INSERT INTO system_intake (id, eua_user_id, status, request_type, requester) VALUES (:id, :eua_user_id, :status, :request_type, :requester)"
const insertRelatedBizCaseSQL = `INSERT INTO business_case (id, eua_user_id, status, requester, system_intake)
		VALUES(:id, :eua_user_id, :status, :requester, :system_intake)`

func (s StoreTestSuite) TestCreateSystemIntake() {
	ctx := context.Background()

	s.Run("create a new system intake", func() {
		intake := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAID(),
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
			Requester:   "Test requester",
		}

		created, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)
		s.Equal(intake.EUAUserID, created.EUAUserID)
		s.Equal(intake.Status, created.Status)
		s.Equal(intake.Requester, created.Requester)
		epochTime := time.Unix(0, 0)
		s.Equal(intake.CreatedAt, &epochTime)
		s.Equal(intake.UpdatedAt, &epochTime)
		s.False(created.ID == uuid.Nil)
	})

	s.Run("cannot save without EUA ID", func() {
		partialIntake := models.SystemIntake{
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
		}

		_, err := s.store.CreateSystemIntake(ctx, &partialIntake)

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
			partialIntake := models.SystemIntake{
				Status:      models.SystemIntakeStatusINTAKEDRAFT,
				RequestType: models.SystemIntakeRequestTypeNEW,
			}
			partialIntake.EUAUserID = tc

			_, err := s.store.CreateSystemIntake(ctx, &partialIntake)

			s.Error(err)
			s.Equal("pq: new row for relation \"system_intake\" violates check constraint \"eua_id_check\"", err.Error())
		})
	}

	s.Run("cannot create with invalid status", func() {
		partialIntake := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAID(),
			Status:      "fakeStatus",
			RequestType: models.SystemIntakeRequestTypeNEW,
			Requester:   "Test requester",
		}

		created, err := s.store.CreateSystemIntake(ctx, &partialIntake)

		s.Error(err)
		s.Equal("pq: invalid input value for enum system_intake_status: \"fakeStatus\"", err.Error())
		s.Nil(created)
	})
}

func (s StoreTestSuite) TestUpdateSystemIntake() {
	ctx := context.Background()

	s.Run("update an existing system intake", func() {
		intake, err := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAID(),
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
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
			EUAUserID:   testhelpers.RandomEUAID(),
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
			Requester:   "Test requester",
		}
		_, err := s.store.CreateSystemIntake(ctx, &originalIntake)
		s.NoError(err)
		originalEUA := originalIntake.EUAUserID
		partialIntake := models.SystemIntake{
			ID:          originalIntake.ID,
			EUAUserID:   testhelpers.RandomEUAID(),
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
			Requester:   "Test requester",
		}
		partialIntake.EUAUserID = "NEWS"

		_, err = s.store.UpdateSystemIntake(ctx, &partialIntake)
		s.NoError(err, "failed to update system intake")

		updated, err := s.store.FetchSystemIntakeByID(ctx, originalIntake.ID)
		s.NoError(err)

		s.Equal(originalEUA, updated.EUAUserID)
	})

	s.Run("Lifecycle fields only upon update", func() {
		now := time.Now()
		originalIntake := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAID(),
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
			Requester:   "Test requester",

			// These fields should NOT be written during a create
			LifecycleID:        null.StringFrom("ABCDEF"),
			LifecycleExpiresAt: &now,
			LifecycleScope:     null.StringFrom("ABCDEF"),
			LifecycleNextSteps: null.StringFrom("ABCDEF"),
		}
		_, err := s.store.CreateSystemIntake(ctx, &originalIntake)
		s.NoError(err)

		partial, err := s.store.FetchSystemIntakeByID(ctx, originalIntake.ID)
		s.NoError(err)
		s.Empty(partial.LifecycleID)
		s.Empty(partial.LifecycleExpiresAt)
		s.Empty(partial.LifecycleScope)
		s.Empty(partial.LifecycleNextSteps)

		// Update
		lcid := "200110" // first LCID issued on 2020-01-11
		content1 := "ABC"
		content2 := "XYZ"
		partial.LifecycleID = null.StringFrom(lcid)
		partial.LifecycleExpiresAt = &now
		partial.LifecycleScope = null.StringFrom(content1)
		partial.LifecycleNextSteps = null.StringFrom(content2)

		_, err = s.store.UpdateSystemIntake(ctx, partial)
		s.NoError(err, "failed to update system intake")

		updated, err := s.store.FetchSystemIntakeByID(ctx, originalIntake.ID)
		s.NoError(err)

		s.Equal(lcid, updated.LifecycleID.String)
		s.NotEmpty(updated.LifecycleExpiresAt)
		s.Equal(content1, updated.LifecycleScope.String)
		s.Equal(content2, updated.LifecycleNextSteps.String)
	})

	s.Run("Update contract details information", func() {
		originalIntake := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAID(),
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
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
		contractStartMonth := "1"
		contractStartYear := "2020"
		contractEndMonth := "12"
		contractEndYear := "2021"
		partial.ProcessStatus = null.StringFrom(processStatus)
		partial.ExistingFunding = null.BoolFrom(existingFunding)
		partial.FundingNumber = null.StringFrom(fundingNumber)
		partial.FundingSource = null.StringFrom(fundingSource)
		partial.ExistingContract = null.StringFrom(existingContract)
		partial.Contractor = null.StringFrom(contractor)
		partial.ContractVehicle = null.StringFrom(contractVehicle)
		partial.ContractStartMonth = null.StringFrom(contractStartMonth)
		partial.ContractStartYear = null.StringFrom(contractStartYear)
		partial.ContractEndMonth = null.StringFrom(contractEndMonth)
		partial.ContractEndYear = null.StringFrom(contractEndYear)

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
		s.Equal(contractStartMonth, updated.ContractStartMonth.String)
		s.Equal(contractStartYear, updated.ContractStartYear.String)
		s.Equal(contractEndMonth, updated.ContractEndMonth.String)
		s.Equal(contractEndYear, updated.ContractEndYear.String)
	})

	s.Run("LifecycleID format", func() {
		originalIntake := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAID(),
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
			Requester:   "Test requester",
		}

		_, err := s.store.CreateSystemIntake(ctx, &originalIntake)
		s.NoError(err)

		partial, err := s.store.FetchSystemIntakeByID(ctx, originalIntake.ID)
		s.NoError(err)

		fails := []string{
			"20001",   // short
			"2000110", // long
			"20001A",  // non-numeric
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
				EUAUserID:   testhelpers.RandomEUAID(),
				Status:      models.SystemIntakeStatusINTAKEDRAFT,
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
			EUAUserID:   testhelpers.RandomEUAID(),
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
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

}

func (s StoreTestSuite) TestLifecyclePrefixBoundaries() {
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

func (s StoreTestSuite) TestFetchSystemIntakeByID() {
	ctx := context.Background()

	s.Run("golden path to fetch a system intake", func() {
		intake := testhelpers.NewSystemIntake()
		id := intake.ID
		tx := s.db.MustBegin()
		_, err := tx.NamedExec(insertBasicIntakeSQL, &intake)
		s.NoError(err)
		err = tx.Commit()
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

	s.Run("fetches biz case id if exists and intake is past draft status", func() {
		intake := testhelpers.NewSystemIntake()
		id := intake.ID
		intake.Status = models.SystemIntakeStatusLCIDISSUED
		bizCase := testhelpers.NewBusinessCase()
		bizCase.SystemIntakeID = id

		tx := s.db.MustBegin()
		_, err := tx.NamedExec(insertBasicIntakeSQL, &intake)
		s.NoError(err)
		_, err = tx.NamedExec(insertRelatedBizCaseSQL, &bizCase)
		s.NoError(err)
		err = tx.Commit()
		s.NoError(err)

		fetched, err := s.store.FetchSystemIntakeByID(ctx, id)

		s.NoError(err, "failed to fetch system intake")
		s.Equal(intake.ID, fetched.ID)
		s.Equal(&bizCase.ID, fetched.BusinessCaseID)
	})
}

func (s StoreTestSuite) TestFetchSystemIntakesByEuaID() {
	ctx := context.Background()

	s.Run("golden path to fetch system intakes", func() {
		intake := testhelpers.NewSystemIntake()
		intake2 := testhelpers.NewSystemIntake()
		intake2.EUAUserID = intake.EUAUserID
		tx := s.db.MustBegin()
		_, err := tx.NamedExec(insertBasicIntakeSQL, &intake)
		s.NoError(err)
		_, err = tx.NamedExec(insertBasicIntakeSQL, &intake2)
		s.NoError(err)
		err = tx.Commit()
		s.NoError(err)

		fetched, err := s.store.FetchSystemIntakesByEuaID(ctx, intake.EUAUserID)

		s.NoError(err, "failed to fetch system intakes")
		s.Len(fetched, 2)
		s.Equal(intake.EUAUserID, fetched[0].EUAUserID)
	})

	s.Run("does not fetch archived intake", func() {
		intake := testhelpers.NewSystemIntake()
		intake2 := testhelpers.NewSystemIntake()
		intake2.EUAUserID = intake.EUAUserID
		intake2.Status = models.SystemIntakeStatusWITHDRAWN
		tx := s.db.MustBegin()
		_, err := tx.NamedExec(insertBasicIntakeSQL, &intake)
		s.NoError(err)
		_, err = tx.NamedExec(insertBasicIntakeSQL, &intake2)
		s.NoError(err)
		err = tx.Commit()
		s.NoError(err)

		fetched, err := s.store.FetchSystemIntakesByEuaID(ctx, intake.EUAUserID)

		s.NoError(err, "failed to fetch system intakes")
		s.Len(fetched, 1)
		s.Equal(intake.EUAUserID, fetched[0].EUAUserID)
	})

	s.Run("fetches no results with other EUA ID", func() {
		fetched, err := s.store.FetchSystemIntakesByEuaID(ctx, testhelpers.RandomEUAID())

		s.NoError(err)
		s.Len(fetched, 0)
		s.Equal(models.SystemIntakes{}, fetched)
	})

	s.Run("fetches biz case IDs if they exist and intakes are past draft status", func() {
		intake := testhelpers.NewSystemIntake()
		intake2 := testhelpers.NewSystemIntake()
		id := intake.ID
		intake2.EUAUserID = intake.EUAUserID
		intake.Status = models.SystemIntakeStatusLCIDISSUED
		intake2.Status = models.SystemIntakeStatusINTAKESUBMITTED

		bizCase := testhelpers.NewBusinessCase()
		bizCase.SystemIntakeID = id

		tx := s.db.MustBegin()
		_, err := tx.NamedExec(insertBasicIntakeSQL, &intake)
		s.NoError(err)
		_, err = tx.NamedExec(insertBasicIntakeSQL, &intake2)
		s.NoError(err)
		_, err = tx.NamedExec(insertRelatedBizCaseSQL, &bizCase)
		s.NoError(err)
		err = tx.Commit()
		s.NoError(err)

		fetched, err := s.store.FetchSystemIntakesByEuaID(ctx, intake.EUAUserID)

		s.NoError(err, "failed to fetch system intakes")
		s.Len(fetched, 2)
		fetchedIntakeWithBizCase := func(fetched models.SystemIntakes) models.SystemIntake {
			for _, intake := range fetched {
				if intake.ID == id {
					return intake
				}
			}
			return models.SystemIntake{}
		}
		fetchedIntakeWithoutBizCase := func(fetched models.SystemIntakes) models.SystemIntake {
			for _, intake := range fetched {
				if intake.ID != id {
					return intake
				}
			}
			return models.SystemIntake{}
		}
		s.Equal(&bizCase.ID, fetchedIntakeWithBizCase(fetched).BusinessCaseID)
		s.Equal((*uuid.UUID)(nil), fetchedIntakeWithoutBizCase(fetched).BusinessCaseID)
	})
}

func (s StoreTestSuite) TestFetchSystemIntakesNotArchived() {
	s.Run("ensure positive and negative cases", func() {
		ctx := context.Background()

		// seed the db with intakes that we DO expect to be returned
		expected := map[string]bool{}
		for ix := 0; ix < 5; ix++ {
			intake := testhelpers.NewSystemIntake()
			result, err := s.store.CreateSystemIntake(ctx, &intake)
			s.NoError(err)
			expected[result.ID.String()] = false
		}

		// seed the db with WITHDRAWN intakes that should NOT be returned
		unexpected := map[string]bool{}
		for ix := 0; ix < 5; ix++ {
			intake := testhelpers.NewSystemIntake()
			result, err := s.store.CreateSystemIntake(ctx, &intake)
			s.NoError(err)

			result.Status = models.SystemIntakeStatusWITHDRAWN
			_, err = s.store.UpdateSystemIntake(ctx, result)
			s.NoError(err)

			unexpected[result.ID.String()] = true
		}

		intakes, err := s.store.FetchSystemIntakesNotArchived(ctx)
		s.NoError(err)

		for _, intake := range intakes {
			id := intake.ID.String()
			expected[id] = true

			// failure if we got back one of the WITHDRAWN intakes
			s.False(unexpected[id], "unexpected intake", id)
		}

		// failure if we did not see all the expected seeded not-WITHDRAWN intakes
		for id, found := range expected {
			s.True(found, "did not receive expected intake", id)
		}
	})
}

func (s StoreTestSuite) TestFetchSystemIntakeMetrics() {
	ctx := context.Background()

	mockClock := clock.NewMock()
	settableClock := testhelpers.SettableClock{Mock: mockClock}
	s.store.clock = &settableClock

	// create a random year to avoid test collisions
	// uses postgres max year minus 1000000
	rand.Seed(time.Now().UnixNano())
	endYear := rand.Intn(294276)
	endDate := time.Date(endYear, 0, 0, 0, 0, 0, 0, time.UTC)
	startDate := endDate.AddDate(0, -1, 0)
	var startedTests = []struct {
		name          string
		createdAt     time.Time
		expectedCount int
	}{
		{"start time is included", startDate, 1},
		{"end time is not included", endDate, 1},
		{"mid time is included", startDate.AddDate(0, 0, 1), 2},
		{"before time is not included", startDate.AddDate(0, 0, -1), 2},
		{"after time is not included", endDate.AddDate(0, 0, 1), 2},
	}
	for _, tt := range startedTests {
		s.Run(fmt.Sprintf("%s for started count", tt.name), func() {
			settableClock.Set(tt.createdAt)
			intake := testhelpers.NewSystemIntake()
			_, err := s.store.CreateSystemIntake(ctx, &intake)
			s.NoError(err)

			metrics, err := s.store.FetchSystemIntakeMetrics(ctx, startDate, endDate)

			s.NoError(err)
			s.Equal(tt.expectedCount, metrics.Started)
		})
	}

	endYear = rand.Intn(294276)
	endDate = time.Date(endYear, 0, 0, 0, 0, 0, 0, time.UTC)
	startDate = endDate.AddDate(0, -1, 0)
	var completedTests = []struct {
		name          string
		createdAt     time.Time
		submittedAt   time.Time
		expectedCount int
	}{
		{
			"started but not finished is not included",
			startDate,
			endDate.AddDate(0, 0, 1),
			0,
		},
		{
			"started and finished is included",
			startDate,
			startDate.AddDate(0, 0, 1),
			1,
		},
		{
			"started before is not included",
			startDate.AddDate(0, 0, -1),
			startDate.AddDate(0, 0, 1),
			1,
		},
	}
	for _, tt := range completedTests {
		s.Run(fmt.Sprintf("%s for completed count", tt.name), func() {
			intake := testhelpers.NewSystemIntake()
			settableClock.Set(tt.createdAt)
			_, err := s.store.CreateSystemIntake(ctx, &intake)
			s.NoError(err)
			intake.SubmittedAt = &tt.submittedAt
			_, err = s.store.UpdateSystemIntake(ctx, &intake)
			s.NoError(err)

			metrics, err := s.store.FetchSystemIntakeMetrics(ctx, startDate, endDate)

			s.NoError(err)
			s.Equal(tt.expectedCount, metrics.CompletedOfStarted)
		})
	}

	endYear = rand.Intn(294276)
	endDate = time.Date(endYear, 0, 0, 0, 0, 0, 0, time.UTC)
	startDate = endDate.AddDate(0, -1, 0)
	var fundedTests = []struct {
		name           string
		submittedAt    time.Time
		funded         bool
		completedCount int
		fundedCount    int
	}{
		{
			"completed out of range and funded",
			endDate.AddDate(0, 0, 1),
			true,
			0,
			0,
		},
		{
			"completed in range and funded",
			startDate,
			true,
			1,
			1,
		},
		{
			"completed in range and not funded",
			startDate,
			false,
			2,
			1,
		},
	}
	for _, tt := range fundedTests {
		s.Run(tt.name, func() {
			intake := testhelpers.NewSystemIntake()
			settableClock.Set(tt.submittedAt)
			intake.ExistingFunding = null.BoolFrom(tt.funded)
			_, err := s.store.CreateSystemIntake(ctx, &intake)
			s.NoError(err)
			intake.SubmittedAt = &tt.submittedAt
			_, err = s.store.UpdateSystemIntake(ctx, &intake)
			s.NoError(err)

			metrics, err := s.store.FetchSystemIntakeMetrics(ctx, startDate, endDate)

			s.NoError(err)
			s.Equal(tt.completedCount, metrics.Completed)
			s.Equal(tt.fundedCount, metrics.Funded)
		})
	}
}
