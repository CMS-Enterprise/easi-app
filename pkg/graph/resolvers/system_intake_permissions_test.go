package resolvers

import (
	"context"
	"errors"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
)

func (s *ResolverSuite) systemIntakeMutationResolver() *mutationResolver {
	return &mutationResolver{
		&Resolver{
			store:       s.testConfigs.Store,
			service:     ResolverService{FetchUserInfo: s.fetchUserInfoStub, FetchUserInfos: s.testConfigs.UserSearchClient.FetchUserInfos},
			s3Client:    s.testConfigs.S3Client,
			emailClient: s.testConfigs.EmailClient,
			ldClient:    s.testConfigs.LDClient,
		},
	}
}

func (s *ResolverSuite) systemIntakeQueryResolver() *queryResolver {
	return &queryResolver{
		&Resolver{
			store: s.testConfigs.Store,
		},
	}
}

func (s *ResolverSuite) systemIntakeTypeResolver() *systemIntakeResolver {
	return &systemIntakeResolver{
		&Resolver{
			store: s.testConfigs.Store,
		},
	}
}

func (s *ResolverSuite) systemIntakeGRBPresentationLinksTypeResolver() *systemIntakeGRBPresentationLinksResolver {
	return &systemIntakeGRBPresentationLinksResolver{
		&Resolver{
			store:    s.testConfigs.Store,
			s3Client: s.testConfigs.S3Client,
		},
	}
}

func (s *ResolverSuite) addReviewerToSystemIntake(intakeID uuid.UUID, reviewerEUA string) {
	_, err := CreateSystemIntakeGRBReviewers(
		s.testConfigs.Context,
		s.testConfigs.Store,
		s.testConfigs.EmailClient,
		userhelpers.GetUserInfoAccountInfosWrapperFunc(s.testConfigs.UserSearchClient.FetchUserInfos),
		&models.CreateSystemIntakeGRBReviewersInput{
			SystemIntakeID: intakeID,
			Reviewers: []*models.CreateGRBReviewerInput{
				{
					EuaUserID:  reviewerEUA,
					VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
					GrbRole:    models.SystemIntakeGRBReviewerRoleCoChairCfo,
				},
			},
		},
	)
	s.NoError(err)
}

func (s *ResolverSuite) TestSystemIntakeOwnerOnlyMutationsUnauthorized() {
	resolver := s.systemIntakeMutationResolver()
	intake := s.createNewIntakeWithResolver()
	s.addReviewerToSystemIntake(intake.ID, "USR2")

	adminCtx, _ := s.getTestContextWithPrincipal("ABCD", true)
	reviewerCtx, _ := s.getTestContextWithPrincipal("USR2", false)

	var unauthorizedErr *apperrors.UnauthorizedError
	for _, unauthorizedCtx := range []context.Context{adminCtx, reviewerCtx} {
		_, err := resolver.UpdateSystemIntakeContactDetails(
			unauthorizedCtx,
			models.UpdateSystemIntakeContactDetailsInput{ID: intake.ID},
		)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = resolver.UpdateSystemIntakeRequestDetails(
			unauthorizedCtx,
			models.UpdateSystemIntakeRequestDetailsInput{ID: intake.ID},
		)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = resolver.UpdateSystemIntakeContractDetails(
			unauthorizedCtx,
			models.UpdateSystemIntakeContractDetailsInput{ID: intake.ID},
		)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil
	}
}

func (s *ResolverSuite) TestSystemIntakeContactManagementPermissions() {
	mutationResolver := s.systemIntakeMutationResolver()
	queryResolver := s.systemIntakeQueryResolver()
	intake := s.createNewIntakeWithResolver()
	s.addReviewerToSystemIntake(intake.ID, "USR2")

	ownerCtx, _ := s.getTestContextWithPrincipal("TEST", false)
	adminCtx, _ := s.getTestContextWithPrincipal("ABCD", true)
	reviewerCtx, _ := s.getTestContextWithPrincipal("USR2", false)

	createInput := models.CreateSystemIntakeContactInput{
		SystemIntakeID: intake.ID,
		EuaUserID:      "WXYZ",
		Component:      models.SystemIntakeContactComponentCmsWide,
		Roles:          []models.SystemIntakeContactRole{models.SystemIntakeContactRoleBusinessOwner},
		IsRequester:    false,
	}

	createdContact, err := mutationResolver.CreateSystemIntakeContact(adminCtx, createInput)
	s.NoError(err)
	s.NotNil(createdContact)
	s.NotNil(createdContact.SystemIntakeContact)

	contacts, err := queryResolver.SystemIntakeContacts(ownerCtx, intake.ID)
	s.NoError(err)
	s.NotNil(contacts)

	var unauthorizedErr *apperrors.UnauthorizedError
	_, err = queryResolver.SystemIntakeContacts(reviewerCtx, intake.ID)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
	unauthorizedErr = nil

	_, err = mutationResolver.UpdateSystemIntakeContact(
		reviewerCtx,
		models.UpdateSystemIntakeContactInput{
			ID:          createdContact.SystemIntakeContact.ID,
			Component:   models.SystemIntakeContactComponentCenterForClinicalStandardsAndQualityCcsq,
			Roles:       []models.SystemIntakeContactRole{models.SystemIntakeContactRoleCloudNavigator},
			IsRequester: false,
		},
	)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
	unauthorizedErr = nil

	_, err = mutationResolver.DeleteSystemIntakeContact(
		reviewerCtx,
		models.DeleteSystemIntakeContactInput{ID: createdContact.SystemIntakeContact.ID},
	)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
}

