package intake

import (
	"context"
	"encoding/json"
	"fmt"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	intakemodels "github.com/cms-enterprise/easi-app/pkg/cedar/intake/models"
	"github.com/cms-enterprise/easi-app/pkg/cedar/intake/translation"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

type ClientTestSuite struct {
	suite.Suite
	logger *zap.Logger
	store  *storage.Store
	ctx    context.Context
}

func TestClientTestSuite(t *testing.T) {

	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	assert.NoError(t, err)

	config := testhelpers.NewConfig()

	dbconfig := storage.DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}

	store, err := storage.NewStore(dbconfig, ldClient)
	if err != nil {
		t.Fail()
		fmt.Printf("Failed to connect to database in Cedar Intake tests: %s", err.Error())
		return
	}

	ctx := context.Background()

	buildDataloaders := func() *dataloaders.Dataloaders {
		return dataloaders.NewDataloaders(
			store,
			func(ctx context.Context, s []string) ([]*models.UserInfo, error) { return nil, nil },
			func(ctx context.Context) ([]*models.CedarSystem, error) { return nil, nil },
		)
	}

	ctx = dataloaders.CTXWithLoaders(ctx, buildDataloaders)

	tests := &ClientTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewExample(),
		store:  store,
		ctx:    ctx,
	}

	suite.Run(t, tests)
}

func (s *ClientTestSuite) TestClient() {
	ctx := appcontext.WithLogger(s.ctx, s.logger)

	s.Run("Instantiation successful", func() {
		c := NewClient("fake", "fake", false, false)
		s.NotNil(c)
	})

	s.Run("LD defaults protects invocation", func() {
		c := NewClient("fake", "fake", false, false)
		err := c.CheckConnection(ctx)
		s.NoError(err)

		si := testhelpers.NewSystemIntake()
		si.CreatedAt = si.ContractStartDate
		si.UpdatedAt = si.ContractStartDate
		err = c.PublishSystemIntake(ctx, si)
		s.NoError(err)
	})
}

func (s *ClientTestSuite) TestTranslation() {
	s.Run("action", func() {
		action := translation.TranslatableAction(testhelpers.NewAction())
		id := uuid.New()
		action.IntakeID = &id

		ii, err := action.CreateIntakeModel(s.ctx)
		s.NoError(err)
		s.NotNil(ii)
	})

	s.Run("system intake", func() {
		si := translation.TranslatableSystemIntake(testhelpers.NewSystemIntake())
		si.CreatedAt = si.ContractStartDate
		si.UpdatedAt = si.ContractStartDate

		ii, err := si.CreateIntakeModel(s.ctx)
		s.NoError(err)
		s.NotNil(ii)

		// Unmarshal the body so we can check that fields are being set properly
		intakeBody := &intakemodels.EASIIntake{}
		err = json.Unmarshal([]byte(*ii.Body), intakeBody)
		s.NoError(err)

		// Check that the ID of the Intake is Correct
		s.EqualValues(si.ID.String(), intakeBody.IntakeID)

		// Check that the Funding Investment ID is being pulled from the FundingSources array of the Intake
		s.EqualValues(si.FundingSources[0].ID.String(), intakeBody.FundingSources[0].FundingSourceID)

	})

	s.Run("note", func() {
		note := translation.TranslatableNote(testhelpers.NewNote())

		ii, err := note.CreateIntakeModel(s.ctx)
		s.NoError(err)
		s.NotNil(ii)
	})

	s.Run("biz case", func() {
		bc := translation.TranslatableBusinessCase(testhelpers.NewBusinessCase(uuid.New()))

		ii, err := bc.CreateIntakeModel(s.ctx)
		s.NoError(err)
		s.NotNil(ii)
	})

	// s.Run("feedback", func() {
	// 	fb := translation.TranslatableFeedback(testhelpers.NewGRTFeedback())

	// 	ii, err := fb.CreateIntakeModel()
	// 	s.NoError(err)
	// 	s.NotNil(ii)
	// })
}

func (s *ClientTestSuite) TestGetDurationUntilNextWeekdayAndTime() {
	tests := []struct {
		name        string
		startTime   time.Time
		expectedDay time.Weekday
	}{
		{"Monday before 2 UTC", time.Date(2025, 3, 17, 1, 0, 0, 0, time.UTC), time.Monday}, // Same day at 2 UTC
		{"Monday after 2 UTC", time.Date(2025, 3, 17, 3, 0, 0, 0, time.UTC), time.Tuesday},
		{"Tuesday before 2 UTC", time.Date(2025, 3, 18, 1, 0, 0, 0, time.UTC), time.Tuesday},
		{"Tuesday after 2 UTC", time.Date(2025, 3, 18, 3, 0, 0, 0, time.UTC), time.Wednesday},
		{"Friday before 2 UTC", time.Date(2025, 3, 21, 1, 0, 0, 0, time.UTC), time.Friday},
		{"Friday after 2 UTC", time.Date(2025, 3, 21, 3, 0, 0, 0, time.UTC), time.Monday},
		{"Saturday", time.Date(2025, 3, 22, 10, 0, 0, 0, time.UTC), time.Monday},
		{"Sunday", time.Date(2025, 3, 23, 10, 0, 0, 0, time.UTC), time.Monday},
	}

	publishHour := 2 // 2 UTC

	for _, tt := range tests {
		s.Run(tt.name, func() {
			duration := getDurationUntilNextWeekdayAndTime(tt.startTime, publishHour)
			nextRun := tt.startTime.Add(duration)

			// Assert next run day is correct
			s.Equal(tt.expectedDay, nextRun.Weekday(), "Expected next run to be on %s, but got %s", tt.expectedDay, nextRun.Weekday())

			// Assert next run is at the correct hour (2 UTC)
			s.Equal(publishHour, nextRun.Hour(), "Expected next run hour to be %d, but got %d", publishHour, nextRun.Hour())
		})
	}
}
