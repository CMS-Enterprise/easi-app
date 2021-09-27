package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"net/url"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"github.com/vektah/gqlparser/v2/gqlerror"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/flags"
	"github.com/cmsgov/easi-app/pkg/graph/generated"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/services"
)

func (r *accessibilityRequestResolver) Documents(ctx context.Context, obj *models.AccessibilityRequest) ([]*models.AccessibilityRequestDocument, error) {
	documents, documentsErr := r.store.FetchDocumentsByAccessibilityRequestID(ctx, obj.ID)

	if documentsErr != nil {
		return nil, documentsErr
	}

	for _, document := range documents {
		if url, urlErr := r.s3Client.NewGetPresignedURL(document.Key); urlErr == nil {
			document.URL = url.URL
		}

		// This is not ideal- we're making a request to S3 for each document sequentially.
		// The more documents we have on an accessibility request, the slower this resolver will get.
		//
		// We will either update the records in the database with the results OR implement
		// another mechanism for doing that as a background job so that we don't need to do it here.
		// Furthermore, locally this will always return "", since we are not interfacing with the
		// real S3.
		value, valueErr := r.s3Client.TagValueForKey(document.Key, "av-status")
		if valueErr != nil {
			return nil, valueErr
		}

		if value == "CLEAN" {
			document.Status = models.AccessibilityRequestDocumentStatusAvailable
		} else if value == "INFECTED" {
			document.Status = models.AccessibilityRequestDocumentStatusUnavailable
		} else {
			document.Status = models.AccessibilityRequestDocumentStatusPending
		}
	}

	return documents, nil
}

func (r *accessibilityRequestResolver) RelevantTestDate(ctx context.Context, obj *models.AccessibilityRequest) (*models.TestDate, error) {
	allDates, err := r.store.FetchTestDatesByRequestID(ctx, obj.ID)
	if err != nil {
		return nil, err
	}

	var nearFuture *models.TestDate
	var recentPast *models.TestDate
	now := time.Now()

	for _, td := range allDates {
		if td.Date.After(now) {
			if nearFuture == nil || td.Date.Before(nearFuture.Date) {
				nearFuture = td
				continue
			}
		}
		if td.Date.Before(now) {
			if recentPast == nil || td.Date.After((recentPast.Date)) {
				recentPast = td
				continue
			}
		}
	}

	// future date takes precedence
	if nearFuture != nil {
		return nearFuture, nil
	}
	// either recentPast is defined or it is nil
	return recentPast, nil
}

func (r *accessibilityRequestResolver) System(ctx context.Context, obj *models.AccessibilityRequest) (*models.System, error) {
	system, systemErr := r.store.FetchSystemByIntakeID(ctx, obj.IntakeID)
	if systemErr != nil {
		return nil, systemErr
	}
	system.BusinessOwner = &models.BusinessOwner{
		Name:      system.BusinessOwnerName.String,
		Component: system.BusinessOwnerComponent.String,
	}

	return system, nil
}

func (r *accessibilityRequestResolver) TestDates(ctx context.Context, obj *models.AccessibilityRequest) ([]*models.TestDate, error) {
	return r.store.FetchTestDatesByRequestID(ctx, obj.ID)
}

func (r *accessibilityRequestResolver) StatusRecord(ctx context.Context, obj *models.AccessibilityRequest) (*models.AccessibilityRequestStatusRecord, error) {
	return r.store.FetchLatestAccessibilityRequestStatusRecordByRequestID(ctx, obj.ID)
}

func (r *accessibilityRequestResolver) Notes(ctx context.Context, obj *models.AccessibilityRequest) ([]*models.AccessibilityRequestNote, error) {
	return r.store.FetchAccessibilityRequestNotesByRequestID(ctx, obj.ID)
}

func (r *accessibilityRequestDocumentResolver) DocumentType(ctx context.Context, obj *models.AccessibilityRequestDocument) (*model.AccessibilityRequestDocumentType, error) {
	return &model.AccessibilityRequestDocumentType{
		CommonType:           obj.CommonDocumentType,
		OtherTypeDescription: &obj.OtherType,
	}, nil
}

func (r *accessibilityRequestDocumentResolver) MimeType(ctx context.Context, obj *models.AccessibilityRequestDocument) (string, error) {
	return obj.FileType, nil
}

func (r *accessibilityRequestDocumentResolver) UploadedAt(ctx context.Context, obj *models.AccessibilityRequestDocument) (*time.Time, error) {
	return obj.CreatedAt, nil
}

func (r *accessibilityRequestNoteResolver) AuthorName(ctx context.Context, obj *models.AccessibilityRequestNote) (string, error) {
	user, err := r.service.FetchUserInfo(ctx, obj.EUAUserID)
	if err != nil {
		return "", err
	}
	return user.CommonName, nil
}

func (r *businessCaseResolver) AlternativeASolution(ctx context.Context, obj *models.BusinessCase) (*model.BusinessCaseSolution, error) {
	return &model.BusinessCaseSolution{
		AcquisitionApproach:     obj.AlternativeAAcquisitionApproach.Ptr(),
		Cons:                    obj.AlternativeACons.Ptr(),
		CostSavings:             obj.AlternativeACostSavings.Ptr(),
		HasUI:                   obj.AlternativeAHasUI.Ptr(),
		HostingCloudServiceType: obj.AlternativeAHostingCloudServiceType.Ptr(),
		HostingLocation:         obj.AlternativeAHostingLocation.Ptr(),
		HostingType:             obj.AlternativeAHostingType.Ptr(),
		Pros:                    obj.AlternativeAPros.Ptr(),
		SecurityIsApproved:      obj.AlternativeASecurityIsApproved.Ptr(),
		SecurityIsBeingReviewed: obj.AlternativeASecurityIsBeingReviewed.Ptr(),
		Summary:                 obj.AlternativeASummary.Ptr(),
		Title:                   obj.AlternativeATitle.Ptr(),
	}, nil
}

func (r *businessCaseResolver) AlternativeBSolution(ctx context.Context, obj *models.BusinessCase) (*model.BusinessCaseSolution, error) {
	return &model.BusinessCaseSolution{
		AcquisitionApproach:     obj.AlternativeBAcquisitionApproach.Ptr(),
		Cons:                    obj.AlternativeBCons.Ptr(),
		CostSavings:             obj.AlternativeBCostSavings.Ptr(),
		HasUI:                   obj.AlternativeBHasUI.Ptr(),
		HostingCloudServiceType: obj.AlternativeBHostingCloudServiceType.Ptr(),
		HostingLocation:         obj.AlternativeBHostingLocation.Ptr(),
		HostingType:             obj.AlternativeBHostingType.Ptr(),
		Pros:                    obj.AlternativeBPros.Ptr(),
		SecurityIsApproved:      obj.AlternativeBSecurityIsApproved.Ptr(),
		SecurityIsBeingReviewed: obj.AlternativeBSecurityIsBeingReviewed.Ptr(),
		Summary:                 obj.AlternativeBSummary.Ptr(),
		Title:                   obj.AlternativeBTitle.Ptr(),
	}, nil
}

