package alerts

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

const DateLayout = "2006-01-02"

func TestLCIDExpirationAlert(t *testing.T) {
	ctx := context.Background()
	ctx = appcontext.WithPrincipal(ctx, &authentication.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: true})

	// Build out test intakes with varying LCID expiration dates
	testDate, _ := time.Parse(DateLayout, "2023-02-20")

	// mock expiration dates
	sixtyDaysFromDate, _ := time.Parse(DateLayout, "2023-04-21")
	fiftyNineDaysFromDate, _ := time.Parse(DateLayout, "2023-04-20")
	fortySixDaysFromDate, _ := time.Parse(DateLayout, "2023-04-06")

	// mock retirement dates
	twoDaysFromDate, _ := time.Parse(DateLayout, "2023-02-22")
	oneDayBeforeDate, _ := time.Parse(DateLayout, "2023-02-19")

	var intakePtr *models.SystemIntake
	intake := testhelpers.NewSystemIntake()
	intakePtr = &intake

	var intakeWithLCIDExpiringIn60DaysPtr *models.SystemIntake
	intakeWithLCIDExpiringIn60Days := testhelpers.NewSystemIntake()
	intakeWithLCIDExpiringIn60Days.LifecycleExpiresAt = &sixtyDaysFromDate
	intakeWithLCIDExpiringIn60DaysPtr = &intakeWithLCIDExpiringIn60Days

	var intakeWithLCIDExpiringIn59DaysPtr *models.SystemIntake
	intakeWithLCIDExpiringIn59Days := testhelpers.NewSystemIntake()
	intakeWithLCIDExpiringIn59Days.LifecycleExpiresAt = &fiftyNineDaysFromDate
	intakeWithLCIDExpiringIn59DaysPtr = &intakeWithLCIDExpiringIn59Days

	var intakeWithLCIDExpiringIn46DaysPtr *models.SystemIntake
	intakeWithLCIDExpiringIn46Days := testhelpers.NewSystemIntake()
	intakeWithLCIDExpiringIn46Days.LifecycleExpiresAt = &fortySixDaysFromDate
	intakeWithLCIDExpiringIn46DaysPtr = &intakeWithLCIDExpiringIn46Days

	var systemIntakes []*models.SystemIntake
	systemIntakes = append(
		systemIntakes,
		intakePtr,
		intakeWithLCIDExpiringIn46DaysPtr,
		intakeWithLCIDExpiringIn59DaysPtr,
		intakeWithLCIDExpiringIn60DaysPtr,
	)

	// Mock Functions
	mockFetchUserInfo := func(context.Context, string) (*models.UserInfo, error) {
		return &models.UserInfo{
			CommonName: "name",
			Email:      "email",
			EuaUserID:  "ABCD",
		}, nil
	}

	mockFetchUserInfoInvalidParams := func(context.Context, string) (*models.UserInfo, error) {
		return nil, &apperrors.InvalidParametersError{
			FunctionName: "cedarldap.FetchUserInfo",
		}
	}

	mockFetchUserInfoInvalidEUAID := func(context.Context, string) (*models.UserInfo, error) {
		return nil, &apperrors.InvalidEUAIDError{
			EUAID: "ABCD",
		}
	}

	mockFetchUserInfoExternalAPIError := func(context.Context, string) (*models.UserInfo, error) {
		return nil, &apperrors.ExternalAPIError{
			Err:       errors.New("failed to return person from CEDAR LDAP"),
			ModelID:   "ABCD",
			Model:     nil,
			Operation: apperrors.Fetch,
			Source:    "CEDAR LDAP",
		}
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
		lcidIssueDate *time.Time,
		lcidExpirationDate *time.Time,
		scope models.HTML,
		lifecycleCostBaseline string,
		nextSteps models.HTML,
	) error {
		lcidExpirationAlertCount++
		return nil
	}

	// Test Cases
	t.Run("sends correct number of alerts", func(t *testing.T) {
		clearAlerts(systemIntakes)

		// Test that it sends alerts for the two intakes with LCIDs expiring within 60 days
		lcidExpirationAlertCount = 0
		err := checkForLCIDExpiration(ctx, testDate, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 2, lcidExpirationAlertCount)

		// Test that it doesn't resend alerts
		lcidExpirationAlertCount = 0
		err = checkForLCIDExpiration(ctx, testDate, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 0, lcidExpirationAlertCount)
	})

	t.Run("does not send for \"no governance\" status", func(t *testing.T) {
		clearAlerts(systemIntakes)

		// Test that it does NOT send alerts for intakes with LCIDs expiring within 60 days that have a NO GOVERNANCE status
		lcidExpirationAlertCount = 0
		intakeWithLCIDExpiringIn46Days.Status = models.SystemIntakeStatusNOGOVERNANCE
		intakeWithLCIDExpiringIn59Days.Status = models.SystemIntakeStatusNOGOVERNANCE
		intakeWithLCIDExpiringIn60Days.Status = models.SystemIntakeStatusNOGOVERNANCE
		err := checkForLCIDExpiration(ctx, testDate, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		// reset to original value of test helper
		intakeWithLCIDExpiringIn46Days.Status = models.SystemIntakeStatusINTAKEDRAFT
		intakeWithLCIDExpiringIn59Days.Status = models.SystemIntakeStatusINTAKEDRAFT
		intakeWithLCIDExpiringIn60Days.Status = models.SystemIntakeStatusINTAKEDRAFT
		assert.NoError(t, err)
		assert.Equal(t, 0, lcidExpirationAlertCount)
	})

	t.Run("does not send alerts for retired intakes, even if their expiration date is upcoming", func(t *testing.T) {
		clearAlerts(systemIntakes)

		intakeWithLCIDRetiringSoonExpiringIn59Days := testhelpers.NewSystemIntake()
		intakeWithLCIDRetiringSoonExpiringIn59Days.LifecycleExpiresAt = &fiftyNineDaysFromDate
		intakeWithLCIDRetiringSoonExpiringIn59Days.LifecycleRetiresAt = &twoDaysFromDate

		intakeWithLCIDAlreadyRetiredExpiringIn59Days := testhelpers.NewSystemIntake()
		intakeWithLCIDAlreadyRetiredExpiringIn59Days.LifecycleExpiresAt = &fiftyNineDaysFromDate
		intakeWithLCIDAlreadyRetiredExpiringIn59Days.LifecycleRetiresAt = &oneDayBeforeDate

		mockFetchAllIntakesForRetiredIntakes := func(ctx context.Context) (models.SystemIntakes, error) {
			return models.SystemIntakes{
				intakeWithLCIDRetiringSoonExpiringIn59Days,
				intakeWithLCIDAlreadyRetiredExpiringIn59Days,
			}, nil
		}

		lcidExpirationAlertCount = 0
		err := checkForLCIDExpiration(ctx, testDate, mockFetchUserInfo, mockFetchAllIntakesForRetiredIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.EqualValues(t, 0, lcidExpirationAlertCount)
	})

	t.Run("does not resend alerts", func(t *testing.T) {
		clearAlerts(systemIntakes)

		// Test that it sends alerts for the two intakes with LCIDs expiring within 60 days
		lcidExpirationAlertCount = 0
		err := checkForLCIDExpiration(ctx, testDate, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 2, lcidExpirationAlertCount)

		// Test that it sends an alert for the intake that is now expiring withing 60 days but doesn't resend alerts
		lcidExpirationAlertCount = 0
		twoDaysLater := testDate.AddDate(0, 0, 2)
		err = checkForLCIDExpiration(ctx, twoDaysLater, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 1, lcidExpirationAlertCount)
	})

	t.Run("sends alerts 14 days after first alert", func(t *testing.T) {
		clearAlerts(systemIntakes)

		// Test that it sends alerts for the two intakes with LCIDs expiring within 60 days
		lcidExpirationAlertCount = 0
		err := checkForLCIDExpiration(ctx, testDate, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 2, lcidExpirationAlertCount)

		// Test that it sends an alert for the intake that is now expiring withing 60 days but doesn't resend alerts
		lcidExpirationAlertCount = 0
		twoDaysLater := testDate.AddDate(0, 0, 2)
		err = checkForLCIDExpiration(ctx, twoDaysLater, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 1, lcidExpirationAlertCount)

		// Test that it resends alerts for the two intakes that were alerted more then 14 days ago but doesn't resend the alert to the other
		lcidExpirationAlertCount = 0
		fifteenDaysLater := testDate.AddDate(0, 0, 15)
		err = checkForLCIDExpiration(ctx, fifteenDaysLater, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 2, lcidExpirationAlertCount)

		// Test that it resends alerts for the one intake that was alerted more then 14 days ago but doesn't resend alerts to the others
		lcidExpirationAlertCount = 0
		seventeenDaysLater := testDate.AddDate(0, 0, 17)
		err = checkForLCIDExpiration(ctx, seventeenDaysLater, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 1, lcidExpirationAlertCount)
	})

	t.Run("properly handles fetch user info invalid params", func(t *testing.T) {
		clearAlerts(systemIntakes)

		// Test that it sends alerts for the two intakes with LCIDs expiring within 60 days even in case of invalid params error
		lcidExpirationAlertCount = 0
		err := checkForLCIDExpiration(ctx, testDate, mockFetchUserInfoInvalidParams, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 2, lcidExpirationAlertCount)

		// Test that it does not send alerts on retry after invalid EUA
		lcidExpirationAlertCount = 0
		err = checkForLCIDExpiration(ctx, testDate, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 0, lcidExpirationAlertCount)
	})

	t.Run("properly handles fetch user info invalid EUA", func(t *testing.T) {
		clearAlerts(systemIntakes)

		// Test that it sends alerts for the two intakes with LCIDs expiring within 60 days even in case of invalid EUA error
		lcidExpirationAlertCount = 0
		err := checkForLCIDExpiration(ctx, testDate, mockFetchUserInfoInvalidEUAID, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 2, lcidExpirationAlertCount)

		// Test that it does not send alerts on retry after invalid EUA
		lcidExpirationAlertCount = 0
		err = checkForLCIDExpiration(ctx, testDate, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 0, lcidExpirationAlertCount)
	})

	t.Run("properly handles fetch user info external api error", func(t *testing.T) {
		clearAlerts(systemIntakes)

		// Test that it doesnt send alerts in case of external API error
		lcidExpirationAlertCount = 0
		err := checkForLCIDExpiration(ctx, testDate, mockFetchUserInfoExternalAPIError, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 0, lcidExpirationAlertCount)

		// Test that it sends alerts on retry after external API error
		lcidExpirationAlertCount = 0
		err = checkForLCIDExpiration(ctx, testDate, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 2, lcidExpirationAlertCount)
	})

	// NOTE: this test should be run last since it modifies the LCID expiration date of the test intakes
	t.Run("resets alerts properly on lcid extension", func(t *testing.T) {
		clearAlerts(systemIntakes)

		// Test that it sends alerts for the two intakes with LCIDs expiring within 60 days
		lcidExpirationAlertCount = 0
		err := checkForLCIDExpiration(ctx, testDate, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 2, lcidExpirationAlertCount)

		// Test that all alert timestamps are set properly
		assert.NotNil(t, intakeWithLCIDExpiringIn46Days.LifecycleExpirationAlertTS)
		assert.NotNil(t, intakeWithLCIDExpiringIn59Days.LifecycleExpirationAlertTS)
		assert.Nil(t, intakeWithLCIDExpiringIn60Days.LifecycleExpirationAlertTS)

		// Test that it sends an alert for the intake that is now expiring withing 60 days but doesn't resend alerts
		lcidExpirationAlertCount = 0
		twoDaysLater := testDate.AddDate(0, 0, 2)
		err = checkForLCIDExpiration(ctx, twoDaysLater, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 1, lcidExpirationAlertCount)

		// Test that all alert timestamps are set properly
		assert.NotNil(t, intakeWithLCIDExpiringIn46Days.LifecycleExpirationAlertTS)
		assert.NotNil(t, intakeWithLCIDExpiringIn59Days.LifecycleExpirationAlertTS)
		assert.NotNil(t, intakeWithLCIDExpiringIn60Days.LifecycleExpirationAlertTS)

		// "Extend" intakeWithLCIDExpiringIn59Days' LCID by two days
		lcidExtendedThreeDays := intakeWithLCIDExpiringIn59Days.LifecycleExpiresAt.AddDate(0, 0, 3)
		intakeWithLCIDExpiringIn59Days.LifecycleExpiresAt = &lcidExtendedThreeDays

		// Fire off another check/alert (still two days later)
		// This shouldn't send any alerts but should nil out the newly extended LCID alert timestamp since it has fallen out of the 60 day window
		lcidExpirationAlertCount = 0
		err = checkForLCIDExpiration(ctx, twoDaysLater, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 0, lcidExpirationAlertCount)

		// Test that "extended" LCID alert timestamp is now nil
		assert.NotNil(t, intakeWithLCIDExpiringIn46Days.LifecycleExpirationAlertTS)
		assert.Nil(t, intakeWithLCIDExpiringIn59Days.LifecycleExpirationAlertTS) // This intake now actually expires in 62 days since it was "extended"
		assert.NotNil(t, intakeWithLCIDExpiringIn60Days.LifecycleExpirationAlertTS)

		// Test that "extended" LCID alert is sent once it re-enters the 60 day window
		lcidExpirationAlertCount = 0
		threeDaysLater := testDate.AddDate(0, 0, 3)
		err = checkForLCIDExpiration(ctx, threeDaysLater, mockFetchUserInfo, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 1, lcidExpirationAlertCount)
	})
}

func clearAlerts(intakes []*models.SystemIntake) {
	for _, currIntake := range intakes {
		currIntake.LifecycleExpirationAlertTS = nil
	}
}
