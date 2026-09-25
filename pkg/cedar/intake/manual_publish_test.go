package intake

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"reflect"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/guregu/null/zero"
	"github.com/lib/pq"
	"github.com/stretchr/testify/require"
	"github.com/vikstrous/dataloadgen"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	intakemodels "github.com/cms-enterprise/easi-app/pkg/cedar/intake/models"
	"github.com/cms-enterprise/easi-app/pkg/cedar/intake/translation"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

const manualCEDARPublishEnv = "CEDAR_MANUAL_PUBLISH"

type fullyPopulatedIntakeFixture struct {
	intake          models.SystemIntake
	contacts        []*models.SystemIntakeContact
	accounts        map[uuid.UUID]*authentication.UserAccount
	contractNumbers []*models.SystemIntakeContractNumber
}

func TestFullyPopulatedSystemIntakesTranslate(t *testing.T) {
	fixtures := fullyPopulatedSystemIntakeFixtures()
	ctx := fullyPopulatedIntakeContext(fixtures)

	for _, fixture := range fixtures {
		t.Run(fixture.intake.ProjectName.ValueOrZero(), func(t *testing.T) {
			translatable := translation.TranslatableSystemIntake(fixture.intake)
			input, err := translatable.CreateIntakeModel(ctx)
			require.NoError(t, err)
			require.NotNil(t, input.Body)

			var body intakemodels.EASIIntake
			require.NoError(t, json.Unmarshal([]byte(*input.Body), &body))
			requireFullyPopulatedEASIIntake(t, &body)
			requireNewCEDARFieldsMatch(t, fixture.intake, body)
		})
	}
}

// TestManualPublishFullyPopulatedSystemIntakes is intentionally opt-in because it performs live CEDAR writes.
// Run it with CEDAR_MANUAL_PUBLISH=true and the CEDAR_API_URL/CEDAR_API_KEY variables set.
func TestManualPublishFullyPopulatedSystemIntakes(t *testing.T) {
	// if os.Getenv(manualCEDARPublishEnv) != "true" {
	// 	t.Skipf("set %s=true to submit the temporary test intakes to CEDAR", manualCEDARPublishEnv)
	// }

	require.NotEmpty(t, os.Getenv(appconfig.CEDARAPIURL), "%s must be set", appconfig.CEDARAPIURL)
	require.NotEmpty(t, os.Getenv(appconfig.CEDARAPIKey), "%s must be set", appconfig.CEDARAPIKey)

	fixtures := fullyPopulatedSystemIntakeFixtures()
	ctx := fullyPopulatedIntakeContext(fixtures)
	submitFullyPopulatedSystemIntakes(t, ctx, fixtures)
}

// submitFullyPopulatedSystemIntakes is a temporary helper for manually sending these fixtures to CEDAR.
func submitFullyPopulatedSystemIntakes(t *testing.T, ctx context.Context, fixtures []fullyPopulatedIntakeFixture) {
	t.Helper()

	client := NewClient(
		os.Getenv(appconfig.CEDARAPIURL),
		os.Getenv(appconfig.CEDARAPIKey),
		true,
		false,
	)
	require.NoError(t, client.CheckConnection(ctx))

	for _, fixture := range fixtures {
		translatable := translation.TranslatableSystemIntake(fixture.intake)
		input, err := translatable.CreateIntakeModel(ctx)
		require.NoError(t, err)
		require.NotNil(t, input.Body)

		t.Logf(
			"submitting fully populated CEDAR intake %s (%s)\npayload: %s",
			fixture.intake.ProjectName.ValueOrZero(),
			fixture.intake.ID,
			*input.Body,
		)
		require.NoError(t, client.PublishSystemIntake(ctx, fixture.intake))
		t.Logf("submitted CEDAR intake %s", fixture.intake.ID)
	}
}

func fullyPopulatedSystemIntakeFixtures() []fullyPopulatedIntakeFixture {
	return []fullyPopulatedIntakeFixture{
		newFullyPopulatedSystemIntakeFixture("A", false),
		newFullyPopulatedSystemIntakeFixture("B", true),
	}
}

