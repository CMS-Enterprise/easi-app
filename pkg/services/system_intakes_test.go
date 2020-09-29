package services

import (
	"context"
	"errors"

	"github.com/facebookgo/clock"
	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/authn"
	models2 "github.com/cmsgov/easi-app/pkg/cedar/cedarldap/gen/models"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s ServicesTestSuite) TestSystemIntakesByEuaIDFetcher() {
	logger := zap.NewNop()
	fakeEuaID := "FAKE"
	serviceConfig := NewConfig(logger, nil)
	serviceConfig.clock = clock.NewMock()
	authorize := func(context context.Context, euaID string) (bool, error) { return true, nil }

	s.Run("successfully fetches System Intakes by EUA ID without an error", func() {
		fetch := func(ctx context.Context, euaID string) (models.SystemIntakes, error) {
			return models.SystemIntakes{
				models.SystemIntake{
					EUAUserID: fakeEuaID,
				},
			}, nil
		}
		fetchSystemIntakesByEuaID := NewFetchSystemIntakesByEuaID(serviceConfig, fetch, authorize)
		intakes, err := fetchSystemIntakesByEuaID(context.Background(), fakeEuaID)
		s.NoError(err)
		s.Equal(fakeEuaID, intakes[0].EUAUserID)
	})

	s.Run("returns query error when fetch fails", func() {
		fetch := func(ctx context.Context, euaID string) (models.SystemIntakes, error) {
			return models.SystemIntakes{}, errors.New("fetch failed")
		}
		fetchSystemIntakesByEuaID := NewFetchSystemIntakesByEuaID(serviceConfig, fetch, authorize)
		intakes, err := fetchSystemIntakesByEuaID(context.Background(), "FAKE")

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(models.SystemIntakes{}, intakes)
	})
}

func (s ServicesTestSuite) TestNewCreateSystemIntake() {
	logger := zap.NewNop()
	fakeEuaID := "FAKE"
	requester := "Test Requester"
	serviceConfig := NewConfig(logger, nil)
	serviceConfig.clock = clock.NewMock()
	ctx := context.Background()
	ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{EUAID: fakeEuaID, JobCodeEASi: true})

	s.Run("successfully creates a system intake without an error", func() {
		create := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{
				EUAUserID: intake.EUAUserID,
				Requester: requester,
				Status:    models.SystemIntakeStatusDRAFT,
			}, nil
		}
		createIntake := NewCreateSystemIntake(serviceConfig, create)
		intake, err := createIntake(ctx, &models.SystemIntake{
			Requester: requester,
			Status:    models.SystemIntakeStatusDRAFT,
		})
		s.NoError(err)
		s.Equal(fakeEuaID, intake.EUAUserID)
	})

	s.Run("returns query error when create fails", func() {
		create := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("creation failed")
		}
		createIntake := NewCreateSystemIntake(serviceConfig, create)
		intake, err := createIntake(ctx, &models.SystemIntake{
			Requester: requester,
			Status:    models.SystemIntakeStatusDRAFT,
		})
		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})
}

func (s ServicesTestSuite) TestAuthorizeUserIsIntakeRequester() {
	authorizeSaveSystemIntake := NewAuthorizeUserIsIntakeRequester()

	s.Run("No EUA ID fails auth", func() {
		ctx := context.Background()

		ok, err := authorizeSaveSystemIntake(ctx, &models.SystemIntake{})

		s.False(ok)
		s.IsType(&apperrors.ContextError{}, err)
	})

	s.Run("Mismatched EUA ID fails auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{EUAID: "ZYXW", JobCodeEASi: true})

		intake := models.SystemIntake{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeSaveSystemIntake(ctx, &intake)

		s.False(ok)
		s.NoError(err)
	})

	s.Run("Matched EUA ID passes auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{EUAID: "ABCD", JobCodeEASi: true})

		intake := models.SystemIntake{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeSaveSystemIntake(ctx, &intake)

		s.True(ok)
		s.NoError(err)
	})
}