func (s *ResolverSuite) TestSystemIntakeRelationManagementPermissions() {
	mutationResolver := s.systemIntakeMutationResolver()
	queryResolver := s.systemIntakeQueryResolver()
	intake := s.createNewIntakeWithResolver()
	s.addReviewerToSystemIntake(intake.ID, "USR2")

	adminCtx, _ := s.getTestContextWithPrincipal("ABCD", true)
	reviewerCtx, _ := s.getTestContextWithPrincipal("USR2", false)

	addedLink, err := mutationResolver.AddSystemLink(
		adminCtx,
		models.AddSystemLinkInput{
			SystemIntakeID: intake.ID,
			SystemID:       uuid.MustParse("{11AB1A00-1234-5678-ABC1-1A001B00CC2C}"),
			SystemRelationshipType: []models.SystemRelationshipType{
				models.SystemRelationshipTypePrimarySupport,
			},
		},
	)
	s.NoError(err)
	s.NotNil(addedLink)

	linkedSystems, err := queryResolver.SystemIntakeSystems(adminCtx, intake.ID)
	s.NoError(err)
	s.NotEmpty(linkedSystems)

	var unauthorizedErr *apperrors.UnauthorizedError
	_, err = queryResolver.SystemIntakeSystems(reviewerCtx, intake.ID)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
	unauthorizedErr = nil

	_, err = queryResolver.SystemIntakeSystem(reviewerCtx, addedLink.ID)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
	unauthorizedErr = nil

	_, err = mutationResolver.SetSystemIntakeRelationNewSystem(
		reviewerCtx,
		&models.SetSystemIntakeRelationNewSystemInput{SystemIntakeID: intake.ID},
	)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
	unauthorizedErr = nil

	_, err = mutationResolver.UpdateSystemLink(
		reviewerCtx,
		models.UpdateSystemLinkInput{
			ID:             addedLink.ID,
			SystemIntakeID: intake.ID,
			SystemID:       addedLink.SystemID,
			SystemRelationshipType: []models.SystemRelationshipType{
				models.SystemRelationshipTypePrimarySupport,
				models.SystemRelationshipTypeOther,
			},
		},
	)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
	unauthorizedErr = nil

	_, err = mutationResolver.DeleteSystemLink(reviewerCtx, addedLink.ID)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
	unauthorizedErr = nil

	_, err = mutationResolver.SetSystemSupportAndUnlinkSystemIntakeRelation(
		reviewerCtx,
		intake.ID,
		true,
	)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
	unauthorizedErr = nil
}

func (s *ResolverSuite) TestSystemIntakeNestedFieldPermissions() {
	typeResolver := s.systemIntakeTypeResolver()
	mutationResolver := s.systemIntakeMutationResolver()
	intake := s.createNewIntakeWithResolver()
	s.addReviewerToSystemIntake(intake.ID, "USR2")

	ownerCtx, _ := s.getTestContextWithPrincipal("TEST", false)
	adminCtx, _ := s.getTestContextWithPrincipal("ABCD", true)
	reviewerCtx, _ := s.getTestContextWithPrincipal("USR2", false)

	contacts, err := typeResolver.Contacts(ownerCtx, intake)
	s.NoError(err)
	s.NotNil(contacts)

	contacts, err = typeResolver.Contacts(adminCtx, intake)
	s.NoError(err)
	s.NotNil(contacts)

	_, err = mutationResolver.AddSystemLink(
		adminCtx,
		models.AddSystemLinkInput{
			SystemIntakeID: intake.ID,
			SystemID:       uuid.MustParse("{11AB1A00-1234-5678-ABC1-1A001B00CC2C}"),
			SystemRelationshipType: []models.SystemRelationshipType{
				models.SystemRelationshipTypePrimarySupport,
			},
		},
	)
	s.NoError(err)

	linkedSystems, err := typeResolver.SystemIntakeSystems(adminCtx, intake)
	s.NoError(err)
	s.NotEmpty(linkedSystems)

	var unauthorizedErr *apperrors.UnauthorizedError
	_, err = typeResolver.Contacts(reviewerCtx, intake)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))

	linkedSystems, err = typeResolver.SystemIntakeSystems(reviewerCtx, intake)
	s.NoError(err)
	s.NotEmpty(linkedSystems)
}

func (s *ResolverSuite) TestSystemIntakeRequesterWorkflowPermissions() {
	resolver := s.systemIntakeMutationResolver()
	intake := s.createNewIntakeWithResolver()
	s.addReviewerToSystemIntake(intake.ID, "USR2")

	ownerCtx, _ := s.getTestContextWithPrincipal("TEST", false)
	adminCtx, _ := s.getTestContextWithPrincipal("ABCD", true)
	reviewerCtx, _ := s.getTestContextWithPrincipal("USR2", false)

	updatedIntake, err := resolver.UpdateSystemIntakeRequestType(
		ownerCtx,
		intake.ID,
		models.SystemIntakeRequestTypeMAJORCHANGES,
	)
	s.NoError(err)
	s.NotNil(updatedIntake)
	s.Equal(models.SystemIntakeRequestTypeMAJORCHANGES, updatedIntake.RequestType)

	var unauthorizedErr *apperrors.UnauthorizedError
	for _, unauthorizedCtx := range []context.Context{adminCtx, reviewerCtx} {
		_, err = resolver.UpdateSystemIntakeRequestType(
			unauthorizedCtx,
			intake.ID,
			models.SystemIntakeRequestTypeNEW,
		)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = resolver.SubmitIntake(
			unauthorizedCtx,
			models.SubmitIntakeInput{ID: intake.ID},
		)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil
	}
}

