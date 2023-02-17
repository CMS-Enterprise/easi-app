package alerts

import (
	"context"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func TestLCIDExpirationAlert(t *testing.T) {
	ctx := context.Background()
	ctx = appcontext.WithPrincipal(ctx, &authentication.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: true})

	// Build out test intakes with varying LCID expiration dates
	currentDate := time.Now()

	sixtyOneDaysFromToday := currentDate.AddDate(0, 0, 61)
	sixtyDaysFromToday := currentDate.AddDate(0, 0, 60)
	fortySixDaysFromToday := currentDate.AddDate(0, 0, 46)

	var intakePtr *models.SystemIntake
	intake := testhelpers.NewSystemIntake()
	intakePtr = &intake

	var intakeWithLCIDExpiringIn61DaysPtr *models.SystemIntake
	intakeWithLCIDExpiringIn61Days := testhelpers.NewSystemIntake()
	intakeWithLCIDExpiringIn61Days.LifecycleExpiresAt = &sixtyOneDaysFromToday
	intakeWithLCIDExpiringIn61DaysPtr = &intakeWithLCIDExpiringIn61Days

	var intakeWithLCIDExpiringIn60DaysPtr *models.SystemIntake
	intakeWithLCIDExpiringIn60Days := testhelpers.NewSystemIntake()
	intakeWithLCIDExpiringIn60Days.LifecycleExpiresAt = &sixtyDaysFromToday
	intakeWithLCIDExpiringIn60DaysPtr = &intakeWithLCIDExpiringIn60Days

	var intakeWithLCIDExpiringIn46DaysPtr *models.SystemIntake
	intakeWithLCIDExpiringIn46Days := testhelpers.NewSystemIntake()
	intakeWithLCIDExpiringIn46Days.LifecycleExpiresAt = &fortySixDaysFromToday
	intakeWithLCIDExpiringIn46DaysPtr = &intakeWithLCIDExpiringIn46Days

	var systemIntakes []*models.SystemIntake
	systemIntakes = append(systemIntakes, intakePtr, intakeWithLCIDExpiringIn46DaysPtr, intakeWithLCIDExpiringIn60DaysPtr, intakeWithLCIDExpiringIn61DaysPtr)

	// Mock Functions
	mockFetchUserInfo := func(context.Context, string) (*models.UserInfo, error) {
		return &models.UserInfo{
			CommonName: "name",
			Email:      "email",
			EuaUserID:  "ABCD",
		}, nil
	}

	mockUpdateIntake := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		for _, currIntake := range systemIntakes {
			if currIntake.ID == intake.ID {
				currIntake.LifecycleExpirationAlertTS = intake.LifecycleExpirationAlertTS
			}
		}
		return intake, nil
	}

	mockFetchAllIntakes := func(ctx context.Context) (models.SystemIntakes, error) {
		var systemIntakesModel models.SystemIntakes
		for _, currIntake := range systemIntakes {
			systemIntakesModel = append(systemIntakesModel, *currIntake)
		}
		return systemIntakesModel, nil
	}

	var lcidExpirationAlertCount int
	mockLcidExpirationAlertEmail := func(ctx context.Context,
		recipients models.EmailNotificationRecipients,
		systemIntakeID uuid.UUID,
		projectName string,
		requesterName string,
		lcid string,
		lcidExpirationDate *time.Time,
		scope string,
		lifecycleCostBaseline string,
		nextSteps string) error {
		lcidExpirationAlertCount++
		return nil
	}

	// Test Cases
	t.Run("Sends correct number of alerts", func(t *testing.T) {
		clearAlerts(systemIntakes)

		// Test that it sends alerts for the two intakes with LCIDs expiring within 60 days
		lcidExpirationAlertCount = 0
		err := checkForLCIDExpiration(ctx, currentDate, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 2, lcidExpirationAlertCount)

		// Test that it doesn't resend alerts
		lcidExpirationAlertCount = 0
		err = checkForLCIDExpiration(ctx, currentDate, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 0, lcidExpirationAlertCount)
	})

	t.Run("Doesn't resend alerts", func(t *testing.T) {
		clearAlerts(systemIntakes)

		// Test that it sends alerts for the two intakes with LCIDs expiring within 60 days
		lcidExpirationAlertCount = 0
		err := checkForLCIDExpiration(ctx, currentDate, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 2, lcidExpirationAlertCount)

		// Test that it sends an alert for the intake that is now expiring withing 60 days but doesn't resend alerts
		lcidExpirationAlertCount = 0
		twoDaysLater := time.Now().AddDate(0, 0, 2)
		err = checkForLCIDExpiration(ctx, twoDaysLater, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 1, lcidExpirationAlertCount)
	})

	t.Run("Sends alerts 14 days after first alert", func(t *testing.T) {
		clearAlerts(systemIntakes)

		// Test that it sends alerts for the two intakes with LCIDs expiring within 60 days
		lcidExpirationAlertCount = 0
		err := checkForLCIDExpiration(ctx, currentDate, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 2, lcidExpirationAlertCount)

		// Test that it sends an alert for the intake that is now expiring withing 60 days but doesn't resend alerts
		lcidExpirationAlertCount = 0
		twoDaysLater := time.Now().AddDate(0, 0, 2)
		err = checkForLCIDExpiration(ctx, twoDaysLater, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 1, lcidExpirationAlertCount)

		// Test that it resends alerts for the two intakes that were alerted more then 14 days ago but doesn't resend the alert to the other
		lcidExpirationAlertCount = 0
		fifteenDaysLater := time.Now().AddDate(0, 0, 15)
		err = checkForLCIDExpiration(ctx, fifteenDaysLater, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 2, lcidExpirationAlertCount)

		// Test that it resends alerts for the one intake that was alerted more then 14 days ago but doesn't resend alerts to the others
		lcidExpirationAlertCount = 0
		seventeenDaysLater := time.Now().AddDate(0, 0, 17)
		err = checkForLCIDExpiration(ctx, seventeenDaysLater, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 1, lcidExpirationAlertCount)
	})
}

func clearAlerts(intakes []*models.SystemIntake) {
	for _, currIntake := range intakes {
		currIntake.LifecycleExpirationAlertTS = nil
	}
}