func (r *businessCaseResolver) AsIsSolution(ctx context.Context, obj *models.BusinessCase) (*model.BusinessCaseAsIsSolution, error) {
	return &model.BusinessCaseAsIsSolution{
		Cons:        obj.AsIsCons.Ptr(),
		CostSavings: obj.AsIsCostSavings.Ptr(),
		Pros:        obj.AsIsPros.Ptr(),
		Summary:     obj.AsIsSummary.Ptr(),
		Title:       obj.AsIsTitle.Ptr(),
	}, nil
}

func (r *businessCaseResolver) BusinessNeed(ctx context.Context, obj *models.BusinessCase) (*string, error) {
	return obj.BusinessNeed.Ptr(), nil
}

func (r *businessCaseResolver) BusinessOwner(ctx context.Context, obj *models.BusinessCase) (*string, error) {
	return obj.BusinessOwner.Ptr(), nil
}

func (r *businessCaseResolver) CmsBenefit(ctx context.Context, obj *models.BusinessCase) (*string, error) {
	return obj.CMSBenefit.Ptr(), nil
}

func (r *businessCaseResolver) LifecycleCostLines(ctx context.Context, obj *models.BusinessCase) ([]*models.EstimatedLifecycleCost, error) {
	lifeCycleCostLines := obj.LifecycleCostLines

	if len(lifeCycleCostLines) == 0 {
		return nil, nil
	}

	var costLines []*models.EstimatedLifecycleCost
	for _, cost := range lifeCycleCostLines {
		costLine := &models.EstimatedLifecycleCost{
			BusinessCaseID: cost.BusinessCaseID,
			Cost:           cost.Cost,
			ID:             cost.ID,
			Phase:          cost.Phase,
			Solution:       cost.Solution,
			Year:           cost.Year,
		}
		costLines = append(costLines, costLine)
	}

	return costLines, nil
}

func (r *businessCaseResolver) PreferredSolution(ctx context.Context, obj *models.BusinessCase) (*model.BusinessCaseSolution, error) {
	return &model.BusinessCaseSolution{
		AcquisitionApproach:     obj.PreferredAcquisitionApproach.Ptr(),
		Cons:                    obj.PreferredCons.Ptr(),
		CostSavings:             obj.PreferredCostSavings.Ptr(),
		HasUI:                   obj.PreferredHasUI.Ptr(),
		HostingCloudServiceType: obj.PreferredHostingCloudServiceType.Ptr(),
		HostingLocation:         obj.PreferredHostingLocation.Ptr(),
		HostingType:             obj.PreferredHostingType.Ptr(),
		Pros:                    obj.PreferredPros.Ptr(),
		SecurityIsApproved:      obj.PreferredSecurityIsApproved.Ptr(),
		SecurityIsBeingReviewed: obj.PreferredSecurityIsBeingReviewed.Ptr(),
		Summary:                 obj.PreferredSummary.Ptr(),
		Title:                   obj.PreferredTitle.Ptr(),
	}, nil
}

func (r *businessCaseResolver) PriorityAlignment(ctx context.Context, obj *models.BusinessCase) (*string, error) {
	return obj.PriorityAlignment.Ptr(), nil
}

func (r *businessCaseResolver) ProjectName(ctx context.Context, obj *models.BusinessCase) (*string, error) {
	return obj.ProjectName.Ptr(), nil
}

func (r *businessCaseResolver) Requester(ctx context.Context, obj *models.BusinessCase) (*string, error) {
	return obj.Requester.Ptr(), nil
}

func (r *businessCaseResolver) RequesterPhoneNumber(ctx context.Context, obj *models.BusinessCase) (*string, error) {
	return obj.RequesterPhoneNumber.Ptr(), nil
}

func (r *businessCaseResolver) SuccessIndicators(ctx context.Context, obj *models.BusinessCase) (*string, error) {
	return obj.SuccessIndicators.Ptr(), nil
}

func (r *businessCaseResolver) SystemIntake(ctx context.Context, obj *models.BusinessCase) (*models.SystemIntake, error) {
	return r.store.FetchSystemIntakeByID(ctx, obj.SystemIntakeID)
}

func (r *mutationResolver) AddGRTFeedbackAndKeepBusinessCaseInDraft(ctx context.Context, input model.AddGRTFeedbackInput) (*model.AddGRTFeedbackPayload, error) {
	grtFeedback, err := r.service.AddGRTFeedback(
		ctx,
		&models.GRTFeedback{
			IntakeID:     input.IntakeID,
			Feedback:     input.Feedback,
			FeedbackType: models.GRTFeedbackTypeBUSINESSOWNER,
		},
		&models.Action{
			IntakeID:   &input.IntakeID,
			Feedback:   null.StringFrom(input.EmailBody),
			ActionType: models.ActionTypePROVIDEFEEDBACKBIZCASENEEDSCHANGES,
		},
		models.SystemIntakeStatusBIZCASECHANGESNEEDED)
	if err != nil {
		return nil, err
	}

	return &model.AddGRTFeedbackPayload{ID: &grtFeedback.ID}, nil
}

func (r *mutationResolver) AddGRTFeedbackAndProgressToFinalBusinessCase(ctx context.Context, input model.AddGRTFeedbackInput) (*model.AddGRTFeedbackPayload, error) {
	grtFeedback, err := r.service.AddGRTFeedback(
		ctx,
		&models.GRTFeedback{
			IntakeID:     input.IntakeID,
			Feedback:     input.Feedback,
			FeedbackType: models.GRTFeedbackTypeBUSINESSOWNER,
		},
		&models.Action{
			IntakeID:   &input.IntakeID,
			Feedback:   null.StringFrom(input.EmailBody),
			ActionType: models.ActionTypePROVIDEFEEDBACKNEEDBIZCASE,
		},
		models.SystemIntakeStatusBIZCASEFINALNEEDED)
	if err != nil {
		return nil, err
	}

	return &model.AddGRTFeedbackPayload{ID: &grtFeedback.ID}, nil
}

func (r *mutationResolver) AddGRTFeedbackAndRequestBusinessCase(ctx context.Context, input model.AddGRTFeedbackInput) (*model.AddGRTFeedbackPayload, error) {
	grtFeedback, err := r.service.AddGRTFeedback(
		ctx,
		&models.GRTFeedback{
			IntakeID:     input.IntakeID,
			Feedback:     input.Feedback,
			FeedbackType: models.GRTFeedbackTypeBUSINESSOWNER,
		},
		&models.Action{
			IntakeID:   &input.IntakeID,
			Feedback:   null.StringFrom(input.EmailBody),
			ActionType: models.ActionTypePROVIDEFEEDBACKNEEDBIZCASE,
		},
		models.SystemIntakeStatusNEEDBIZCASE)
	if err != nil {
		return nil, err
	}

	return &model.AddGRTFeedbackPayload{ID: &grtFeedback.ID}, nil
}