func (s *ResolverSuite) TestArchiveSystemIntakeAllowsLegacyOwnerFallbackWithoutUsableRequesterContact() {
	resolver := s.systemIntakeMutationResolver()
	creatorCtx, _ := s.getTestContextWithPrincipal("ABCD", false)
	legacyOwnerCtx, _ := s.getTestContextWithPrincipal("TEST", false)

	intake, err := CreateSystemIntake(
		creatorCtx,
		s.testConfigs.Store,
		models.CreateSystemIntakeInput{
			Requester: &models.SystemIntakeRequesterInput{
				Name: "Legacy Requester",
			},
			RequestType: models.SystemIntakeRequestTypeNEW,
		},
		userhelpers.GetUserInfoAccountInfoWrapperFunc(s.testConfigs.UserSearchClient.FetchUserInfo),
	)
	s.NoError(err)
	s.NotNil(intake)

	requesterContact, err := SystemIntakeContactGetRequester(s.ctxWithNewDataloaders(), intake.ID)
	s.NoError(err)
	s.NotNil(requesterContact)

	// Simulate a legacy requester contact that no longer has a usable linked user account.
	_, err = s.testConfigs.Store.NamedExecContext(
		s.testConfigs.Context,
		`UPDATE system_intake_contacts SET user_id = :user_id WHERE id = :id`,
		map[string]any{
			"id":      requesterContact.ID,
			"user_id": uuid.Nil,
		},
	)
	s.NoError(err)

	requesterContact, err = SystemIntakeContactGetRequester(s.ctxWithNewDataloaders(), intake.ID)
	s.NoError(err)
	s.NotNil(requesterContact)
	s.Equal(uuid.Nil, requesterContact.UserID)

	_, err = s.testConfigs.Store.NamedExecContext(
		s.testConfigs.Context,
		`UPDATE system_intakes SET eua_user_id = :eua_user_id WHERE id = :id`,
		map[string]any{
			"id":          intake.ID,
			"eua_user_id": "TEST",
		},
	)
	s.NoError(err)

	archivedIntake, err := resolver.ArchiveSystemIntake(legacyOwnerCtx, intake.ID)
	s.NoError(err)
	s.NotNil(archivedIntake)
	s.NotNil(archivedIntake.ArchivedAt)
}

func (s *ResolverSuite) TestArchiveSystemIntakeDoesNotFallbackPastRequesterContactMismatch() {
	resolver := s.systemIntakeMutationResolver()
	creatorCtx, _ := s.getTestContextWithPrincipal("ABCD", false)
	legacyOwnerCtx, _ := s.getTestContextWithPrincipal("TEST", false)

	intake, err := CreateSystemIntake(
		creatorCtx,
		s.testConfigs.Store,
		models.CreateSystemIntakeInput{
			Requester: &models.SystemIntakeRequesterInput{
				Name: "Legacy Requester",
			},
			RequestType: models.SystemIntakeRequestTypeNEW,
		},
		userhelpers.GetUserInfoAccountInfoWrapperFunc(s.testConfigs.UserSearchClient.FetchUserInfo),
	)
	s.NoError(err)
	s.NotNil(intake)

	intake.EUAUserID = null.StringFrom("TEST")
	intake, err = s.testConfigs.Store.UpdateSystemIntake(s.testConfigs.Context, intake)
	s.NoError(err)

	archivedIntake, err := resolver.ArchiveSystemIntake(legacyOwnerCtx, intake.ID)
	s.Error(err)
	s.Nil(archivedIntake)
	s.EqualError(err, "user is unauthorized to archive system intake")
}