func (s ServicesTestSuite) TestNewUpdateSystemIntake() {
	logger := zap.NewNop()
	fetch := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return &models.SystemIntake{
			Status: models.SystemIntakeStatusDRAFT,
		}, nil
	}

	fetchSubmitted := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return &models.SystemIntake{
			Status: models.SystemIntakeStatusSUBMITTED,
		}, nil
	}

	requester := "Test Requester"
	save := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		return &models.SystemIntake{
			EUAUserID: intake.EUAUserID,
			Requester: requester,
			Status:    intake.Status,
			AlfabetID: intake.AlfabetID,
		}, nil
	}
	authorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
		return true, nil
	}
	fetchEmailAddress := func(logger2 *zap.Logger, euaID string) (string, error) {
		return "sample@sample.com", nil
	}
	reviewEmailCount := 0
	sendReviewEmail := func(emailText string, recipientAddress string) error {
		reviewEmailCount++
		return nil
	}
	serviceConfig := NewConfig(logger, nil)
	serviceConfig.clock = clock.NewMock()
	updateDraftIntake := func(ctx context.Context, existing *models.SystemIntake, incoming *models.SystemIntake) (*models.SystemIntake, error) {
		return incoming, nil
	}

	submitIntake := func(ctx context.Context, existing *models.SystemIntake, incoming *models.SystemIntake) (*models.SystemIntake, error) {
		return incoming, nil
	}

	s.Run("returns no error when successful on update draft", func() {
		ctx := context.Background()
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, fetch, authorize, fetchEmailAddress, sendReviewEmail, updateDraftIntake, submitIntake, true)

		intake, err := updateSystemIntake(ctx, &models.SystemIntake{
			Status:    models.SystemIntakeStatusDRAFT,
			Requester: requester,
		})

		s.NoError(err)
		s.Equal(requester, intake.Requester)
	})

	s.Run("returns query error when fetch fails", func() {
		ctx := context.Background()
		failFetch := func(ctx context.Context, uuid uuid.UUID) (*models.SystemIntake, error) {
			return nil, errors.New("failed to fetch system intake")
		}
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, failFetch, authorize, fetchEmailAddress, sendReviewEmail, updateDraftIntake, submitIntake, true)

		intake, err := updateSystemIntake(ctx, &models.SystemIntake{})

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns error from update draft", func() {
		ctx := context.Background()
		updateDraftError := errors.New("error")
		failUpdateDraft := func(ctx context.Context, existingUpdate *models.SystemIntake, updatingIntake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, updateDraftError
		}
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, fetch, authorize, fetchEmailAddress, sendReviewEmail, failUpdateDraft, submitIntake, true)

		intake, err := updateSystemIntake(ctx, &models.SystemIntake{
			Status: models.SystemIntakeStatusDRAFT,
		})
		s.Equal(updateDraftError, err)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns error from submit", func() {
		ctx := context.Background()
		submitError := errors.New("error")
		failSubmit := func(ctx context.Context, existingUpdate *models.SystemIntake, updatingIntake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, submitError
		}
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, fetch, authorize, fetchEmailAddress, sendReviewEmail, updateDraftIntake, failSubmit, true)

		intake, err := updateSystemIntake(ctx, &models.SystemIntake{
			Status: models.SystemIntakeStatusSUBMITTED,
		})
		s.Equal(submitError, err)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns error when authorization errors", func() {
		ctx := context.Background()
		err := errors.New("authorization failed")
		failAuthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, err
		}
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, fetchSubmitted, failAuthorize, fetchEmailAddress, sendReviewEmail, updateDraftIntake, submitIntake, true)

		intake, actualError := updateSystemIntake(ctx, &models.SystemIntake{Status: models.SystemIntakeStatusAPPROVED})

		s.Error(err)
		s.Equal(err, actualError)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns unauthorized error when authorization not ok", func() {
		ctx := context.Background()
		notOKAuthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, nil
		}
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, fetchSubmitted, notOKAuthorize, fetchEmailAddress, sendReviewEmail, updateDraftIntake, submitIntake, true)

		intake, err := updateSystemIntake(ctx, &models.SystemIntake{Status: models.SystemIntakeStatusAPPROVED})

		s.IsType(&apperrors.UnauthorizedError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns error from fetching requester email", func() {
		ctx := context.Background()
		failFetchEmailAddress := func(logger *zap.Logger, euaID string) (string, error) {
			return "", &apperrors.ExternalAPIError{
				Err:       errors.New("sample error"),
				Model:     models2.Person{},
				ModelID:   euaID,
				Operation: apperrors.Fetch,
				Source:    "CEDAR LDAP",
			}
		}
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, fetchSubmitted, authorize, failFetchEmailAddress, sendReviewEmail, updateDraftIntake, submitIntake, true)

		intake, err := updateSystemIntake(ctx, &models.SystemIntake{Status: models.SystemIntakeStatusAPPROVED})

		s.IsType(&apperrors.ExternalAPIError{}, err)
		s.Equal(0, reviewEmailCount)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns ExternalAPIError if requester email not returned", func() {
		ctx := context.Background()
		failFetchEmailAddress := func(logger *zap.Logger, euaID string) (string, error) {
			return "", nil
		}
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, fetchSubmitted, authorize, failFetchEmailAddress, sendReviewEmail, updateDraftIntake, submitIntake, true)

		intake, err := updateSystemIntake(ctx, &models.SystemIntake{Status: models.SystemIntakeStatusAPPROVED})

		s.IsType(&apperrors.ExternalAPIError{}, err)
		s.Equal(0, reviewEmailCount)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns notification error when review email fails", func() {
		ctx := context.Background()
		failSendReviewEmail := func(emailText string, recipientAddress string) error {
			return &apperrors.NotificationError{
				Err:             errors.New("failed to send Email"),
				DestinationType: apperrors.DestinationTypeEmail,
			}
		}
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, fetchSubmitted, authorize, fetchEmailAddress, failSendReviewEmail, updateDraftIntake, submitIntake, true)

		intake, err := updateSystemIntake(ctx, &models.SystemIntake{Status: models.SystemIntakeStatusAPPROVED})

		s.IsType(&apperrors.NotificationError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns resource conflict error when making unauthorized status change", func() {
		ctx := context.Background()
		updateSystemIntake := NewUpdateSystemIntake(serviceConfig, save, fetchSubmitted, authorize, fetchEmailAddress, sendReviewEmail, updateDraftIntake, submitIntake, true)

		// In this case, saving a DRAFT intake against an existing SUBMITTED intake
		intake, err := updateSystemIntake(ctx, &models.SystemIntake{Status: models.SystemIntakeStatusDRAFT})

		s.IsType(&apperrors.ResourceConflictError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})
}