func newFullyPopulatedSystemIntakeFixture(label string, alternateValues bool) fullyPopulatedIntakeFixture {
	intakeID := uuid.New()
	requesterID := uuid.New()
	businessOwnerID := uuid.New()
	productManagerID := uuid.New()

	createdAt := time.Date(2025, time.January, 2, 15, 4, 5, 0, time.UTC)
	updatedAt := createdAt.Add(24 * time.Hour)
	submittedAt := createdAt.Add(2 * time.Hour)
	decidedAt := createdAt.Add(14 * 24 * time.Hour)
	archivedAt := createdAt.Add(30 * 24 * time.Hour)
	grtDate := createdAt.Add(7 * 24 * time.Hour)
	grbDate := createdAt.Add(12 * 24 * time.Hour)
	contractStartDate := time.Date(2025, time.February, 1, 0, 0, 0, 0, time.UTC)
	contractEndDate := time.Date(2030, time.January, 31, 0, 0, 0, 0, time.UTC)
	lifecycleIssuedAt := createdAt.Add(14 * 24 * time.Hour)
	lifecycleExpirationAlertTS := time.Date(2028, time.January, 16, 15, 4, 5, 0, time.UTC)
	lifecycleExpiresAt := time.Date(2028, time.February, 1, 0, 0, 0, 0, time.UTC)
	lifecycleRetiresAt := time.Date(2030, time.February, 1, 0, 0, 0, 0, time.UTC)

	digitalServiceInteraction := models.YesNoNotSureYes
	protectedCMSDataAccessedOutside := models.YesNoNotSureNotSure
	lcidType := models.LCIDTypeNewSystem
	lcidComponent := models.SystemIntakeContactComponentOfficeOfInformationTechnologyOit
	trbFollowUpRecommendation := models.TRBFRStronglyRecommended
	lcidIsLowIT := true
	lcidIsShortened := false
	doesNotSupportSystems := false
	governanceTeamsIsPresent := true
	euaUserID := "TSTA"
	fundingNumber := "123456"
	lifecycleID := "345678"
	contractNumber := "HHSM-500-2025-00001I"

	if alternateValues {
		digitalServiceInteraction = models.YesNoNotSureNo
		protectedCMSDataAccessedOutside = models.YesNoNotSureYes
		lcidType = models.LCIDTypeRecompete
		lcidComponent = models.SystemIntakeContactComponentCenterForMedicaidAndChipServicesCmcs
		trbFollowUpRecommendation = models.TRBFRRecommendedButNotCritical
		lcidIsLowIT = false
		lcidIsShortened = true
		doesNotSupportSystems = true
		governanceTeamsIsPresent = false
		euaUserID = "TSTB"
		fundingNumber = "654321"
		lifecycleID = "876543"
		contractNumber = "HHSM-500-2025-00002I"
	}

	intake := models.SystemIntake{
		ID:                                   intakeID,
		EUAUserID:                            null.StringFrom(euaUserID),
		State:                                models.SystemIntakeStateOpen,
		Step:                                 models.SystemIntakeStepDECISION,
		RequestType:                          models.SystemIntakeRequestTypeNEW,
		Requester:                            "Temporary Requester " + label,
		Component:                            null.StringFrom("Office of Information Technology"),
		BusinessOwner:                        null.StringFrom("Temporary Business Owner " + label),
		BusinessOwnerComponent:               null.StringFrom("Office of Information Technology"),
		ProductManager:                       null.StringFrom("Temporary Product Manager " + label),
		ProductManagerComponent:              null.StringFrom("Office of Information Technology"),
		ISSOName:                             null.StringFrom("Temporary ISSO " + label),
		TRBCollaboratorName:                  null.StringFrom("Temporary TRB Collaborator " + label),
		OITSecurityCollaboratorName:          null.StringFrom("Temporary Security Collaborator " + label),
		EACollaboratorName:                   null.StringFrom("Temporary EA Collaborator " + label),
		CollaboratorName508:                  null.StringFrom("Temporary 508 Collaborator " + label),
		GovernanceTeamsIsPresent:             null.BoolFrom(governanceTeamsIsPresent),
		ProjectName:                          null.StringFrom("Temporary Fully Populated CEDAR Intake " + label),
		ProjectAcronym:                       null.StringFrom("TFPCI" + label),
		BusinessNeed:                         null.StringFrom("Demonstrate a fully populated EASi intake payload for CEDAR."),
		Solution:                             null.StringFrom("Send representative synthetic values for every supported intake field."),
		PriorityAlignment:                    null.StringFrom("CMS modernization and secure digital services"),
		ProcessStatus:                        null.StringFrom("Decision issued"),
		EASupportRequest:                     null.BoolFrom(true),
		ExistingContract:                     null.StringFrom("HAVE_CONTRACT"),
		CostIncrease:                         null.StringFrom("YES"),
		CostIncreaseAmount:                   null.StringFrom("Between $1 million and $5 million"),
		CurrentAnnualSpending:                null.StringFrom("Less than $1 million"),
		CurrentAnnualSpendingITPortion:       null.StringFrom("25%"),
		PlannedYearOneSpending:               null.StringFrom("Between $1 million and $5 million"),
		PlannedYearOneSpendingITPortion:      null.StringFrom("30%"),
		CurrentEstimatedCost:                 null.StringFrom("Between $1 million and $5 million"),
		CurrentEstimatedCostITPortion:        null.StringFrom("40%"),
		EstimatedTotalContractValue:          null.StringFrom("Between $5 million and $10 million"),
		EstimatedTotalContractValueITPortion: null.StringFrom("55%"),
		Contractor:                           null.StringFrom("Temporary Test Contractor"),
		ContractVehicle:                      null.StringFrom("GSA MAS"),
		ContractStartDate:                    &contractStartDate,
		ContractEndDate:                      &contractEndDate,
		CreatedAt:                            &createdAt,
		UpdatedAt:                            &updatedAt,
		SubmittedAt:                          &submittedAt,
		DecidedAt:                            &decidedAt,
		ArchivedAt:                           &archivedAt,
		GRTDate:                              &grtDate,
		GRBDate:                              &grbDate,
		RequesterEmailAddress:                null.StringFrom("temporary.requester." + label + "@example.com"),
		LifecycleID:                          null.StringFrom(lifecycleID),
		LifecycleExpiresAt:                   &lifecycleExpiresAt,
		LifecycleScope:                       models.HTMLPointer("Development, operation, and maintenance of the temporary service."),
		LifecycleCostBaseline:                null.StringFrom("$7.5 million"),
		LCIDType:                             helpers.PointerTo(lcidType),
		LCIDComponent:                        helpers.PointerTo(lcidComponent),
		LCIDIsLowIT:                          &lcidIsLowIT,
		LCIDIsShortened:                      &lcidIsShortened,
		LifecycleExpirationAlertTS:           &lifecycleExpirationAlertTS,
		LifecycleRetiresAt:                   &lifecycleRetiresAt,
		LifecycleIssuedAt:                    &lifecycleIssuedAt,
		DecisionNextSteps:                    models.HTMLPointer("Proceed with acquisition planning and implementation."),
		RejectionReason:                      models.HTMLPointer("Not applicable; populated for payload completeness."),
		AdminLead:                            null.StringFrom("Temporary Admin Lead " + label),
		ExistingFunding:                      null.BoolFrom(true),
		FundingSource:                        null.StringFrom("HITECH Medicare"),
		FundingNumber:                        null.StringFrom(fundingNumber),
		FundingSources: []*models.SystemIntakeFundingSource{
			{
				ID:             uuid.New(),
				SystemIntakeID: intakeID,
				Investment:     null.StringFrom("HITECH Medicare"),
				ProjectNumber:  null.StringFrom(fundingNumber),
				CreatedAt:      &createdAt,
			},
		},
		HasUIChanges:                               null.BoolFrom(true),
		UsesAITech:                                 null.BoolFrom(true),
		DigitalServiceInteraction:                  &digitalServiceInteraction,
		DigitalServiceInteractionDescription:       null.StringFrom("Beneficiaries interact with the service through an authenticated web application."),
		ProtectedCmsDataAccessedOutside:            &protectedCMSDataAccessedOutside,
		ProtectedCmsDataAccessedOutsideDescription: null.StringFrom("Approved contractor personnel use CMS-managed secure access tooling."),
		UsingSoftware:                              zero.StringFrom("YES"),
		AcquisitionMethods: pq.StringArray{
			string(models.SystemIntakeSoftwareAcquisitionContractorFurnished),
			string(models.SystemIntakeSoftwareAcquisitionELAOrInternal),
		},
		RequestFormState:          models.SIRFSSubmitted,
		DraftBusinessCaseState:    models.SIRFSSubmitted,
		FinalBusinessCaseState:    models.SIRFSSubmitted,
		DecisionState:             models.SIDSLcidIssued,
		TRBFollowUpRecommendation: &trbFollowUpRecommendation,
		DoesNotSupportSystems:     null.BoolFrom(doesNotSupportSystems),
	}

	requester := newFullyPopulatedIntakeContact(
		intakeID,
		requesterID,
		models.SystemIntakeContactComponentOfficeOfInformationTechnologyOit,
		nil,
		true,
	)
	businessOwner := newFullyPopulatedIntakeContact(
		intakeID,
		businessOwnerID,
		models.SystemIntakeContactComponentOfficeOfInformationTechnologyOit,
		models.EnumArray[models.SystemIntakeContactRole]{models.SystemIntakeContactRoleBusinessOwner},
		false,
	)
	productManager := newFullyPopulatedIntakeContact(
		intakeID,
		productManagerID,
		models.SystemIntakeContactComponentOfficeOfInformationTechnologyOit,
		models.EnumArray[models.SystemIntakeContactRole]{models.SystemIntakeContactRoleProductManager},
		false,
	)

	return fullyPopulatedIntakeFixture{
		intake:   intake,
		contacts: []*models.SystemIntakeContact{requester, businessOwner, productManager},
		accounts: map[uuid.UUID]*authentication.UserAccount{
			requesterID: {
				ID:       requesterID,
				Username: "Temporary Requester " + label,
			},
			businessOwnerID: {
				ID:       businessOwnerID,
				Username: "Temporary Business Owner " + label,
			},
			productManagerID: {
				ID:       productManagerID,
				Username: "Temporary Product Manager " + label,
			},
		},
		contractNumbers: []*models.SystemIntakeContractNumber{
			{
				SystemIntakeID: intakeID,
				ContractNumber: contractNumber,
			},
		},
	}
}

