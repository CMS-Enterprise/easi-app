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

const insertBasicIntakeSQL = "INSERT INTO system_intake (id, eua_user_id, status, requester) VALUES (:id, :eua_user_id, :status, :requester)"
const insertRelatedBizCaseSQL = `INSERT INTO business_case (id, eua_user_id, status, requester, system_intake) 
		VALUES(:id, :eua_user_id, :status, :requester, :system_intake)`

func (s StoreTestSuite) TestCreateSystemIntake() {
	ctx := context.Background()

	s.Run("create a new system intake", func() {
		intake := models.SystemIntake{
			EUAUserID: testhelpers.RandomEUAID(),
			Status:    models.SystemIntakeStatusDRAFT,
			Requester: "Test requester",
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
			Status: models.SystemIntakeStatusDRAFT,
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
				Status: models.SystemIntakeStatusDRAFT,
			}
			partialIntake.EUAUserID = "F"

			_, err := s.store.CreateSystemIntake(ctx, &partialIntake)

			s.Error(err)
			s.Equal("pq: new row for relation \"system_intake\" violates check constraint \"eua_id_check\"", err.Error())
		})
	}

	s.Run("cannot create with invalid status", func() {
		partialIntake := models.SystemIntake{
			EUAUserID: testhelpers.RandomEUAID(),
			Status:    "fakeStatus",
			Requester: "Test requester",
		}

		created, err := s.store.CreateSystemIntake(ctx, &partialIntake)

		s.Error(err)
		s.Equal("pq: invalid input value for enum system_intake_status: \"fakeStatus\"", err.Error())
		s.Equal(&models.SystemIntake{}, created)
	})
}

func (s StoreTestSuite) TestUpdateSystemIntake() {
	ctx := context.Background()

	s.Run("update an existing system intake", func() {
		intake, err := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
			EUAUserID: testhelpers.RandomEUAID(),
			Status:    models.SystemIntakeStatusDRAFT,
			Requester: "Test requester",
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
			EUAUserID: testhelpers.RandomEUAID(),
			Status:    models.SystemIntakeStatusDRAFT,
			Requester: "Test requester",
		}
		_, err := s.store.CreateSystemIntake(ctx, &originalIntake)
		s.NoError(err)
		originalEUA := originalIntake.EUAUserID
		partialIntake := models.SystemIntake{
			ID:        originalIntake.ID,
			EUAUserID: testhelpers.RandomEUAID(),
			Status:    models.SystemIntakeStatusDRAFT,
			Requester: "Test requester",
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
			EUAUserID: testhelpers.RandomEUAID(),
			Status:    models.SystemIntakeStatusDRAFT,
			Requester: "Test requester",

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

	s.Run("LifecycleID format", func() {
		originalIntake := models.SystemIntake{
			EUAUserID: testhelpers.RandomEUAID(),
			Status:    models.SystemIntakeStatusDRAFT,
			Requester: "Test requester",
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
		intake.Status = models.SystemIntakeStatusAPPROVED
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

	s.Run("does not fetch archived intake", func() {
		intake := testhelpers.NewSystemIntake()
		id := intake.ID
		intake.Status = models.SystemIntakeStatusARCHIVED
		tx := s.db.MustBegin()
		_, err := tx.NamedExec(insertBasicIntakeSQL, &intake)
		s.NoError(err)
		err = tx.Commit()
		s.NoError(err)

		fetched, err := s.store.FetchSystemIntakeByID(ctx, id)

		s.Error(err)
		s.IsType(&apperrors.ResourceNotFoundError{}, err)
		s.Nil(fetched)
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
		intake2.Status = models.SystemIntakeStatusARCHIVED
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
		intake.Status = models.SystemIntakeStatusAPPROVED
		intake2.Status = models.SystemIntakeStatusSUBMITTED

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