func (r *mutationResolver) CreateAccessibilityRequest(ctx context.Context, input model.CreateAccessibilityRequestInput) (*model.CreateAccessibilityRequestPayload, error) {
	requesterEUAID := appcontext.Principal(ctx).ID()
	requesterInfo, err := r.service.FetchUserInfo(ctx, requesterEUAID)
	if err != nil {
		return nil, err
	}

	intake, err := r.store.FetchSystemIntakeByID(ctx, input.IntakeID)
	if err != nil {
		return nil, err
	}

	request, err := r.store.CreateAccessibilityRequestAndInitialStatusRecord(ctx, &models.AccessibilityRequest{
		EUAUserID: requesterEUAID,
		Name:      input.Name,
		IntakeID:  input.IntakeID,
	})
	if err != nil {
		return nil, err
	}

	err = r.emailClient.SendNewAccessibilityRequestEmail(
		ctx,
		requesterInfo.CommonName,
		request.Name,
		intake.ProjectName.String,
		request.ID,
	)
	if err != nil {
		return nil, err
	}

	err = r.emailClient.SendNewAccessibilityRequestEmailToRequester(
		ctx,
		request.Name,
		request.ID,
		requesterInfo.Email,
	)
	if err != nil {
		return nil, err
	}

	return &model.CreateAccessibilityRequestPayload{
		AccessibilityRequest: request,
		UserErrors:           nil,
	}, nil
}

func (r *mutationResolver) DeleteAccessibilityRequest(ctx context.Context, input model.DeleteAccessibilityRequestInput) (*model.DeleteAccessibilityRequestPayload, error) {
	request, err := r.store.FetchAccessibilityRequestByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}

	removerEUAID := appcontext.Principal(ctx).ID()
	removerInfo, err := r.service.FetchUserInfo(ctx, removerEUAID)
	if err != nil {
		return nil, err
	}

	ok, err := services.AuthorizeUserIs508RequestOwner(ctx, request)
	if err != nil {
		return nil, err
	}
	if !ok {
		return nil, &apperrors.UnauthorizedError{Err: errors.New("unauthorized to delete accessibility request document")}
	}

	err = r.store.DeleteAccessibilityRequest(ctx, input.ID, input.Reason)
	if err != nil {
		return nil, err
	}

	err = r.emailClient.SendRemovedAccessibilityRequestEmail(ctx, request.Name, removerInfo.CommonName, input.Reason, removerInfo.Email)
	if err != nil {
		return nil, err
	}

	_, statusRecordErr := r.store.CreateAccessibilityRequestStatusRecord(ctx, &models.AccessibilityRequestStatusRecord{
		RequestID: input.ID,
		Status:    models.AccessibilityRequestStatusDeleted,
		EUAUserID: removerEUAID,
	})
	if statusRecordErr != nil {
		return nil, statusRecordErr
	}

	return &model.DeleteAccessibilityRequestPayload{ID: &input.ID}, nil
}

func (r *mutationResolver) CreateAccessibilityRequestDocument(ctx context.Context, input model.CreateAccessibilityRequestDocumentInput) (*model.CreateAccessibilityRequestDocumentPayload, error) {
	parsedURL, urlErr := url.Parse(input.URL)
	if urlErr != nil {
		return nil, urlErr
	}

	key, keyErr := r.s3Client.KeyFromURL(parsedURL)
	if keyErr != nil {
		return nil, keyErr
	}

	accessibilityRequest, requestErr := r.store.FetchAccessibilityRequestByID(ctx, input.RequestID)
	if requestErr != nil {
		return nil, requestErr
	}
	ok, authErr := services.AuthorizeUserIsRequestOwnerOr508Team(ctx, accessibilityRequest)
	if authErr != nil {
		return nil, authErr
	}
	if !ok {
		return nil, &apperrors.ResourceNotFoundError{Err: errors.New("request with the given id not found"), Resource: models.AccessibilityRequest{}}
	}

	requesterInfo, err := r.service.FetchUserInfo(ctx, accessibilityRequest.EUAUserID)
	if err != nil {
		return nil, err
	}

	doc, docErr := r.store.CreateAccessibilityRequestDocument(ctx, &models.AccessibilityRequestDocument{
		Name:               input.Name,
		FileType:           input.MimeType,
		Key:                key,
		Size:               input.Size,
		RequestID:          input.RequestID,
		CommonDocumentType: input.CommonDocumentType,
		OtherType:          *input.OtherDocumentTypeDescription,
	})

	if docErr != nil {
		return nil, docErr
	}
	if presignedURL, urlErr := r.s3Client.NewGetPresignedURL(key); urlErr == nil {
		doc.URL = presignedURL.URL
	}

	err = r.emailClient.SendNewDocumentEmailsToReviewTeamAndRequester(
		ctx,
		doc.CommonDocumentType,
		doc.OtherType,
		accessibilityRequest.Name,
		accessibilityRequest.ID,
		requesterInfo.Email,
	)
	if err != nil {
		return nil, err
	}

	return &model.CreateAccessibilityRequestDocumentPayload{
		AccessibilityRequestDocument: doc,
	}, nil
}

func (r *mutationResolver) CreateAccessibilityRequestNote(ctx context.Context, input model.CreateAccessibilityRequestNoteInput) (*model.CreateAccessibilityRequestNotePayload, error) {
	if input.Note == "" {
		return &model.CreateAccessibilityRequestNotePayload{
			AccessibilityRequestNote: nil,
			UserErrors:               []*model.UserError{{Message: "Must include a non-empty note", Path: []string{"note"}}},
		}, nil
	}

	created, err := r.store.CreateAccessibilityRequestNote(ctx, &models.AccessibilityRequestNote{
		Note:      input.Note,
		RequestID: input.RequestID,
		EUAUserID: appcontext.Principal(ctx).ID(),
	})
	if err != nil {
		return nil, err
	}

	if input.ShouldSendEmail {
		request, err := r.store.FetchAccessibilityRequestByID(ctx, input.RequestID)
		if err != nil {
			return nil, err
		}

		userInfo, err := r.service.FetchUserInfo(ctx, appcontext.Principal(ctx).ID())
		if err != nil {
			return nil, err
		}

		err = r.emailClient.SendNewAccessibilityRequestNoteEmail(ctx, input.RequestID, request.Name, userInfo.CommonName)
		if err != nil {
			return nil, err
		}
	}

	return &model.CreateAccessibilityRequestNotePayload{AccessibilityRequestNote: created}, nil
}