func newFullyPopulatedIntakeContact(
	intakeID uuid.UUID,
	userID uuid.UUID,
	component models.SystemIntakeContactComponent,
	roles models.EnumArray[models.SystemIntakeContactRole],
	isRequester bool,
) *models.SystemIntakeContact {
	contact := models.NewSystemIntakeContact(userID, userID)
	contact.SystemIntakeID = intakeID
	contact.Component = component
	contact.Roles = roles
	contact.IsRequester = isRequester
	return contact
}

func fullyPopulatedIntakeContext(fixtures []fullyPopulatedIntakeFixture) context.Context {
	contactsByIntakeID := make(map[uuid.UUID][]*models.SystemIntakeContact, len(fixtures))
	contractsByIntakeID := make(map[uuid.UUID][]*models.SystemIntakeContractNumber, len(fixtures))
	accountsByID := make(map[uuid.UUID]*authentication.UserAccount)

	for _, fixture := range fixtures {
		contactsByIntakeID[fixture.intake.ID] = fixture.contacts
		contractsByIntakeID[fixture.intake.ID] = fixture.contractNumbers
		for id, account := range fixture.accounts {
			accountsByID[id] = account
		}
	}

	ctx := appcontext.WithLogger(context.Background(), zap.NewNop())
	ctx = appcontext.WithUserAccountService(ctx, func(_ context.Context, id uuid.UUID) (*authentication.UserAccount, error) {
		account, ok := accountsByID[id]
		if !ok {
			return nil, fmt.Errorf("no temporary user account configured for %s", id)
		}
		return account, nil
	})

	return dataloaders.CTXWithLoaders(ctx, func() *dataloaders.Dataloaders {
		return &dataloaders.Dataloaders{
			SystemIntakeContactsBySystemIntakeID: dataloadgen.NewLoader(
				func(_ context.Context, ids []uuid.UUID) ([][]*models.SystemIntakeContact, []error) {
					results := make([][]*models.SystemIntakeContact, len(ids))
					for i, id := range ids {
						results[i] = contactsByIntakeID[id]
					}
					return results, nil
				},
			),
			SystemIntakeContractNumbers: dataloadgen.NewLoader(
				func(_ context.Context, ids []uuid.UUID) ([][]*models.SystemIntakeContractNumber, []error) {
					results := make([][]*models.SystemIntakeContractNumber, len(ids))
					for i, id := range ids {
						results[i] = contractsByIntakeID[id]
					}
					return results, nil
				},
			),
		}
	})
}