func (s *ResolverSuite) TestSystemIntakeAdminWorkflowPermissions() {
	mutationResolver := s.systemIntakeMutationResolver()
	typeResolver := s.systemIntakeTypeResolver()
	intake := s.createNewIntakeWithResolver()
	s.addReviewerToSystemIntake(intake.ID, "USR2")

	createdNote, err := s.testConfigs.Store.CreateSystemIntakeNote(s.testConfigs.Context, &models.SystemIntakeNote{
		SystemIntakeID: intake.ID,
		AuthorEUAID:    "ABCD",
		AuthorName:     null.StringFrom("Admin User"),
		Content:        models.HTMLPointer("Admin note"),
	})
	s.NoError(err)
	s.NotNil(createdNote)

	step := models.SystemIntakeStepINITIALFORM
	_, err = s.testConfigs.Store.CreateAction(s.testConfigs.Context, &models.Action{
		IntakeID:       &intake.ID,
		ActionType:     models.ActionTypeREQUESTEDITS,
		ActorName:      "Admin User",
		ActorEmail:     models.EmailAddress("admin@example.com"),
		ActorEUAUserID: "ABCD",
		Step:           &step,
	})
	s.NoError(err)

	adminCtx, _ := s.getTestContextWithPrincipal("ABCD", true)
	ownerCtx, _ := s.getTestContextWithPrincipal("TEST", false)
	reviewerCtx, _ := s.getTestContextWithPrincipal("USR2", false)
	now := time.Now().UTC()
	reason := models.HTML("reason")
	nextSteps := models.HTML("next steps")
	feedback := models.HTML("feedback")

	notes, err := typeResolver.Notes(adminCtx, intake)
	s.NoError(err)
	s.NotEmpty(notes)

	actions, err := typeResolver.Actions(adminCtx, intake)
	s.NoError(err)
	s.NotEmpty(actions)

	adminCreatedNote, err := mutationResolver.CreateSystemIntakeNote(
		adminCtx,
		models.CreateSystemIntakeNoteInput{
			IntakeID:   intake.ID,
			Content:    models.HTML("Another note"),
			AuthorName: "Admin User",
		},
	)
	s.NoError(err)
	s.NotNil(adminCreatedNote)

	updatedLead, err := mutationResolver.UpdateSystemIntakeAdminLead(
		adminCtx,
		models.UpdateSystemIntakeAdminLeadInput{
			ID:        intake.ID,
			AdminLead: "ABCD",
		},
	)
	s.NoError(err)
	s.NotNil(updatedLead)

	for _, unauthorizedCtx := range []context.Context{ownerCtx, reviewerCtx} {
		var unauthorizedErr *apperrors.UnauthorizedError

		_, err = typeResolver.Notes(unauthorizedCtx, intake)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = typeResolver.Actions(unauthorizedCtx, intake)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		adminOnlyCalls := []func(context.Context) error{
			func(ctx context.Context) error {
				_, err := mutationResolver.CreateSystemIntakeNote(ctx, models.CreateSystemIntakeNoteInput{
					IntakeID:   intake.ID,
					Content:    models.HTML("Unauthorized note"),
					AuthorName: "Unauthorized User",
				})
				return err
			},
			func(ctx context.Context) error {
				_, err := mutationResolver.UpdateSystemIntakeNote(ctx, models.UpdateSystemIntakeNoteInput{
					ID:         createdNote.ID,
					Content:    models.HTML("Edited note"),
					IsArchived: false,
				})
				return err
			},
			func(ctx context.Context) error {
				_, err := mutationResolver.UpdateSystemIntakeAdminLead(ctx, models.UpdateSystemIntakeAdminLeadInput{
					ID:        intake.ID,
					AdminLead: "ABCD",
				})
				return err
			},
			func(ctx context.Context) error {
				_, err := mutationResolver.UpdateSystemIntakeReviewDates(ctx, models.UpdateSystemIntakeReviewDatesInput{
					ID:      intake.ID,
					GrbDate: &now,
					GrtDate: &now,
				})
				return err
			},
			func(ctx context.Context) error {
				_, err := mutationResolver.CreateSystemIntakeActionProgressToNewStep(ctx, models.SystemIntakeProgressToNewStepsInput{
					SystemIntakeID: intake.ID,
					NewStep:        models.SystemIntakeStepToProgressToGrtMeeting,
				})
				return err
			},
			func(ctx context.Context) error {
				_, err := mutationResolver.CreateSystemIntakeActionRequestEdits(ctx, models.SystemIntakeRequestEditsInput{
					SystemIntakeID: intake.ID,
					IntakeFormStep: models.SystemIntakeFormStepInitialRequestForm,
					EmailFeedback:  feedback,
				})
				return err
			},
			func(ctx context.Context) error {
				_, err := mutationResolver.CreateSystemIntakeActionIssueLcid(ctx, models.SystemIntakeIssueLCIDInput{
					SystemIntakeID: intake.ID,
					ExpiresAt:      now.AddDate(1, 0, 0),
					Scope:          "scope",
					NextSteps:      nextSteps,
					TrbFollowUp:    models.TRBFRStronglyRecommended,
				})
				return err
			},
			func(ctx context.Context) error {
				_, err := mutationResolver.CreateSystemIntakeActionRejectIntake(ctx, models.SystemIntakeRejectIntakeInput{
					SystemIntakeID: intake.ID,
					Reason:         reason,
					NextSteps:      nextSteps,
					TrbFollowUp:    models.TRBFRStronglyRecommended,
				})
				return err
			},
			func(ctx context.Context) error {
				_, err := mutationResolver.CreateSystemIntakeActionCloseRequest(ctx, models.SystemIntakeCloseRequestInput{
					SystemIntakeID: intake.ID,
				})
				return err
			},
			func(ctx context.Context) error {
				_, err := mutationResolver.CreateSystemIntakeActionReopenRequest(ctx, models.SystemIntakeReopenRequestInput{
					SystemIntakeID: intake.ID,
				})
				return err
			},
			func(ctx context.Context) error {
				_, err := mutationResolver.CreateSystemIntakeActionNotITGovRequest(ctx, models.SystemIntakeNotITGovReqInput{
					SystemIntakeID: intake.ID,
				})
				return err
			},
		}

		for _, call := range adminOnlyCalls {
			err = call(unauthorizedCtx)
			s.Error(err)
			s.True(errors.As(err, &unauthorizedErr))
			unauthorizedErr = nil
		}
	}
}