func (r *mutationResolver) DeleteAccessibilityRequestDocument(ctx context.Context, input model.DeleteAccessibilityRequestDocumentInput) (*model.DeleteAccessibilityRequestDocumentPayload, error) {
	accessibilityRequestDocument, err := r.store.FetchAccessibilityRequestDocumentByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}
	accessibilityRequest, err := r.store.FetchAccessibilityRequestByID(ctx, accessibilityRequestDocument.RequestID)
	if err != nil {
		return nil, err
	}
	ok, err := services.AuthorizeUserIsRequestOwnerOr508Team(ctx, accessibilityRequest)
	if err != nil {
		return nil, err
	}
	if !ok {
		return nil, &apperrors.UnauthorizedError{Err: errors.New("unauthorized to delete accessibility request document")}
	}
	err = r.store.DeleteAccessibilityRequestDocument(ctx, input.ID)

	if err != nil {
		return nil, err
	}

	return &model.DeleteAccessibilityRequestDocumentPayload{ID: &input.ID}, nil
}

func (r *mutationResolver) UpdateAccessibilityRequestStatus(ctx context.Context, input *model.UpdateAccessibilityRequestStatus) (*model.UpdateAccessibilityRequestStatusPayload, error) {
	requesterEUAID := appcontext.Principal(ctx).ID()

	if input.Status == models.AccessibilityRequestStatusOpen || input.Status == models.AccessibilityRequestStatusClosed || input.Status == models.AccessibilityRequestStatusInRemediation {

		request, err := r.store.FetchAccessibilityRequestByID(ctx, input.RequestID)
		if err != nil {
			return nil, err
		}

		userInfo, err := r.service.FetchUserInfo(ctx, requesterEUAID)
		if err != nil {
			return nil, err
		}

		latestStatusRecord, err := r.store.FetchLatestAccessibilityRequestStatusRecordByRequestID(ctx, input.RequestID)
		if err != nil {
			return nil, err
		}

		statusRecord, err := r.store.CreateAccessibilityRequestStatusRecord(ctx, &models.AccessibilityRequestStatusRecord{
			RequestID: input.RequestID,
			Status:    input.Status,
			EUAUserID: requesterEUAID,
		})
		if err != nil {
			return nil, err
		}

		if latestStatusRecord.Status != input.Status {
			err = r.emailClient.SendChangeAccessibilityRequestStatusEmail(
				ctx,
				input.RequestID,
				request.Name,
				userInfo.CommonName,
				latestStatusRecord.Status,
				input.Status,
			)
			if err != nil {
				return nil, err
			}
		}

		return &model.UpdateAccessibilityRequestStatusPayload{
			ID:         statusRecord.ID,
			RequestID:  statusRecord.RequestID,
			Status:     statusRecord.Status,
			EuaUserID:  statusRecord.EUAUserID,
			UserErrors: nil,
		}, nil
	}

	return &model.UpdateAccessibilityRequestStatusPayload{
		UserErrors: []*model.UserError{{Message: "Invalid status", Path: []string{"status"}}},
	}, nil
}