func (s ServicesTestSuite) TestNewUpdateDraftSystemIntake() {
	logger := zap.NewNop()
	serviceConfig := NewConfig(logger, nil)
	ctx := context.Background()

	authorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) { return true, nil }
	update := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		return intake, nil
	}
	existing := models.SystemIntake{Requester: "existing"}
	incoming := models.SystemIntake{Requester: "incoming"}
	s.Run("golden path update draft intake", func() {
		updateDraftSystemIntake := NewUpdateDraftSystemIntake(serviceConfig, authorize, update)
		intake, err := updateDraftSystemIntake(ctx, &existing, &incoming)

		s.NoError(err)
		s.Equal(&incoming, intake)
	})

	s.Run("returns error from authorization if authorization fails", func() {
		authorizationError := errors.New("authorization failed")
		failAuthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, authorizationError
		}
		updateDraftSystemIntake := NewUpdateDraftSystemIntake(serviceConfig, failAuthorize, update)
		intake, err := updateDraftSystemIntake(ctx, &existing, &incoming)

		s.Equal(authorizationError, err)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns unauthorized error if authorization denied", func() {
		unauthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, nil
		}
		updateDraftSystemIntake := NewUpdateDraftSystemIntake(serviceConfig, unauthorize, update)
		intake, err := updateDraftSystemIntake(ctx, &existing, &incoming)

		s.IsType(&apperrors.UnauthorizedError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns query error if update fails", func() {
		failUpdate := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("update error")
		}
		updateDraftSystemIntake := NewUpdateDraftSystemIntake(serviceConfig, authorize, failUpdate)
		intake, err := updateDraftSystemIntake(ctx, &existing, &incoming)

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})
}