func (s *ResolverSuite) TestSystemIntakeAdminLCIDActionPermissions() {
	mutationResolver := s.systemIntakeMutationResolver()
	adminCtx, _ := s.getTestContextWithPrincipal("ABCD", true)
	ownerCtx, _ := s.getTestContextWithPrincipal("TEST", false)
	reviewerCtx, _ := s.getTestContextWithPrincipal("USR2", false)

	now := time.Now().UTC()

	createIntakeWithReviewer := func(callback func(*models.SystemIntake)) *models.SystemIntake {
		intake := s.createNewIntakeWithResolver(callback)
		s.addReviewerToSystemIntake(intake.ID, "USR2")
		return intake
	}

	testCases := []struct {
		name        string
		createCall  func(context.Context, uuid.UUID) (*models.UpdateSystemIntakePayload, error)
		setupIntake func() *models.SystemIntake
		assert      func(*models.UpdateSystemIntakePayload)
	}{
		{
			name: "expire LCID",
			setupIntake: func() *models.SystemIntake {
				expiration := now.AddDate(2, 0, 0)
				return createIntakeWithReviewer(func(intake *models.SystemIntake) {
					intake.LifecycleID = null.StringFrom("123456")
					intake.LifecycleExpiresAt = &expiration
				})
			},
			createCall: func(ctx context.Context, intakeID uuid.UUID) (*models.UpdateSystemIntakePayload, error) {
				return mutationResolver.CreateSystemIntakeActionExpireLcid(ctx, models.SystemIntakeExpireLCIDInput{
					SystemIntakeID: intakeID,
					Reason:         models.HTML("Expire this LCID"),
					NextSteps:      models.HTMLPointer("Expired next steps"),
				})
			},
			assert: func(payload *models.UpdateSystemIntakePayload) {
				s.NotNil(payload.SystemIntake)
				s.EqualValues(models.HTMLPointer("Expired next steps"), payload.SystemIntake.DecisionNextSteps)
			},
		},
		{
			name: "update LCID",
			setupIntake: func() *models.SystemIntake {
				return createIntakeWithReviewer(func(intake *models.SystemIntake) {
					intake.LifecycleID = null.StringFrom("123457")
				})
			},
			createCall: func(ctx context.Context, intakeID uuid.UUID) (*models.UpdateSystemIntakePayload, error) {
				return mutationResolver.CreateSystemIntakeActionUpdateLcid(ctx, models.SystemIntakeUpdateLCIDInput{
					SystemIntakeID: intakeID,
					Scope:          models.HTMLPointer("Updated LCID scope"),
				})
			},
			assert: func(payload *models.UpdateSystemIntakePayload) {
				s.NotNil(payload.SystemIntake)
				s.EqualValues(models.HTMLPointer("Updated LCID scope"), payload.SystemIntake.LifecycleScope)
			},
		},
		{
			name: "retire LCID",
			setupIntake: func() *models.SystemIntake {
				return createIntakeWithReviewer(func(intake *models.SystemIntake) {
					intake.LifecycleID = null.StringFrom("123458")
				})
			},
			createCall: func(ctx context.Context, intakeID uuid.UUID) (*models.UpdateSystemIntakePayload, error) {
				retirementDate := now.AddDate(3, 0, 0)
				return mutationResolver.CreateSystemIntakeActionRetireLcid(ctx, models.SystemIntakeRetireLCIDInput{
					SystemIntakeID: intakeID,
					RetiresAt:      retirementDate,
				})
			},
			assert: func(payload *models.UpdateSystemIntakePayload) {
				expectedRetirementDate := now.AddDate(3, 0, 0)
				s.NotNil(payload.SystemIntake)
				s.NotNil(payload.SystemIntake.LifecycleRetiresAt)
				s.WithinDuration(expectedRetirementDate, *payload.SystemIntake.LifecycleRetiresAt, time.Microsecond)
			},
		},
		{
			name: "unretire LCID",
			setupIntake: func() *models.SystemIntake {
				retirementDate := now.AddDate(2, 0, 0)
				return createIntakeWithReviewer(func(intake *models.SystemIntake) {
					intake.LifecycleID = null.StringFrom("123459")
					intake.LifecycleRetiresAt = &retirementDate
				})
			},
			createCall: func(ctx context.Context, intakeID uuid.UUID) (*models.UpdateSystemIntakePayload, error) {
				return mutationResolver.CreateSystemIntakeActionUnretireLcid(ctx, models.SystemIntakeUnretireLCIDInput{
					SystemIntakeID: intakeID,
				})
			},
			assert: func(payload *models.UpdateSystemIntakePayload) {
				s.NotNil(payload.SystemIntake)
				s.Nil(payload.SystemIntake.LifecycleRetiresAt)
			},
		},
		{
			name: "change LCID retirement date",
			setupIntake: func() *models.SystemIntake {
				retirementDate := now.AddDate(2, 0, 0)
				return createIntakeWithReviewer(func(intake *models.SystemIntake) {
					intake.LifecycleID = null.StringFrom("123460")
					intake.LifecycleRetiresAt = &retirementDate
				})
			},
			createCall: func(ctx context.Context, intakeID uuid.UUID) (*models.UpdateSystemIntakePayload, error) {
				newRetirementDate := now.AddDate(4, 0, 0)
				return mutationResolver.CreateSystemIntakeActionChangeLCIDRetirementDate(ctx, models.SystemIntakeChangeLCIDRetirementDateInput{
					SystemIntakeID: intakeID,
					RetiresAt:      newRetirementDate,
				})
			},
			assert: func(payload *models.UpdateSystemIntakePayload) {
				expectedRetirementDate := now.AddDate(4, 0, 0)
				s.NotNil(payload.SystemIntake)
				s.NotNil(payload.SystemIntake.LifecycleRetiresAt)
				s.WithinDuration(expectedRetirementDate, *payload.SystemIntake.LifecycleRetiresAt, time.Microsecond)
			},
		},
		{
			name: "confirm LCID",
			setupIntake: func() *models.SystemIntake {
				return createIntakeWithReviewer(func(intake *models.SystemIntake) {
					intake.LifecycleID = null.StringFrom("123461")
				})
			},
			createCall: func(ctx context.Context, intakeID uuid.UUID) (*models.UpdateSystemIntakePayload, error) {
				return mutationResolver.CreateSystemIntakeActionConfirmLcid(ctx, models.SystemIntakeConfirmLCIDInput{
					SystemIntakeID: intakeID,
					ExpiresAt:      now.AddDate(1, 0, 0),
					Scope:          models.HTML("Confirmed LCID scope"),
					NextSteps:      models.HTML("Confirmed LCID next steps"),
					TrbFollowUp:    models.TRBFRStronglyRecommended,
				})
			},
			assert: func(payload *models.UpdateSystemIntakePayload) {
				expectedScope := models.HTML("Confirmed LCID scope")
				s.NotNil(payload.SystemIntake)
				s.EqualValues(&expectedScope, payload.SystemIntake.LifecycleScope)
			},
		},
	}

	for _, tc := range testCases {
		tc := tc
		s.Run(tc.name, func() {
			intake := tc.setupIntake()

			for _, unauthorizedCtx := range []context.Context{ownerCtx, reviewerCtx} {
				_, err := tc.createCall(unauthorizedCtx, intake.ID)
				s.Error(err)

				var unauthorizedErr *apperrors.UnauthorizedError
				s.True(errors.As(err, &unauthorizedErr))
			}

			payload, err := tc.createCall(adminCtx, intake.ID)
			s.NoError(err)
			s.NotNil(payload)
			tc.assert(payload)
		})
	}
}