func requireFullyPopulatedEASIIntake(t *testing.T, body *intakemodels.EASIIntake) {
	t.Helper()

	value := reflect.ValueOf(*body)
	typeInfo := value.Type()
	for i := 0; i < value.NumField(); i++ {
		fieldName := typeInfo.Field(i).Name
		if fieldName == "ScheduledProductionDate" {
			continue // The source SystemIntake model does not have this field yet.
		}

		field := value.Field(i)
		switch field.Kind() {
		case reflect.Pointer:
			require.False(t, field.IsNil(), "%s should be populated", fieldName)
		case reflect.Slice:
			require.NotEmpty(t, field.Interface(), "%s should be populated", fieldName)
		case reflect.String:
			require.NotEmpty(t, field.String(), "%s should be populated", fieldName)
		}
	}
}

func requireNewCEDARFieldsMatch(t *testing.T, intake models.SystemIntake, body intakemodels.EASIIntake) {
	t.Helper()

	require.Equal(t, intake.CurrentEstimatedCost.Ptr(), body.CurrentEstimatedCost)
	require.Equal(t, intake.CurrentEstimatedCostITPortion.Ptr(), body.CurrentEstimatedCostITPortion)
	require.Equal(t, string(intake.DecisionState), body.DecisionState)
	require.Equal(t, string(*intake.DigitalServiceInteraction), *body.DigitalServiceInteraction)
	require.Equal(t, intake.DigitalServiceInteractionDescription.Ptr(), body.DigitalServiceInteractionDescription)
	require.Equal(t, intake.DoesNotSupportSystems.Ptr(), body.DoesNotSupportSystems)
	require.Equal(t, string(intake.DraftBusinessCaseState), body.DraftBusinessCaseState)
	require.Equal(t, intake.EstimatedTotalContractValue.Ptr(), body.EstimatedTotalContractValue)
	require.Equal(t, intake.EstimatedTotalContractValueITPortion.Ptr(), body.EstimatedTotalContractValueITPortion)
	require.Equal(t, string(intake.FinalBusinessCaseState), body.FinalBusinessCaseState)
	require.Equal(t, intake.GovernanceTeamsIsPresent.Ptr(), body.GovernanceTeamsIsPresent)
	require.Equal(t, string(*intake.LCIDType), *body.LCIDType)
	require.Equal(t, string(*intake.LCIDComponent), *body.LCIDComponent)
	require.Equal(t, intake.LCIDIsLowIT, body.LCIDIsLowIT)
	require.Equal(t, intake.LCIDIsShortened, body.LCIDIsShortened)
	require.Equal(t, intake.LifecycleExpirationAlertTS, body.LifecycleExpirationAlertTS)
	require.Equal(t, intake.LifecycleRetiresAt, body.LifecycleRetiresAt)
	require.Equal(t, intake.LifecycleIssuedAt, body.LifecycleIssuedAt)
	require.Equal(t, intake.PriorityAlignment.Ptr(), body.PriorityAlignment)
	require.Equal(t, string(*intake.ProtectedCmsDataAccessedOutside), *body.ProtectedCmsDataAccessedOutside)
	require.Equal(t, intake.ProtectedCmsDataAccessedOutsideDescription.Ptr(), body.ProtectedCmsDataAccessedOutsideDescription)
	require.Equal(t, string(intake.RequestFormState), body.RequestFormState)
	require.Equal(t, string(intake.State), body.State)
	require.Equal(t, string(intake.Step), body.Step)
	require.Equal(t, string(*intake.TRBFollowUpRecommendation), *body.TRBFollowUpRecommendation)
	require.Equal(t, intake.UpdatedAt, body.UpdatedAt)
}
