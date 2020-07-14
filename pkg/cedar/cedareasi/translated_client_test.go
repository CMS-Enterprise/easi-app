package cedareasi

import (
	"fmt"
	"time"

	"github.com/facebookgo/clock"
	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s CedarEasiTestSuite) TestValidateSystemIntakeForCedar() {
	logger := zap.NewNop()
	clockTime := clock.NewMock().Now()
	id := uuid.New()
	intake := models.SystemIntake{
		ID:                      id,
		EUAUserID:               "FAKE",
		Status:                  "SUBMITTED",
		Requester:               "Fake Requester",
		Component:               null.StringFrom("Fake Component"),
		BusinessOwner:           null.StringFrom("Fake Business Owner"),
		BusinessOwnerComponent:  null.StringFrom("Fake Business Owner Component"),
		ProductManager:          null.StringFrom("Fake Product Manager"),
		ProductManagerComponent: null.StringFrom("Fake Product Manager Component"),
		ISSO:                    null.String{},
		TRBCollaborator:         null.StringFrom("Fake TRBCollaborator"),
		OITSecurityCollaborator: null.String{},
		EACollaborator:          null.StringFrom("Fake EACollaborator"),
		ProjectName:             null.StringFrom("Fake Project Name"),
		ExistingFunding:         null.BoolFrom(false),
		FundingSource:           null.String{},
		BusinessNeed:            null.StringFrom("Fake Business Need"),
		Solution:                null.StringFrom("Fake Solution"),
		ProcessStatus:           null.StringFrom("Just an idea"),
		EASupportRequest:        null.BoolFrom(false),
		ExistingContract:        null.StringFrom("No"),
		UpdatedAt:               &clockTime,
		SubmittedAt:             &clockTime,
		AlfabetID:               null.String{},
	}
	s.Run("A valid system intake passes validation", func() {
		err := ValidateSystemIntakeForCedar(&intake, logger)
		s.NoError(err)
	})

	s.Run("An intake without a required null string fails", func() {
		intake.Component = null.String{}
		err := ValidateSystemIntakeForCedar(&intake, logger)
		s.IsType(&apperrors.ValidationError{}, err)
		expectedErrString := fmt.Sprintf(
			"Could not validate *models.SystemIntake %s: {\"Component\":\"is required\"}",
			id.String(),
		)
		s.EqualError(err, expectedErrString)
		// Reset intake fields
		intake.Component = null.StringFrom("Fake Component")
	})

	s.Run("An intake without a required null bool fails", func() {
		intake.ExistingFunding = null.Bool{}
		err := ValidateSystemIntakeForCedar(&intake, logger)
		s.IsType(&apperrors.ValidationError{}, err)
		expectedErrString := fmt.Sprintf(
			"Could not validate *models.SystemIntake %s: {\"ExistingFunding\":\"is required\"}",
			id.String(),
		)
		s.EqualError(err, expectedErrString)

		// Reset intake fields
		intake.ExistingFunding = null.BoolFrom(false)
	})

	s.Run("An intake with existing funding requires a funding source", func() {
		intake.ExistingFunding = null.BoolFrom(true)
		err := ValidateSystemIntakeForCedar(&intake, logger)
		s.IsType(&apperrors.ValidationError{}, err)
		expectedErrString := fmt.Sprintf(
			"Could not validate *models.SystemIntake %s: {\"FundingSource\":\"is required\"}",
			id.String(),
		)
		s.EqualError(err, expectedErrString)

		// Reset intake fields
		intake.ExistingFunding = null.BoolFrom(false)
	})

	s.Run("An intake with a required funding source fails if it is not 6 digits", func() {
		intake.ExistingFunding = null.BoolFrom(true)
		intake.FundingSource = null.StringFrom("12")
		err := ValidateSystemIntakeForCedar(&intake, logger)
		s.IsType(&apperrors.ValidationError{}, err)
		expectedErrString := fmt.Sprintf(
			"Could not validate *models.SystemIntake %s: {\"FundingSource\":\"must be a 6 digit string\"}",
			id.String(),
		)
		s.EqualError(err, expectedErrString)

		// Reset intake fields
		intake.ExistingFunding = null.BoolFrom(false)
		intake.FundingSource = null.String{}
	})

	s.Run("An intake with a required funding source passes if it is 6 digits", func() {
		intake.ExistingFunding = null.BoolFrom(true)
		intake.FundingSource = null.StringFrom("123456")
		err := ValidateSystemIntakeForCedar(&intake, logger)
		s.NoError(err)

		// Reset intake fields
		intake.ExistingFunding = null.BoolFrom(false)
		intake.FundingSource = null.String{}
	})

	s.Run("An intake with a no existing funding doesn't validate funding source", func() {
		intake.ExistingFunding = null.BoolFrom(false)
		intake.FundingSource = null.String{}
		err := ValidateSystemIntakeForCedar(&intake, logger)
		s.NoError(err)
	})

	s.Run("An intake without a required string fails", func() {
		intake.EUAUserID = ""
		err := ValidateSystemIntakeForCedar(&intake, logger)
		s.IsType(&apperrors.ValidationError{}, err)
		expectedErrString := fmt.Sprintf(
			"Could not validate *models.SystemIntake %s: {\"EUAUserID\":\"is required\"}",
			id.String(),
		)
		s.EqualError(err, expectedErrString)

		// Reset intake fields
		intake.EUAUserID = "FAKE"
	})

	s.Run("An intake without a required id fails", func() {
		intake.ID = uuid.Nil
		err := ValidateSystemIntakeForCedar(&intake, logger)
		s.IsType(&apperrors.ValidationError{}, err)
		expectedErrString := fmt.Sprintf(
			"Could not validate *models.SystemIntake %s: {\"ID\":\"is required\"}",
			uuid.Nil.String(),
		)
		s.EqualError(err, expectedErrString)

		// Reset intake fields
		intake.ID = id
	})

	s.Run("An intake without a required time fails", func() {
		intake.SubmittedAt = &time.Time{}
		err := ValidateSystemIntakeForCedar(&intake, logger)
		s.IsType(&apperrors.ValidationError{}, err)
		expectedErrString := fmt.Sprintf(
			"Could not validate *models.SystemIntake %s: {\"SubmittedAt\":\"is required\"}",
			id.String(),
		)
		s.EqualError(err, expectedErrString)

		// Reset intake fields
		intake.SubmittedAt = &clockTime
	})
}