func (s *ResolverSuite) TestSystemIntakeAdminListQueryPermissions() {
	queryResolver := s.systemIntakeQueryResolver()
	intake := s.createNewIntakeWithResolver()
	s.addReviewerToSystemIntake(intake.ID, "USR2")

	adminCtx, _ := s.getTestContextWithPrincipal("ABCD", true)
	ownerCtx, _ := s.getTestContextWithPrincipal("TEST", false)
	reviewerCtx, _ := s.getTestContextWithPrincipal("USR2", false)

	adminOpenIntakes, err := queryResolver.SystemIntakes(adminCtx, true)
	s.NoError(err)
	s.Empty(adminOpenIntakes)

	reviewRequested, err := queryResolver.SystemIntakesWithReviewRequested(adminCtx)
	s.NoError(err)
	s.Empty(reviewRequested)

	ownerReviewRequested, err := queryResolver.SystemIntakesWithReviewRequested(ownerCtx)
	s.NoError(err)
	s.Empty(ownerReviewRequested)

	reviewerReviewRequested, err := queryResolver.SystemIntakesWithReviewRequested(reviewerCtx)
	s.NoError(err)
	s.NotEmpty(reviewerReviewRequested)

	lcidIntakes, err := queryResolver.SystemIntakesWithLcids(adminCtx)
	s.NoError(err)
	s.Empty(lcidIntakes)

	for _, unauthorizedCtx := range []context.Context{ownerCtx, reviewerCtx} {
		var unauthorizedErr *apperrors.UnauthorizedError

		_, err = queryResolver.SystemIntakes(unauthorizedCtx, true)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = queryResolver.SystemIntakesWithLcids(unauthorizedCtx)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
	}
}

func (s *ResolverSuite) TestSystemIntakeGRBReviewManagementPermissions() {
	resolver := s.systemIntakeMutationResolver()
	queryResolver := s.systemIntakeQueryResolver()
	intake, reviewer := s.createIntakeAndAddReviewer(&models.CreateGRBReviewerInput{
		EuaUserID:  "USR2",
		VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
		GrbRole:    models.SystemIntakeGRBReviewerRoleCmcsRep,
	})

	ownerCtx, _ := s.getTestContextWithPrincipal("TEST", false)
	adminCtx, _ := s.getTestContextWithPrincipal("ABCD", true)
	reviewerCtx, _ := s.getTestContextWithPrincipal("USR2", false)
	now := time.Now().UTC()
	tomorrow := now.AddDate(0, 0, 1)

	var unauthorizedErr *apperrors.UnauthorizedError
	for _, unauthorizedCtx := range []context.Context{ownerCtx, reviewerCtx} {
		_, err := queryResolver.CompareGRBReviewersByIntakeID(unauthorizedCtx, intake.ID)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = resolver.StartGRBReview(
			unauthorizedCtx,
			models.StartGRBReviewInput{SystemIntakeID: intake.ID},
		)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = resolver.CreateSystemIntakeGRBReviewers(
			unauthorizedCtx,
			models.CreateSystemIntakeGRBReviewersInput{
				SystemIntakeID: intake.ID,
				Reviewers: []*models.CreateGRBReviewerInput{
					{
						EuaUserID:  "WXYZ",
						VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
						GrbRole:    models.SystemIntakeGRBReviewerRoleOther,
					},
				},
			},
		)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = resolver.UpdateSystemIntakeGRBReviewer(
			unauthorizedCtx,
			models.UpdateSystemIntakeGRBReviewerInput{
				ReviewerID: reviewer.ID,
				VotingRole: models.SystemIntakeGRBReviewerVotingRoleNonVoting,
				GrbRole:    models.SystemIntakeGRBReviewerRoleOther,
			},
		)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = resolver.DeleteSystemIntakeGRBReviewer(
			unauthorizedCtx,
			models.DeleteSystemIntakeGRBReviewerInput{ReviewerID: reviewer.ID},
		)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = resolver.SendSystemIntakeGRBReviewerReminder(unauthorizedCtx, intake.ID)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = resolver.SendGRBReviewPresentationDeckReminderEmail(unauthorizedCtx, intake.ID)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = resolver.UpdateSystemIntakeGRBReviewType(
			unauthorizedCtx,
			models.UpdateSystemIntakeGRBReviewTypeInput{
				SystemIntakeID: intake.ID,
				GrbReviewType:  models.SystemIntakeGRBReviewTypeAsync,
			},
		)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = resolver.UpdateSystemIntakeGRBReviewFormPresentationStandard(
			unauthorizedCtx,
			models.UpdateSystemIntakeGRBReviewFormInputPresentationStandard{
				SystemIntakeID: intake.ID,
				GrbDate:        graphql.OmittableOf(&now),
			},
		)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = resolver.UpdateSystemIntakeGRBReviewFormPresentationAsync(
			unauthorizedCtx,
			models.UpdateSystemIntakeGRBReviewFormInputPresentationAsync{
				SystemIntakeID:              intake.ID,
				GrbReviewAsyncRecordingTime: graphql.OmittableOf(&now),
			},
		)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = resolver.UpdateSystemIntakeGRBReviewFormTimeframeAsync(
			unauthorizedCtx,
			models.UpdateSystemIntakeGRBReviewFormInputTimeframeAsync{
				SystemIntakeID:        intake.ID,
				GrbReviewAsyncEndDate: tomorrow,
			},
		)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = resolver.ExtendGRBReviewDeadlineAsync(
			unauthorizedCtx,
			models.ExtendGRBReviewDeadlineInput{
				SystemIntakeID:        intake.ID,
				GrbReviewAsyncEndDate: tomorrow,
			},
		)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = resolver.RestartGRBReviewAsync(
			unauthorizedCtx,
			models.RestartGRBReviewInput{
				SystemIntakeID: intake.ID,
				NewGRBEndDate:  tomorrow,
			},
		)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = resolver.SetSystemIntakeGRBPresentationLinks(
			unauthorizedCtx,
			models.SystemIntakeGRBPresentationLinksInput{SystemIntakeID: intake.ID},
		)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil

		_, err = resolver.ManuallyEndSystemIntakeGRBReviewAsyncVoting(unauthorizedCtx, intake.ID)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil
	}

	comparisons, err := queryResolver.CompareGRBReviewersByIntakeID(adminCtx, intake.ID)
	s.NoError(err)
	s.Empty(comparisons)

	started, err := resolver.StartGRBReview(
		adminCtx,
		models.StartGRBReviewInput{SystemIntakeID: intake.ID},
	)
	s.NoError(err)
	s.NotNil(started)

	emailSent, err := resolver.SendGRBReviewPresentationDeckReminderEmail(adminCtx, intake.ID)
	s.NoError(err)
	s.True(emailSent)
}

