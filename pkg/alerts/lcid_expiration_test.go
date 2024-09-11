package alerts

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

const DateLayout = "2006-01-02"

func TestLCIDExpirationAlert(t *testing.T) {
	ctx := context.Background()
	ctx = appcontext.WithPrincipal(ctx, &authentication.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: true})

	// Build out test intakes with varying LCID expiration dates
	testDate, _ := time.Parse(DateLayout, "2023-02-20")

	// mock expiration dates
	twoYearsFromDate, _ := time.Parse(DateLayout, "2021-03-20")
	sixtyDaysFromDate, _ := time.Parse(DateLayout, "2023-04-21")
	fiftyNineDaysFromDate, _ := time.Parse(DateLayout, "2023-04-20")
	fortySixDaysFromDate, _ := time.Parse(DateLayout, "2023-04-06")

	var intakePtr *models.SystemIntake
	intake := testhelpers.NewSystemIntake()
	intakePtr = &intake

	var intakeWithLCIDExpiringIn2YearsPtr *models.SystemIntake
	intakeWithLCIDExpiringIn2Years := testhelpers.NewSystemIntake()
	intakeWithLCIDExpiringIn2Years.LifecycleExpiresAt = &twoYearsFromDate
	intakeWithLCIDExpiringIn2YearsPtr = &intakeWithLCIDExpiringIn2Years

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
		intakeWithLCIDExpiringIn2YearsPtr,
	)

	// Mock Functions
	mockFetchUserInfo := func(context.Context, string) (*models.UserInfo, error) {
		return &models.UserInfo{
			DisplayName: "name",
			Email:       "email",
			Username:    "ABCD",
		}, nil
	}

	mockFetchUserInfoInvalidParams := func(context.Context, string) (*models.UserInfo, error) {
		return nil, &apperrors.InvalidParametersError{
			FunctionName: "oktaapi.FetchUserInfo",
		}
	}

	mockFetchUserInfoInvalidEUAID := func(context.Context, string) (*models.UserInfo, error) {
		return nil, &apperrors.InvalidEUAIDError{
			EUAID: "ABCD",
		}
	}

	mockFetchUserInfoExternalAPIError := func(context.Context, string) (*models.UserInfo, error) {
		return nil, &apperrors.ExternalAPIError{
			Err:       errors.New("failed to return person from Okta"),
			ModelID:   "ABCD",
			Model:     nil,
			Operation: apperrors.Fetch,
			Source:    "Okta",
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
	t.Run("getAlertRecipients should return gov team even if EUA ID not stored", func(t *testing.T) {
		intakeWithNoEUA := testhelpers.NewSystemIntake()
		intakeWithNoEUA.EUAUserID = null.StringFromPtr(nil)
		intakeWithNoEUA.LifecycleExpiresAt = &fortySixDaysFromDate

		assert.Equal(t, intakeWithNoEUA.EUAUserID.ValueOrZero(), "")

		recipients, err := getAlertRecipients(
			ctx,
			intakeWithNoEUA,
			func(context.Context, string) (*models.UserInfo, error) {
				return nil, errors.New("this should never get called")
			},
		)
		assert.NoError(t, err)
		assert.Equal(t, len(recipients.RegularRecipientEmails), 0)
		assert.Equal(t, recipients.ShouldNotifyITGovernance, true)
	})

	t.Run("properly handles fetch user info invalid params", func(t *testing.T) {
		clearAlerts(systemIntakes)

		// Test that it sends alerts for the two intakes with LCIDs expiring within 60 days even in case of invalid params error
		lcidExpirationAlertCount = 0
		err := checkForLCIDExpiration(ctx, testDate, mockFetchUserInfoInvalidParams, mockFetchAllIntakes, mockUpdateIntake, mockLcidExpirationAlertEmail)
		assert.NoError(t, err)
		assert.Equal(t, 3, lcidExpirationAlertCount)

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
		assert.Equal(t, 3, lcidExpirationAlertCount)

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
		assert.Equal(t, 3, lcidExpirationAlertCount)
	})

}

func clearAlerts(intakes []*models.SystemIntake) {
	for _, currIntake := range intakes {
		currIntake.LifecycleExpirationAlertTS = nil
	}
}

func TestShouldSendAlertForIntake_False(t *testing.T) {
	now := time.Date(2024, time.February, 11, 12, 0, 0, 0, time.UTC)
	tenDaysAgo := now.AddDate(0, 0, -10)
	// thirtyDaysAgo := now.AddDate(0, 0, -30)
	ninetyDaysAgo := now.AddDate(0, 0, -90)
	oneHundredThirtyDaysAgo := now.AddDate(0, 0, -130)

	t.Run("skips intake if it has an LCID retirement date set", func(t *testing.T) {
		intakeWithRetirementDate := testhelpers.NewSystemIntake()
		intakeWithRetirementDate.LifecycleRetiresAt = &now
		intakeWithRetirementDate.LifecycleExpiresAt = &now
		assert.False(t, shouldSendAlertForIntake(intakeWithRetirementDate, oneHundredThirtyDaysAgo))
	})

	t.Run("skips intakes without an expiration date set", func(t *testing.T) {
		intakeWithoutExpirationDate := testhelpers.NewSystemIntake()
		intakeWithoutExpirationDate.LifecycleExpiresAt = nil
		assert.False(t, shouldSendAlertForIntake(intakeWithoutExpirationDate, now))
	})

	t.Run("skips intakes with an expiration date in the past", func(t *testing.T) {
		intakeWithExpiredDate := testhelpers.NewSystemIntake()
		intakeWithExpiredDate.LifecycleExpiresAt = &tenDaysAgo
		assert.False(t, shouldSendAlertForIntake(intakeWithExpiredDate, now))
	})

	// These test cases are a bit more complex than the previous ones,
	// but all still follow a similar pattern, as these are all cases where:
	// - The intake has a valid expiration date

	// Test that it skips an intake that is before all alert dates
	// Emulate this by setting the expiration date to "now", but
	// make the check happen 130 days ago (i.e., expiration date is 130 in the future)
	t.Run("skips intake outside range of all alert dates", func(t *testing.T) {
		intakeBeforeAllAlertDates := testhelpers.NewSystemIntake()
		intakeBeforeAllAlertDates.LifecycleExpiresAt = &now
		assert.False(t, shouldSendAlertForIntake(intakeBeforeAllAlertDates, oneHundredThirtyDaysAgo))
	})

	// Test that an alert won't be sent more than once for the same alert date
	// This test has an Intake with an alert previously sent for this alertDate (120, in this test)
	t.Run("skips an intake that already has sent an alert for the target date", func(t *testing.T) {
		intakeAlreadyAlerted := testhelpers.NewSystemIntake()
		intakeAlreadyAlerted.LifecycleExpiresAt = &now
		intakeAlreadyAlerted.LifecycleExpirationAlertTS = &ninetyDaysAgo
		assert.False(t, shouldSendAlertForIntake(intakeAlreadyAlerted, ninetyDaysAgo))
	})
}

func TestShouldSendAlertForIntake_True(t *testing.T) {
	now := time.Date(2024, time.February, 11, 12, 0, 0, 0, time.UTC)
	// tenDaysAgo := now.AddDate(0, 0, -10)
	thirtyDaysAgo := now.AddDate(0, 0, -30)
	ninetyDaysAgo := now.AddDate(0, 0, -90)
	oneHundredThirtyDaysAgo := now.AddDate(0, 0, -130)

	// Test that an intake with no previous alert will send an alert in the right time frame
	t.Run("sends an alert when no alert has been sent prior", func(t *testing.T) {
		intakeWithNoPreviousAlert := testhelpers.NewSystemIntake()
		intakeWithNoPreviousAlert.LifecycleExpiresAt = &now
		assert.True(t, shouldSendAlertForIntake(intakeWithNoPreviousAlert, ninetyDaysAgo))
	})

	// Test that an intake with a previous alert will send an alert in the right time frame
	// Since the previous alert was before the 120 day mark, we should alert again
	t.Run("sends an alert when prior alert was before target date (120)", func(t *testing.T) {
		intakeWithPreviousAlert := testhelpers.NewSystemIntake()
		intakeWithPreviousAlert.LifecycleExpiresAt = &now
		intakeWithPreviousAlert.LifecycleExpirationAlertTS = &oneHundredThirtyDaysAgo
		assert.True(t, shouldSendAlertForIntake(intakeWithPreviousAlert, ninetyDaysAgo))
	})

	// Same test as above, but during a different time frame
	// Since the previous alert was before the 60 day mark, we should alert again
	t.Run("sends an alert when prior alert was before target date (60)", func(t *testing.T) {
		intakeWithPreviousAlert := testhelpers.NewSystemIntake()
		intakeWithPreviousAlert.LifecycleExpiresAt = &now
		intakeWithPreviousAlert.LifecycleExpirationAlertTS = &ninetyDaysAgo
		assert.True(t, shouldSendAlertForIntake(intakeWithPreviousAlert, thirtyDaysAgo))
	})
}
