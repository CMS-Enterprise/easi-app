package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"net/url"
	"time"

	"github.com/google/uuid"
	"github.com/vektah/gqlparser/v2/gqlerror"

	"github.com/cmsgov/easi-app/pkg/graph/generated"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
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

func (r *mutationResolver) CreateAccessibilityRequest(ctx context.Context, input model.CreateAccessibilityRequestInput) (*model.CreateAccessibilityRequestPayload, error) {
	request, err := r.store.CreateAccessibilityRequest(ctx, &models.AccessibilityRequest{
		Name:     input.Name,
		IntakeID: input.IntakeID,
	})
	if err != nil {
		return nil, err
	}

	return &model.CreateAccessibilityRequestPayload{
		AccessibilityRequest: request,
		UserErrors:           nil,
	}, nil
}

func (r *mutationResolver) CreateAccessibilityRequestDocument(ctx context.Context, input model.CreateAccessibilityRequestDocumentInput) (*model.CreateAccessibilityRequestDocumentPayload, error) {
	url, urlErr := url.Parse(input.URL)
	if urlErr != nil {
		return nil, urlErr
	}

	key, keyErr := r.s3Client.KeyFromURL(url)
	if keyErr != nil {
		return nil, keyErr
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
	if url, urlErr := r.s3Client.NewGetPresignedURL(key); urlErr == nil {
		doc.URL = url.URL
	}

	return &model.CreateAccessibilityRequestDocumentPayload{
		AccessibilityRequestDocument: doc,
	}, nil
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

func (r *mutationResolver) GeneratePresignedUploadURL(ctx context.Context, input model.GeneratePresignedUploadURLInput) (*model.GeneratePresignedUploadURLPayload, error) {
	url, err := r.s3Client.NewPutPresignedURL(input.MimeType)
	if err != nil {
		return nil, err
	}
	return &model.GeneratePresignedUploadURLPayload{
		URL: &url.URL,
	}, nil
}

func (r *mutationResolver) UpdateTestDate(ctx context.Context, input model.UpdateTestDateInput) (*model.UpdateTestDatePayload, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) AccessibilityRequest(ctx context.Context, id uuid.UUID) (*models.AccessibilityRequest, error) {
	return r.store.FetchAccessibilityRequestByID(ctx, id)
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

func (r *queryResolver) SystemIntake(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error) {
	return r.store.FetchSystemIntakeByID(ctx, id)
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

func (r *systemIntakeResolver) BusinessNeed(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.BusinessNeed.Ptr(), nil
}

func (r *systemIntakeResolver) BusinessOwner(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.BusinessOwner.Ptr(), nil
}

func (r *systemIntakeResolver) BusinessOwnerComponent(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.BusinessOwnerComponent.Ptr(), nil
}

func (r *systemIntakeResolver) Component(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.Component.Ptr(), nil
}

func (r *systemIntakeResolver) ContractEndMonth(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ContractEndMonth.Ptr(), nil
}

func (r *systemIntakeResolver) ContractEndYear(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ContractEndYear.Ptr(), nil
}

func (r *systemIntakeResolver) ContractStartMonth(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ContractStartMonth.Ptr(), nil
}

func (r *systemIntakeResolver) ContractStartYear(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ContractStartYear.Ptr(), nil
}

func (r *systemIntakeResolver) ContractVehicle(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ContractVehicle.Ptr(), nil
}

func (r *systemIntakeResolver) Contractor(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.Contractor.Ptr(), nil
}

func (r *systemIntakeResolver) CostIncrease(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.CostIncrease.Ptr(), nil
}

func (r *systemIntakeResolver) CostIncreaseAmount(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.CostIncreaseAmount.Ptr(), nil
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

func (r *systemIntakeResolver) EaSupportRequest(ctx context.Context, obj *models.SystemIntake) (*bool, error) {
	return obj.EASupportRequest.Ptr(), nil
}

func (r *systemIntakeResolver) EuaUserID(ctx context.Context, obj *models.SystemIntake) (string, error) {
	return obj.EUAUserID.String, nil
}

func (r *systemIntakeResolver) ExistingContract(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ExistingContract.Ptr(), nil
}

func (r *systemIntakeResolver) ExistingFunding(ctx context.Context, obj *models.SystemIntake) (*bool, error) {
	return obj.ExistingFunding.Ptr(), nil
}

func (r *systemIntakeResolver) FundingNumber(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.FundingNumber.Ptr(), nil
}

func (r *systemIntakeResolver) FundingSource(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.FundingNumber.Ptr(), nil
}

func (r *systemIntakeResolver) Isso(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ISSO.Ptr(), nil
}

func (r *systemIntakeResolver) IssoName(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ISSOName.Ptr(), nil
}

func (r *systemIntakeResolver) Lcid(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.LifecycleID.Ptr(), nil
}

func (r *systemIntakeResolver) LcidScope(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.LifecycleScope.Ptr(), nil
}

func (r *systemIntakeResolver) OitSecurityCollaborator(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.OITSecurityCollaborator.Ptr(), nil
}

func (r *systemIntakeResolver) OitSecurityCollaboratorName(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.OITSecurityCollaboratorName.Ptr(), nil
}

func (r *systemIntakeResolver) ProcessStatus(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ProcessStatus.Ptr(), nil
}

func (r *systemIntakeResolver) ProductManager(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ProductManager.Ptr(), nil
}

func (r *systemIntakeResolver) ProductManagerComponent(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ProductManagerComponent.Ptr(), nil
}

func (r *systemIntakeResolver) ProjectAcronym(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ProjectAcronym.Ptr(), nil
}

func (r *systemIntakeResolver) ProjectName(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ProjectName.Ptr(), nil
}

func (r *systemIntakeResolver) RejectionReason(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.RejectionReason.Ptr(), nil
}

func (r *systemIntakeResolver) Solution(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.Solution.Ptr(), nil
}

func (r *systemIntakeResolver) TrbCollaborator(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.TRBCollaborator.Ptr(), nil
}

func (r *systemIntakeResolver) TrbCollaboratorName(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.TRBCollaboratorName.Ptr(), nil
}

// AccessibilityRequest returns generated.AccessibilityRequestResolver implementation.
func (r *Resolver) AccessibilityRequest() generated.AccessibilityRequestResolver {
	return &accessibilityRequestResolver{r}
}

// AccessibilityRequestDocument returns generated.AccessibilityRequestDocumentResolver implementation.
func (r *Resolver) AccessibilityRequestDocument() generated.AccessibilityRequestDocumentResolver {
	return &accessibilityRequestDocumentResolver{r}
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// SystemIntake returns generated.SystemIntakeResolver implementation.
func (r *Resolver) SystemIntake() generated.SystemIntakeResolver { return &systemIntakeResolver{r} }

type accessibilityRequestResolver struct{ *Resolver }
type accessibilityRequestDocumentResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type systemIntakeResolver struct{ *Resolver }