func (s *ResolverSuite) TestSystemIntakeGRBReviewerIdentityVisibility() {
	typeResolver := s.systemIntakeTypeResolver()
	intake, reviewers := s.createIntakeAndAddReviewers(
		&models.CreateGRBReviewerInput{
			EuaUserID:  "USR2",
			VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
			GrbRole:    models.SystemIntakeGRBReviewerRoleCmcsRep,
		},
		&models.CreateGRBReviewerInput{
			EuaUserID:  "WXYZ",
			VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
			GrbRole:    models.SystemIntakeGRBReviewerRoleOther,
		},
	)
	s.Len(reviewers, 2)

	now := time.Now().UTC()
	tomorrow := now.AddDate(0, 0, 1)
	intake.GRBReviewStartedAt = &now
	intake.GrbReviewAsyncEndDate = &tomorrow

	var err error
	intake, err = s.testConfigs.Store.UpdateSystemIntake(s.ctxWithNewDataloaders(), intake)
	s.NoError(err)

	reviewerCtx, _ := s.getTestContextWithPrincipal("USR2", false)

	_, err = CastSystemIntakeGRBReviewerVote(
		reviewerCtx,
		s.testConfigs.Store,
		s.testConfigs.EmailClient,
		models.CastSystemIntakeGRBReviewerVoteInput{
			SystemIntakeID: intake.ID,
			Vote:           models.SystemIntakeAsyncGRBVotingOptionNoObjection,
		},
	)
	s.NoError(err)

	ownerCtx, _ := s.getTestContextWithPrincipal("TEST", false)
	reviewerCtx, _ = s.getTestContextWithPrincipal("USR2", false)
	adminCtx, _ := s.getTestContextWithPrincipal("ABCD", true)

	ownerReviewers, err := typeResolver.GrbReviewers(ownerCtx, intake)
	s.NoError(err)
	s.Empty(ownerReviewers)

	ownerVotingInformation, err := typeResolver.GrbVotingInformation(ownerCtx, intake)
	s.NoError(err)
	s.Empty(ownerVotingInformation.GRBReviewers)
	s.Equal(1, ownerVotingInformation.NumberOfNoObjection())
	s.Equal(1, ownerVotingInformation.NumberOfNotVoted())

	reviewerReviewers, err := typeResolver.GrbReviewers(reviewerCtx, intake)
	s.NoError(err)
	s.Len(reviewerReviewers, 2)

	reviewerVotingInformation, err := typeResolver.GrbVotingInformation(reviewerCtx, intake)
	s.NoError(err)
	s.Len(reviewerVotingInformation.GRBReviewers, 2)
	s.Equal(1, reviewerVotingInformation.NumberOfNoObjection())
	s.Equal(1, reviewerVotingInformation.NumberOfNotVoted())

	adminReviewers, err := typeResolver.GrbReviewers(adminCtx, intake)
	s.NoError(err)
	s.Len(adminReviewers, 2)

	adminVotingInformation, err := typeResolver.GrbVotingInformation(adminCtx, intake)
	s.NoError(err)
	s.Len(adminVotingInformation.GRBReviewers, 2)
	s.Equal(1, adminVotingInformation.NumberOfNoObjection())
	s.Equal(1, adminVotingInformation.NumberOfNotVoted())
}

func (s *ResolverSuite) TestSystemIntakeGRBDiscussionVisibility() {
	typeResolver := s.systemIntakeTypeResolver()
	intake, _ := s.createIntakeAndAddReviewersByEUAs("USR2")
	intake.Step = models.SystemIntakeStepGRBMEETING

	var err error
	intake, err = s.testConfigs.Store.UpdateSystemIntake(s.ctxWithNewDataloaders(), intake)
	s.NoError(err)

	ownerCtx, _ := s.getTestContextWithPrincipal("TEST", false)
	reviewerCtx, _ := s.getTestContextWithPrincipal("USR2", false)
	adminCtx, _ := s.getTestContextWithPrincipal("ABCD", true)

	_, err = CreateSystemIntakeGRBDiscussionPost(
		ownerCtx,
		s.testConfigs.Store,
		s.testConfigs.EmailClient,
		models.CreateSystemIntakeGRBDiscussionPostInput{
			SystemIntakeID: intake.ID,
			Content: models.TaggedHTML{
				RawContent: "<p>primary discussion</p>",
			},
			DiscussionBoardType: models.SystemIntakeGRBDiscussionBoardTypePrimary,
		},
	)
	s.NoError(err)

	_, err = CreateSystemIntakeGRBDiscussionPost(
		reviewerCtx,
		s.testConfigs.Store,
		s.testConfigs.EmailClient,
		models.CreateSystemIntakeGRBDiscussionPostInput{
			SystemIntakeID: intake.ID,
			Content: models.TaggedHTML{
				RawContent: "<p>internal discussion</p>",
			},
			DiscussionBoardType: models.SystemIntakeGRBDiscussionBoardTypeInternal,
		},
	)
	s.NoError(err)

	ownerPrimaryDiscussions, err := typeResolver.GrbDiscussionsPrimary(ownerCtx, intake)
	s.NoError(err)
	s.Len(ownerPrimaryDiscussions, 1)

	ownerInternalDiscussions, err := typeResolver.GrbDiscussionsInternal(ownerCtx, intake)
	s.NoError(err)
	s.Empty(ownerInternalDiscussions)

	reviewerInternalDiscussions, err := typeResolver.GrbDiscussionsInternal(reviewerCtx, intake)
	s.NoError(err)
	s.Len(reviewerInternalDiscussions, 1)

	adminInternalDiscussions, err := typeResolver.GrbDiscussionsInternal(adminCtx, intake)
	s.NoError(err)
	s.Len(adminInternalDiscussions, 1)
}