func (r *mutationResolver) CreateSystemIntakeActionBusinessCaseNeeded(ctx context.Context, input model.BasicActionInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.service.CreateActionUpdateStatus(
		ctx,
		&models.Action{
			IntakeID:   &input.IntakeID,
			ActionType: models.ActionTypeNEEDBIZCASE,
			Feedback:   null.StringFrom(input.Feedback),
		},
		input.IntakeID,
		models.SystemIntakeStatusNEEDBIZCASE,
		false,
	)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

func (r *mutationResolver) CreateSystemIntakeActionBusinessCaseNeedsChanges(ctx context.Context, input model.BasicActionInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.service.CreateActionUpdateStatus(
		ctx,
		&models.Action{
			IntakeID:   &input.IntakeID,
			ActionType: models.ActionTypeBIZCASENEEDSCHANGES,
			Feedback:   null.StringFrom(input.Feedback),
		},
		input.IntakeID,
		models.SystemIntakeStatusBIZCASECHANGESNEEDED,
		false,
	)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

func (r *mutationResolver) CreateSystemIntakeActionGuideReceievedClose(ctx context.Context, input model.BasicActionInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.service.CreateActionUpdateStatus(
		ctx,
		&models.Action{
			IntakeID:   &input.IntakeID,
			ActionType: models.ActionTypeGUIDERECEIVEDCLOSE,
			Feedback:   null.StringFrom(input.Feedback),
		},
		input.IntakeID,
		models.SystemIntakeStatusSHUTDOWNCOMPLETE,
		false,
	)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

func (r *mutationResolver) CreateSystemIntakeActionNoGovernanceNeeded(ctx context.Context, input model.BasicActionInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.service.CreateActionUpdateStatus(
		ctx,
		&models.Action{
			IntakeID:   &input.IntakeID,
			ActionType: models.ActionTypeNOGOVERNANCENEEDED,
			Feedback:   null.StringFrom(input.Feedback),
		},
		input.IntakeID,
		models.SystemIntakeStatusNOGOVERNANCE,
		false,
	)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

func (r *mutationResolver) CreateSystemIntakeActionNotItRequest(ctx context.Context, input model.BasicActionInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.service.CreateActionUpdateStatus(
		ctx,
		&models.Action{
			IntakeID:   &input.IntakeID,
			ActionType: models.ActionTypeNOTITREQUEST,
			Feedback:   null.StringFrom(input.Feedback),
		},
		input.IntakeID,
		models.SystemIntakeStatusNOTITREQUEST,
		false,
	)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

func (r *mutationResolver) CreateSystemIntakeActionNotRespondingClose(ctx context.Context, input model.BasicActionInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.service.CreateActionUpdateStatus(
		ctx,
		&models.Action{
			IntakeID:   &input.IntakeID,
			ActionType: models.ActionTypeNOTRESPONDINGCLOSE,
			Feedback:   null.StringFrom(input.Feedback),
		},
		input.IntakeID,
		models.SystemIntakeStatusNOGOVERNANCE,
		false,
	)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

func (r *mutationResolver) CreateSystemIntakeActionReadyForGrt(ctx context.Context, input model.BasicActionInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.service.CreateActionUpdateStatus(
		ctx,
		&models.Action{
			IntakeID:   &input.IntakeID,
			ActionType: models.ActionTypeREADYFORGRT,
			Feedback:   null.StringFrom(input.Feedback),
		},
		input.IntakeID,
		models.SystemIntakeStatusREADYFORGRT,
		false,
	)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

func (r *mutationResolver) CreateSystemIntakeActionSendEmail(ctx context.Context, input model.BasicActionInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.service.CreateActionUpdateStatus(
		ctx,
		&models.Action{
			IntakeID:   &input.IntakeID,
			ActionType: models.ActionTypeSENDEMAIL,
			Feedback:   null.StringFrom(input.Feedback),
		},
		input.IntakeID,
		models.SystemIntakeStatusSHUTDOWNINPROGRESS,
		false,
	)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

func (r *mutationResolver) CreateSystemIntakeNote(ctx context.Context, input model.CreateSystemIntakeNoteInput) (*model.SystemIntakeNote, error) {
	note, err := r.store.CreateNote(ctx, &models.Note{
		AuthorEUAID:    appcontext.Principal(ctx).ID(),
		AuthorName:     null.StringFrom(input.AuthorName),
		Content:        null.StringFrom(input.Content),
		SystemIntakeID: input.IntakeID,
	})
	return &model.SystemIntakeNote{
		ID: note.ID,
		Author: &model.SystemIntakeNoteAuthor{
			Name: note.AuthorName.String,
			Eua:  note.AuthorEUAID,
		},
		Content:   note.Content.String,
		CreatedAt: *note.CreatedAt,
	}, err
}

func (r *mutationResolver) CreateSystemIntake(ctx context.Context, input model.CreateSystemIntakeInput) (*models.SystemIntake, error) {
	systemIntake := models.SystemIntake{
		EUAUserID:   null.StringFrom(appcontext.Principal(ctx).ID()),
		RequestType: models.SystemIntakeRequestType(input.RequestType),
		Requester:   input.Requester.Name,
		Status:      models.SystemIntakeStatusINTAKEDRAFT,
	}
	createdIntake, err := r.store.CreateSystemIntake(ctx, &systemIntake)
	return createdIntake, err
}

func (r *mutationResolver) CreateTestDate(ctx context.Context, input model.CreateTestDateInput) (*model.CreateTestDatePayload, error) {
	testDate, err := r.service.CreateTestDate(ctx, &models.TestDate{
		TestType:  input.TestType,
		Date:      input.Date,
		Score:     input.Score,
		RequestID: input.RequestID,
	})
	if err != nil {
		return nil, err
	}
	return &model.CreateTestDatePayload{TestDate: testDate, UserErrors: nil}, nil
}

func (r *mutationResolver) UpdateTestDate(ctx context.Context, input model.UpdateTestDateInput) (*model.UpdateTestDatePayload, error) {
	testDate, err := r.store.UpdateTestDate(ctx, &models.TestDate{
		TestType: input.TestType,
		Date:     input.Date,
		Score:    input.Score,
		ID:       input.ID,
	})
	if err != nil {
		return nil, err
	}
	return &model.UpdateTestDatePayload{TestDate: testDate, UserErrors: nil}, nil
}

func (r *mutationResolver) DeleteTestDate(ctx context.Context, input model.DeleteTestDateInput) (*model.DeleteTestDatePayload, error) {
	testDate, err := r.store.DeleteTestDate(ctx, &models.TestDate{
		ID: input.ID,
	})
	if err != nil {
		return nil, err
	}
	return &model.DeleteTestDatePayload{TestDate: testDate, UserErrors: nil}, nil
}

func (r *mutationResolver) GeneratePresignedUploadURL(ctx context.Context, input model.GeneratePresignedUploadURLInput) (*model.GeneratePresignedUploadURLPayload, error) {
	url, err := r.s3Client.NewPutPresignedURL(input.MimeType)
	if err != nil {
		return nil, err
	}
	return &model.GeneratePresignedUploadURLPayload{
		URL: &url.URL,
	}, nil
}

func (r *mutationResolver) IssueLifecycleID(ctx context.Context, input model.IssueLifecycleIDInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.service.IssueLifecycleID(
		ctx,
		&models.SystemIntake{
			ID:                 input.IntakeID,
			LifecycleExpiresAt: &input.ExpiresAt,
			LifecycleScope:     null.StringFrom(input.Scope),
			DecisionNextSteps:  null.StringFrom(*input.NextSteps),
			LifecycleID:        null.StringFrom(*input.Lcid),
		},
		&models.Action{
			IntakeID: &input.IntakeID,
			Feedback: null.StringFrom(input.Feedback),
		})
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

func (r *mutationResolver) MarkSystemIntakeReadyForGrb(ctx context.Context, input model.AddGRTFeedbackInput) (*model.AddGRTFeedbackPayload, error) {
	grtFeedback, err := r.service.AddGRTFeedback(
		ctx,
		&models.GRTFeedback{
			IntakeID:     input.IntakeID,
			Feedback:     input.Feedback,
			FeedbackType: models.GRTFeedbackTypeGRB,
		},
		&models.Action{
			IntakeID:   &input.IntakeID,
			Feedback:   null.StringFrom(input.EmailBody),
			ActionType: models.ActionTypeREADYFORGRB,
		},
		models.SystemIntakeStatusREADYFORGRB)
	if err != nil {
		return nil, err
	}

	return &model.AddGRTFeedbackPayload{ID: &grtFeedback.ID}, nil
}

func (r *mutationResolver) RejectIntake(ctx context.Context, input model.RejectIntakeInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.service.RejectIntake(
		ctx,
		&models.SystemIntake{
			ID:                input.IntakeID,
			DecisionNextSteps: null.StringFrom(*input.NextSteps),
			RejectionReason:   null.StringFrom(input.Reason),
		},
		&models.Action{
			IntakeID: &input.IntakeID,
			Feedback: null.StringFrom(input.Feedback),
		})
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

func (r *mutationResolver) SubmitIntake(ctx context.Context, input model.SubmitIntakeInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.store.FetchSystemIntakeByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}

	actorEUAID := appcontext.Principal(ctx).ID()
	actorInfo, err := r.service.FetchUserInfo(ctx, actorEUAID)
	if err != nil {
		return nil, err
	}

	err = r.service.SubmitIntake(
		ctx,
		intake,
		&models.Action{
			IntakeID:       &input.ID,
			ActionType:     models.ActionTypeSUBMITINTAKE,
			ActorEUAUserID: actorEUAID,
			ActorName:      actorInfo.CommonName,
			ActorEmail:     actorInfo.Email,
		})
	if err != nil {
		return nil, err
	}

	intake, err = r.store.FetchSystemIntakeByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}

	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

func (r *mutationResolver) UpdateSystemIntakeAdminLead(ctx context.Context, input model.UpdateSystemIntakeAdminLeadInput) (*model.UpdateSystemIntakePayload, error) {
	savedAdminLead, err := r.store.UpdateAdminLead(ctx, input.ID, input.AdminLead)
	systemIntake := models.SystemIntake{
		AdminLead: null.StringFrom(savedAdminLead),
		ID:        input.ID,
	}
	return &model.UpdateSystemIntakePayload{
		SystemIntake: &systemIntake,
	}, err
}

func (r *mutationResolver) UpdateSystemIntakeReviewDates(ctx context.Context, input model.UpdateSystemIntakeReviewDatesInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.store.UpdateReviewDates(ctx, input.ID, input.GrbDate, input.GrtDate)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

func (r *mutationResolver) UpdateSystemIntakeContactDetails(ctx context.Context, input model.UpdateSystemIntakeContactDetailsInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.store.FetchSystemIntakeByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}
	intake.Requester = input.Requester.Name
	intake.Component = null.StringFrom(input.Requester.Component)
	intake.BusinessOwner = null.StringFrom(input.BusinessOwner.Name)
	intake.BusinessOwnerComponent = null.StringFrom(input.BusinessOwner.Component)
	intake.ProductManager = null.StringFrom(input.ProductManager.Name)
	intake.ProductManagerComponent = null.StringFrom(input.ProductManager.Component)

	if input.Isso.IsPresent != nil && *input.Isso.IsPresent {
		intake.ISSOName = null.StringFromPtr(input.Isso.Name)
	} else {
		intake.ISSOName = null.StringFromPtr(nil)
	}

	if input.GovernanceTeams.IsPresent != nil {
		trbCollaboratorName := null.StringFromPtr(nil)
		for _, team := range input.GovernanceTeams.Teams {
			if team.Key == "technicalReviewBoard" {
				trbCollaboratorName = null.StringFrom(team.Collaborator)
			}
		}
		intake.TRBCollaboratorName = trbCollaboratorName

		oitCollaboratorName := null.StringFromPtr(nil)
		for _, team := range input.GovernanceTeams.Teams {
			if team.Key == "securityPrivacy" {
				oitCollaboratorName = null.StringFrom(team.Collaborator)
			}
		}
		intake.OITSecurityCollaboratorName = oitCollaboratorName

		eaCollaboratorName := null.StringFromPtr(nil)
		for _, team := range input.GovernanceTeams.Teams {
			if team.Key == "enterpriseArchitecture" {
				eaCollaboratorName = null.StringFrom(team.Collaborator)
			}
		}
		intake.EACollaboratorName = eaCollaboratorName
	} else {
		intake.TRBCollaboratorName = null.StringFromPtr(nil)
		intake.OITSecurityCollaboratorName = null.StringFromPtr(nil)
		intake.EACollaboratorName = null.StringFromPtr(nil)
	}

	savedIntake, err := r.store.UpdateSystemIntake(ctx, intake)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: savedIntake,
	}, err
}

func (r *mutationResolver) UpdateSystemIntakeRequestDetails(ctx context.Context, input model.UpdateSystemIntakeRequestDetailsInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.store.FetchSystemIntakeByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}
	intake.ProjectName = null.StringFromPtr(input.RequestName)
	intake.BusinessNeed = null.StringFromPtr(input.BusinessNeed)
	intake.Solution = null.StringFromPtr(input.BusinessSolution)
	intake.EASupportRequest = null.BoolFromPtr(input.NeedsEaSupport)

	savedIntake, err := r.store.UpdateSystemIntake(ctx, intake)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: savedIntake,
	}, err
}

func (r *mutationResolver) UpdateSystemIntakeContractDetails(ctx context.Context, input model.UpdateSystemIntakeContractDetailsInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.store.FetchSystemIntakeByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}

	intake.ProcessStatus = null.StringFromPtr(input.CurrentStage)

	if input.FundingSource != nil {
		if null.BoolFromPtr(input.FundingSource.IsFunded).ValueOrZero() {
			intake.ExistingFunding = null.BoolFromPtr(input.FundingSource.IsFunded)
			intake.FundingSource = null.StringFromPtr(input.FundingSource.Source)
			intake.FundingNumber = null.StringFromPtr(input.FundingSource.FundingNumber)
		}

		if !null.BoolFromPtr(input.FundingSource.IsFunded).ValueOrZero() {
			intake.ExistingFunding = null.BoolFromPtr(input.FundingSource.IsFunded)
			intake.FundingSource = null.StringFromPtr(nil)
			intake.FundingNumber = null.StringFromPtr(nil)
		}
	}

	if input.Costs != nil {
		intake.CostIncreaseAmount = null.StringFromPtr(input.Costs.ExpectedIncreaseAmount)
		intake.CostIncrease = null.StringFromPtr(input.Costs.IsExpectingIncrease)

		if input.Costs.IsExpectingIncrease != nil {
			if *input.Costs.IsExpectingIncrease == "YES" {
				intake.CostIncreaseAmount = null.StringFromPtr(input.Costs.ExpectedIncreaseAmount)
				intake.CostIncrease = null.StringFromPtr(input.Costs.IsExpectingIncrease)
			}
			if *input.Costs.IsExpectingIncrease != "YES" {
				intake.CostIncreaseAmount = null.StringFromPtr(nil)
				intake.CostIncrease = null.StringFromPtr(input.Costs.IsExpectingIncrease)
			}
		}
	}

	if input.Contract != nil {
		// set the fields to the values we receive
		intake.ExistingContract = null.StringFromPtr(input.Contract.HasContract)
		intake.Contractor = null.StringFromPtr(input.Contract.Contractor)
		intake.ContractVehicle = null.StringFromPtr(input.Contract.Vehicle)
		if input.Contract.StartDate != nil {
			intake.ContractStartDate = input.Contract.StartDate
		}
		if input.Contract.EndDate != nil {
			intake.ContractEndDate = input.Contract.EndDate
		}

		// in case hasContract has changed, clear the other fields
		if input.Contract.HasContract != nil {
			if *input.Contract.HasContract == "NOT_STARTED" || *input.Contract.HasContract == "NOT_NEEDED" {
				intake.Contractor = null.StringFromPtr(nil)
				intake.ContractVehicle = null.StringFromPtr(nil)
				intake.ContractStartDate = nil
				intake.ContractEndDate = nil
			}
		}
	}

	savedIntake, err := r.store.UpdateSystemIntake(ctx, intake)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: savedIntake,
	}, err
}

func (r *queryResolver) AccessibilityRequest(ctx context.Context, id uuid.UUID) (*models.AccessibilityRequest, error) {
	// deleted requests need to be returned to be able to show a deleted request view
	accessibilityRequest, err := r.store.FetchAccessibilityRequestByIDIncludingDeleted(ctx, id)
	if err != nil {
		return nil, err
	}
	ok, err := services.AuthorizeUserIsRequestOwnerOr508Team(ctx, accessibilityRequest)
	if err != nil {
		return nil, err
	}
	if !ok {
		return nil, &apperrors.ResourceNotFoundError{Err: errors.New("unauthorized to fetch accessibility request")}
	}
	return accessibilityRequest, nil
}

func (r *queryResolver) AccessibilityRequests(ctx context.Context, after *string, first int) (*model.AccessibilityRequestsConnection, error) {
	requests, queryErr := r.store.FetchAccessibilityRequests(ctx)
	if queryErr != nil {
		return nil, gqlerror.Errorf("query error: %s", queryErr)
	}

	edges := []*model.AccessibilityRequestEdge{}

	for _, request := range requests {
		node := request
		edges = append(edges, &model.AccessibilityRequestEdge{
			Node: &node,
		})
	}

	return &model.AccessibilityRequestsConnection{Edges: edges}, nil
}

func (r *queryResolver) Requests(ctx context.Context, after *string, first int) (*model.RequestsConnection, error) {
	requests, queryErr := r.store.FetchMyRequests(ctx)
	if queryErr != nil {
		return nil, gqlerror.Errorf("query error: %s", queryErr)
	}

	edges := []*model.RequestEdge{}

	for _, request := range requests {
		node := model.Request{
			ID:              request.ID,
			SubmittedAt:     request.SubmittedAt,
			Name:            request.Name.Ptr(),
			Type:            request.Type,
			Status:          request.Status,
			StatusCreatedAt: request.StatusCreatedAt,
			Lcid:            request.LifecycleID.Ptr(),
			NextMeetingDate: request.NextMeetingDate,
		}
		edges = append(edges, &model.RequestEdge{
			Node: &node,
		})
	}

	return &model.RequestsConnection{Edges: edges}, nil
}

func (r *queryResolver) SystemIntake(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
	intake, err := r.store.FetchSystemIntakeByID(ctx, id)
	if err != nil {
		return nil, err
	}

	ok, err := services.AuthorizeUserIsIntakeRequesterOrHasGRTJobCode(ctx, intake)
	if err != nil {
		return nil, err
	}
	if !ok {
		return nil, &apperrors.UnauthorizedError{Err: errors.New("unauthorized to fetch system intake")}
	}

	return intake, nil
}

func (r *queryResolver) Systems(ctx context.Context, after *string, first int) (*model.SystemConnection, error) {
	systems, err := r.store.ListSystems(ctx)
	if err != nil {
		return nil, err
	}

	conn := &model.SystemConnection{}
	for _, system := range systems {
		system.BusinessOwner = &models.BusinessOwner{
			Name:      system.BusinessOwnerName.String,
			Component: system.BusinessOwnerComponent.String,
		}
		conn.Edges = append(conn.Edges, &model.SystemEdge{
			Node: system,
		})
	}
	return conn, nil
}

func (r *queryResolver) CurrentUser(ctx context.Context) (*model.CurrentUser, error) {
	ldUser := flags.Principal(ctx)
	userKey := ldUser.GetKey()
	signedHash := r.ldClient.SecureModeHash(ldUser)

	currentUser := model.CurrentUser{
		LaunchDarkly: &model.LaunchDarklySettings{
			UserKey:    userKey,
			SignedHash: signedHash,
		},
	}
	return &currentUser, nil
}

func (r *systemIntakeResolver) Actions(ctx context.Context, obj *models.SystemIntake) ([]*model.SystemIntakeAction, error) {
	actions, actionsErr := r.store.GetActionsByRequestID(ctx, obj.ID)
	if actionsErr != nil {
		return nil, actionsErr
	}

	var results []*model.SystemIntakeAction
	for _, action := range actions {
		graphAction := model.SystemIntakeAction{
			ID:   action.ID,
			Type: model.SystemIntakeActionType(action.ActionType),
			Actor: &model.SystemIntakeActionActor{
				Name:  action.ActorName,
				Email: action.ActorEmail.String(),
			},
			Feedback:  action.Feedback.Ptr(),
			CreatedAt: *action.CreatedAt,
		}
		results = append(results, &graphAction)
	}
	return results, nil
}

func (r *systemIntakeResolver) AdminLead(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.AdminLead.Ptr(), nil
}

func (r *systemIntakeResolver) BusinessCase(ctx context.Context, obj *models.SystemIntake) (*models.BusinessCase, error) {
	if obj.BusinessCaseID == nil {
		return nil, nil
	}
	return r.store.FetchBusinessCaseByID(ctx, *obj.BusinessCaseID)
}

func (r *systemIntakeResolver) BusinessNeed(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.BusinessNeed.Ptr(), nil
}

func (r *systemIntakeResolver) BusinessOwner(ctx context.Context, obj *models.SystemIntake) (*model.SystemIntakeBusinessOwner, error) {
	return &model.SystemIntakeBusinessOwner{
		Component: obj.BusinessOwnerComponent.Ptr(),
		Name:      obj.BusinessOwner.Ptr(),
	}, nil
}

func (r *systemIntakeResolver) BusinessSolution(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.Solution.Ptr(), nil
}

func (r *systemIntakeResolver) Contract(ctx context.Context, obj *models.SystemIntake) (*model.SystemIntakeContract, error) {
	contractEnd := model.ContractDate{}
	if len(obj.ContractEndMonth.String) > 0 {
		contractEnd.Month = obj.ContractEndMonth.Ptr()
	}

	if len(obj.ContractEndYear.String) > 0 {
		contractEnd.Year = obj.ContractEndYear.Ptr()
	}

	if obj.ContractEndDate != nil {
		endDate := *obj.ContractEndDate
		year, month, day := endDate.Date()

		dayStr := strconv.Itoa(day)
		monthStr := strconv.Itoa(int(month))
		yearStr := strconv.Itoa(year)

		contractEnd.Day = &dayStr
		contractEnd.Month = &monthStr
		contractEnd.Year = &yearStr
	}

	contractStart := model.ContractDate{}
	if len(obj.ContractStartMonth.String) > 0 {
		contractStart.Month = obj.ContractStartMonth.Ptr()
	}

	if len(obj.ContractStartYear.String) > 0 {
		contractStart.Year = obj.ContractStartYear.Ptr()
	}

	if obj.ContractStartDate != nil {
		startDate := *obj.ContractStartDate
		year, month, day := startDate.Date()

		dayStr := strconv.Itoa(day)
		monthStr := strconv.Itoa(int(month))
		yearStr := strconv.Itoa(year)

		contractStart.Day = &dayStr
		contractStart.Month = &monthStr
		contractStart.Year = &yearStr
	}

	return &model.SystemIntakeContract{
		Contractor:  obj.Contractor.Ptr(),
		EndDate:     &contractEnd,
		HasContract: obj.ExistingContract.Ptr(),
		StartDate:   &contractStart,
		Vehicle:     obj.ContractVehicle.Ptr(),
	}, nil
}

func (r *systemIntakeResolver) Costs(ctx context.Context, obj *models.SystemIntake) (*model.SystemIntakeCosts, error) {
	return &model.SystemIntakeCosts{
		ExpectedIncreaseAmount: obj.CostIncreaseAmount.Ptr(),
		IsExpectingIncrease:    obj.CostIncrease.Ptr(),
	}, nil
}

func (r *systemIntakeResolver) CurrentStage(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ProcessStatus.Ptr(), nil
}

func (r *systemIntakeResolver) DecisionNextSteps(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.DecisionNextSteps.Ptr(), nil
}

func (r *systemIntakeResolver) EaCollaborator(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.EACollaborator.Ptr(), nil
}

func (r *systemIntakeResolver) EaCollaboratorName(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.EACollaboratorName.Ptr(), nil
}

func (r *systemIntakeResolver) EuaUserID(ctx context.Context, obj *models.SystemIntake) (string, error) {
	return obj.EUAUserID.String, nil
}

func (r *systemIntakeResolver) FundingSource(ctx context.Context, obj *models.SystemIntake) (*model.SystemIntakeFundingSource, error) {
	return &model.SystemIntakeFundingSource{
		IsFunded:      obj.ExistingFunding.Ptr(),
		FundingNumber: obj.FundingNumber.Ptr(),
		Source:        obj.FundingSource.Ptr(),
	}, nil
}

func (r *systemIntakeResolver) GovernanceTeams(ctx context.Context, obj *models.SystemIntake) (*model.SystemIntakeGovernanceTeam, error) {
	var teams []*model.SystemIntakeCollaborator

	if len(obj.TRBCollaboratorName.String) > 0 {
		key := "technicalReviewBoard"
		label := "Technical Review Board (TRB)"
		acronym := "TRB"
		name := "Technical Review Board"

		teams = append(teams, &model.SystemIntakeCollaborator{
			Key:          key,
			Label:        label,
			Acronym:      acronym,
			Name:         name,
			Collaborator: obj.TRBCollaboratorName.String,
		})
	}

	if len(obj.OITSecurityCollaboratorName.String) > 0 {
		key := "securityPrivacy"
		label := "OIT's Security and Privacy Group (ISPG)"
		acronym := "ISPG"
		name := "OIT's Security and Privacy Group"

		teams = append(teams, &model.SystemIntakeCollaborator{
			Key:          key,
			Label:        label,
			Acronym:      acronym,
			Name:         name,
			Collaborator: obj.OITSecurityCollaboratorName.String,
		})
	}

	if len(obj.EACollaboratorName.String) > 0 {
		key := "enterpriseArchitecture"
		label := "Enterprise Architecture (EA)"
		acronym := "EA"
		name := "Enterprise Architecture"

		teams = append(teams, &model.SystemIntakeCollaborator{
			Key:          key,
			Label:        label,
			Acronym:      acronym,
			Name:         name,
			Collaborator: obj.EACollaboratorName.String,
		})
	}

	isPresent := len(teams) > 0
	return &model.SystemIntakeGovernanceTeam{
		IsPresent: &isPresent,
		Teams:     teams,
	}, nil
}

func (r *systemIntakeResolver) GrtFeedbacks(ctx context.Context, obj *models.SystemIntake) ([]*models.GRTFeedback, error) {
	return r.store.FetchGRTFeedbacksByIntakeID(ctx, obj.ID)
}

func (r *systemIntakeResolver) Isso(ctx context.Context, obj *models.SystemIntake) (*model.SystemIntakeIsso, error) {
	isPresent := len(obj.ISSOName.String) > 0

	return &model.SystemIntakeIsso{
		IsPresent: &isPresent,
		Name:      obj.ISSOName.Ptr(),
	}, nil
}

func (r *systemIntakeResolver) Lcid(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.LifecycleID.Ptr(), nil
}

func (r *systemIntakeResolver) LcidScope(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.LifecycleScope.Ptr(), nil
}

func (r *systemIntakeResolver) NeedsEaSupport(ctx context.Context, obj *models.SystemIntake) (*bool, error) {
	return obj.EASupportRequest.Ptr(), nil
}

func (r *systemIntakeResolver) Notes(ctx context.Context, obj *models.SystemIntake) ([]*model.SystemIntakeNote, error) {
	notes, notesErr := r.store.FetchNotesBySystemIntakeID(ctx, obj.ID)
	if notesErr != nil {
		return nil, notesErr
	}

	var graphNotes []*model.SystemIntakeNote
	for _, n := range notes {
		graphNotes = append(graphNotes, &model.SystemIntakeNote{
			ID: n.ID,
			Author: &model.SystemIntakeNoteAuthor{
				Name: n.AuthorName.String,
				Eua:  n.AuthorEUAID,
			},
			Content:   n.Content.String,
			CreatedAt: *n.CreatedAt,
		})
	}
	return graphNotes, nil
}

func (r *systemIntakeResolver) OitSecurityCollaborator(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.OITSecurityCollaborator.Ptr(), nil
}

func (r *systemIntakeResolver) OitSecurityCollaboratorName(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.OITSecurityCollaboratorName.Ptr(), nil
}

func (r *systemIntakeResolver) ProductManager(ctx context.Context, obj *models.SystemIntake) (*model.SystemIntakeProductManager, error) {
	return &model.SystemIntakeProductManager{
		Component: obj.ProductManagerComponent.Ptr(),
		Name:      obj.ProductManager.Ptr(),
	}, nil
}

func (r *systemIntakeResolver) ProjectAcronym(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ProjectAcronym.Ptr(), nil
}

func (r *systemIntakeResolver) RejectionReason(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.RejectionReason.Ptr(), nil
}

func (r *systemIntakeResolver) RequestName(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ProjectName.Ptr(), nil
}

func (r *systemIntakeResolver) Requester(ctx context.Context, obj *models.SystemIntake) (*model.SystemIntakeRequester, error) {
	return &model.SystemIntakeRequester{
		Component: obj.Component.Ptr(),
		Email:     obj.RequesterEmailAddress.Ptr(),
		Name:      obj.Requester,
	}, nil
}

func (r *systemIntakeResolver) TrbCollaborator(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.TRBCollaborator.Ptr(), nil
}

func (r *systemIntakeResolver) TrbCollaboratorName(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.TRBCollaboratorName.Ptr(), nil
}

func (r *systemIntakeResolver) GrtReviewEmailBody(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.GrtReviewEmailBody.Ptr(), nil
}

func (r *systemIntakeResolver) LastAdminNote(ctx context.Context, obj *models.SystemIntake) (*model.LastAdminNote, error) {
	return &model.LastAdminNote{
		Content:   obj.LastAdminNoteContent.Ptr(),
		CreatedAt: obj.LastAdminNoteCreatedAt,
	}, nil
}

// AccessibilityRequest returns generated.AccessibilityRequestResolver implementation.
func (r *Resolver) AccessibilityRequest() generated.AccessibilityRequestResolver {
	return &accessibilityRequestResolver{r}
}

// AccessibilityRequestDocument returns generated.AccessibilityRequestDocumentResolver implementation.
func (r *Resolver) AccessibilityRequestDocument() generated.AccessibilityRequestDocumentResolver {
	return &accessibilityRequestDocumentResolver{r}
}

// AccessibilityRequestNote returns generated.AccessibilityRequestNoteResolver implementation.
func (r *Resolver) AccessibilityRequestNote() generated.AccessibilityRequestNoteResolver {
	return &accessibilityRequestNoteResolver{r}
}

// BusinessCase returns generated.BusinessCaseResolver implementation.
func (r *Resolver) BusinessCase() generated.BusinessCaseResolver { return &businessCaseResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// SystemIntake returns generated.SystemIntakeResolver implementation.
func (r *Resolver) SystemIntake() generated.SystemIntakeResolver { return &systemIntakeResolver{r} }

type accessibilityRequestResolver struct{ *Resolver }
type accessibilityRequestDocumentResolver struct{ *Resolver }
type accessibilityRequestNoteResolver struct{ *Resolver }
type businessCaseResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type systemIntakeResolver struct{ *Resolver }