func (s ServicesTestSuite) TestNewSubmitSystemIntake() {
	logger := zap.NewNop()
	serviceConfig := NewConfig(logger, nil)
	ctx := context.Background()

	authorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) { return true, nil }
	update := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		return intake, nil
	}
	submit := func(c context.Context, intake *models.SystemIntake) (string, error) {
		return "ALFABET-ID", nil
	}
	submitEmailCount := 0
	sendSubmitEmail := func(requester string, intakeID uuid.UUID) error {
		submitEmailCount++
		return nil
	}

	s.Run("golden path submit intake", func() {
		existing := models.SystemIntake{Requester: "existing"}
		incoming := models.SystemIntake{Requester: "incoming"}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, sendSubmitEmail)
		s.Equal(0, submitEmailCount)

		intake, err := submitSystemIntake(ctx, &existing, &incoming)

		s.NoError(err)
		s.Equal(&incoming, intake)
		s.Equal(1, submitEmailCount)
		s.Equal("ALFABET-ID", intake.AlfabetID.String)

		submitEmailCount = 0
	})

	s.Run("returns error from authorization if authorization fails", func() {
		existing := models.SystemIntake{Requester: "existing"}
		incoming := models.SystemIntake{Requester: "incoming"}
		authorizationError := errors.New("authorization failed")
		failAuthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, authorizationError
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, failAuthorize, update, submit, sendSubmitEmail)
		intake, err := submitSystemIntake(ctx, &existing, &incoming)

		s.Equal(authorizationError, err)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns unauthorized error if authorization denied", func() {
		existing := models.SystemIntake{Requester: "existing"}
		incoming := models.SystemIntake{Requester: "incoming"}
		unauthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, nil
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, unauthorize, update, submit, sendSubmitEmail)
		intake, err := submitSystemIntake(ctx, &existing, &incoming)

		s.IsType(&apperrors.UnauthorizedError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns error when validation fails", func() {
		existing := models.SystemIntake{Requester: "existing"}
		incoming := models.SystemIntake{Requester: "incoming"}
		failValidationSubmit := func(_ context.Context, intake *models.SystemIntake) (string, error) {
			return "", &apperrors.ValidationError{
				Err:     errors.New("validation failed on these fields: ID"),
				ModelID: intake.ID.String(),
				Model:   intake,
			}
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, failValidationSubmit, sendSubmitEmail)
		intake, err := submitSystemIntake(ctx, &existing, &incoming)

		s.IsType(&apperrors.ValidationError{}, err)
		s.Equal(0, submitEmailCount)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns error when submission fails", func() {
		existing := models.SystemIntake{Requester: "existing"}
		incoming := models.SystemIntake{Requester: "incoming"}
		failValidationSubmit := func(_ context.Context, intake *models.SystemIntake) (string, error) {
			return "", &apperrors.ExternalAPIError{
				Err:       errors.New("CEDAR return result: unexpected failure"),
				ModelID:   intake.ID.String(),
				Model:     intake,
				Operation: apperrors.Submit,
				Source:    "CEDAR",
			}
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, failValidationSubmit, sendSubmitEmail)
		intake, err := submitSystemIntake(ctx, &existing, &incoming)

		s.IsType(&apperrors.ExternalAPIError{}, err)
		s.Equal(0, submitEmailCount)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns error when intake has already been submitted", func() {
		existing := models.SystemIntake{Requester: "existing"}
		alreadySubmittedIntake := models.SystemIntake{
			AlfabetID: null.StringFrom("394-141-0"),
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, update, submit, sendSubmitEmail)
		intake, err := submitSystemIntake(ctx, &existing, &alreadySubmittedIntake)

		s.IsType(&apperrors.ResourceConflictError{}, err)
		s.Equal(0, submitEmailCount)
		s.Equal(&models.SystemIntake{}, intake)
	})

	s.Run("returns query error if update fails", func() {
		existing := models.SystemIntake{Requester: "existing"}
		incoming := models.SystemIntake{Requester: "incoming"}
		failUpdate := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("update error")
		}
		submitSystemIntake := NewSubmitSystemIntake(serviceConfig, authorize, failUpdate, submit, sendSubmitEmail)
		intake, err := submitSystemIntake(ctx, &existing, &incoming)

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})
}

func (s ServicesTestSuite) TestSystemIntakeByIDFetcher() {
	logger := zap.NewNop()
	fakeID := uuid.New()
	serviceConfig := NewConfig(logger, nil)
	serviceConfig.clock = clock.NewMock()
	authorize := func(context context.Context, intake *models.SystemIntake) (bool, error) { return true, nil }

	s.Run("successfully fetches System Intake by ID without an error", func() {
		fetch := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
			return &models.SystemIntake{
				ID: fakeID,
			}, nil
		}
		fetchSystemIntakeByID := NewFetchSystemIntakeByID(serviceConfig, fetch, authorize)
		intake, err := fetchSystemIntakeByID(context.Background(), fakeID)
		s.NoError(err)

		s.Equal(fakeID, intake.ID)
	})

	s.Run("returns query error when save fails", func() {
		fetch := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("save failed")
		}
		fetchSystemIntakeByID := NewFetchSystemIntakeByID(serviceConfig, fetch, authorize)

		intake, err := fetchSystemIntakeByID(context.Background(), uuid.New())

		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(&models.SystemIntake{}, intake)
	})
}