func (s *ResolverSuite) TestSystemIntakeGRBPresentationDeckPermissions() {
	resolver := s.systemIntakeMutationResolver()

	ownerCtx, _ := s.getTestContextWithPrincipal("TEST", false)
	adminCtx, _ := s.getTestContextWithPrincipal("ABCD", true)
	reviewerCtx, _ := s.getTestContextWithPrincipal("USR2", false)
	otherCtx, _ := s.getTestContextWithPrincipal("WXYZ", false)

	uploadIntake, _ := s.createIntakeAndAddReviewer(&models.CreateGRBReviewerInput{
		EuaUserID:  "USR2",
		VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
		GrbRole:    models.SystemIntakeGRBReviewerRoleCmcsRep,
	})

	uploadedLinks, err := resolver.UploadSystemIntakeGRBPresentationDeck(
		ownerCtx,
		models.UploadSystemIntakeGRBPresentationDeckInput{
			SystemIntakeID:           uploadIntake.ID,
			PresentationDeckFileData: s.createUploadSystemIntakeGRBPresentationDeckFileData(),
		},
	)
	s.NoError(err)
	s.NotNil(uploadedLinks)

	var unauthorizedErr *apperrors.UnauthorizedError
	for _, unauthorizedCtx := range []context.Context{adminCtx, reviewerCtx, otherCtx} {
		_, err = resolver.UploadSystemIntakeGRBPresentationDeck(
			unauthorizedCtx,
			models.UploadSystemIntakeGRBPresentationDeckInput{
				SystemIntakeID:           uploadIntake.ID,
				PresentationDeckFileData: s.createUploadSystemIntakeGRBPresentationDeckFileData(),
			},
		)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil
	}

	adminDeleteIntake, _ := s.createIntakeAndAddReviewer(&models.CreateGRBReviewerInput{
		EuaUserID:  "USR2",
		VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
		GrbRole:    models.SystemIntakeGRBReviewerRoleCmcsRep,
	})
	createSystemIntakeGRBPresentationLinkUploadSet(s, adminDeleteIntake.ID)

	deletedID, err := resolver.DeleteSystemIntakeGRBPresentationLinks(
		adminCtx,
		models.DeleteSystemIntakeGRBPresentationLinksInput{SystemIntakeID: adminDeleteIntake.ID},
	)
	s.NoError(err)
	s.Equal(adminDeleteIntake.ID, deletedID)

	ownerDeleteIntake, _ := s.createIntakeAndAddReviewer(&models.CreateGRBReviewerInput{
		EuaUserID:  "USR2",
		VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
		GrbRole:    models.SystemIntakeGRBReviewerRoleCmcsRep,
	})
	createSystemIntakeGRBPresentationLinkUploadSet(s, ownerDeleteIntake.ID)

	deletedID, err = resolver.DeleteSystemIntakeGRBPresentationLinks(
		ownerCtx,
		models.DeleteSystemIntakeGRBPresentationLinksInput{SystemIntakeID: ownerDeleteIntake.ID},
	)
	s.NoError(err)
	s.Equal(ownerDeleteIntake.ID, deletedID)

	for _, testCtx := range []context.Context{reviewerCtx, otherCtx} {
		intake, _ := s.createIntakeAndAddReviewer(&models.CreateGRBReviewerInput{
			EuaUserID:  "USR2",
			VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
			GrbRole:    models.SystemIntakeGRBReviewerRoleCmcsRep,
		})
		createSystemIntakeGRBPresentationLinkUploadSet(s, intake.ID)

		_, err = resolver.DeleteSystemIntakeGRBPresentationLinks(
			testCtx,
			models.DeleteSystemIntakeGRBPresentationLinksInput{SystemIntakeID: intake.ID},
		)
		s.Error(err)
		s.True(errors.As(err, &unauthorizedErr))
		unauthorizedErr = nil
	}
}

func (s *ResolverSuite) TestSystemIntakeGRBPresentationLinkURLPermissions() {
	typeResolver := s.systemIntakeGRBPresentationLinksTypeResolver()
	intake, _ := s.createIntakeAndAddReviewer(&models.CreateGRBReviewerInput{
		EuaUserID:  "USR2",
		VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
		GrbRole:    models.SystemIntakeGRBReviewerRoleCmcsRep,
	})
	links := createSystemIntakeGRBPresentationLinkUploadSet(s, intake.ID)

	ownerCtx, _ := s.getTestContextWithPrincipal("TEST", false)
	adminCtx, _ := s.getTestContextWithPrincipal("ABCD", true)
	reviewerCtx, _ := s.getTestContextWithPrincipal("USR2", false)
	otherCtx, _ := s.getTestContextWithPrincipal("WXYZ", false)

	transcriptURL, err := typeResolver.TranscriptFileURL(ownerCtx, links)
	s.NoError(err)
	s.NotNil(transcriptURL)

	presentationDeckURL, err := typeResolver.PresentationDeckFileURL(adminCtx, links)
	s.NoError(err)
	s.NotNil(presentationDeckURL)

	presentationDeckURL, err = typeResolver.PresentationDeckFileURL(reviewerCtx, links)
	s.NoError(err)
	s.NotNil(presentationDeckURL)

	var unauthorizedErr *apperrors.UnauthorizedError
	_, err = typeResolver.PresentationDeckFileURL(otherCtx, links)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
}