func (s ServicesTestSuite) TestAuthorizeArchiveSystemIntake() {
	logger := zap.NewNop()
	authorizeArchiveSystemIntake := NewAuthorizeArchiveSystemIntake(logger)

	s.Run("No EUA ID fails auth", func() {
		ctx := context.Background()

		ok, err := authorizeArchiveSystemIntake(ctx, &models.SystemIntake{})

		s.False(ok)
		s.IsType(&apperrors.ContextError{}, err)
	})

	s.Run("Mismatched EUA ID fails auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{EUAID: "ZYXW", JobCodeEASi: true})
		intake := models.SystemIntake{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeArchiveSystemIntake(ctx, &intake)

		s.False(ok)
		s.NoError(err)
	})

	s.Run("Matched EUA ID passes auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{EUAID: "ABCD", JobCodeEASi: true})
		intake := models.SystemIntake{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeArchiveSystemIntake(ctx, &intake)

		s.True(ok)
		s.NoError(err)
	})
}

func (s ServicesTestSuite) TestSystemIntakeArchiver() {
	logger := zap.NewNop()
	fakeID := uuid.New()
	businessCaseID := uuid.New()
	serviceConfig := NewConfig(logger, nil)
	serviceConfig.clock = clock.NewMock()
	ctx := context.Background()

	fetch := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
		return &models.SystemIntake{
			ID:             id,
			BusinessCaseID: &businessCaseID,
		}, nil
	}
	update := func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error) {
		return intake, nil
	}
	archiveBusinessCase := func(ctx context.Context, id uuid.UUID) error {
		return nil
	}
	authorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
		return true, nil
	}
	sendWithdrawEmail := func(requestName string) error {
		return nil
	}

	s.Run("golden path archive system intake", func() {
		archiveSystemIntake := NewArchiveSystemIntake(serviceConfig, fetch, update, archiveBusinessCase, authorize, sendWithdrawEmail)
		err := archiveSystemIntake(ctx, fakeID)
		s.NoError(err)
	})

	s.Run("returns query error when fetch fails", func() {
		failFetch := func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("fetch failed")
		}
		archiveSystemIntake := NewArchiveSystemIntake(serviceConfig, failFetch, update, archiveBusinessCase, authorize, sendWithdrawEmail)
		err := archiveSystemIntake(ctx, fakeID)
		s.IsType(&apperrors.QueryError{}, err)
	})

	s.Run("returns error when authorization errors", func() {
		actualError := errors.New("authorize failed")
		failAuthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, actualError
		}
		archiveSystemIntake := NewArchiveSystemIntake(serviceConfig, fetch, update, archiveBusinessCase, failAuthorize, sendWithdrawEmail)
		err := archiveSystemIntake(ctx, fakeID)
		s.Error(err)
		s.Equal(actualError, err)
	})

	s.Run("returns unauthorized error when authorization not ok", func() {
		failAuthorize := func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
			return false, nil
		}
		archiveSystemIntake := NewArchiveSystemIntake(serviceConfig, fetch, update, archiveBusinessCase, failAuthorize, sendWithdrawEmail)
		err := archiveSystemIntake(ctx, fakeID)
		s.IsType(&apperrors.UnauthorizedError{}, err)
	})

	s.Run("returns error from archive business case", func() {
		actualError := errors.New("failed to archive business case")
		failArchiveBusinessCase := func(ctx context.Context, id uuid.UUID) error {
			return actualError
		}
		archiveSystemIntake := NewArchiveSystemIntake(serviceConfig, fetch, update, failArchiveBusinessCase, authorize, sendWithdrawEmail)
		err := archiveSystemIntake(ctx, fakeID)
		s.Error(err)
		s.Equal(actualError, err)
	})

	s.Run("returns query error when update fails", func() {
		failUpdate := func(ctx context.Context, businessCase *models.SystemIntake) (*models.SystemIntake, error) {
			return &models.SystemIntake{}, errors.New("update failed")
		}
		archiveSystemIntake := NewArchiveSystemIntake(serviceConfig, fetch, failUpdate, archiveBusinessCase, authorize, sendWithdrawEmail)
		err := archiveSystemIntake(ctx, fakeID)
		s.IsType(&apperrors.QueryError{}, err)
	})

}
