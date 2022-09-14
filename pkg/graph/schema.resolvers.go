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
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	cedarcore "github.com/cmsgov/easi-app/pkg/cedar/core"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/flags"
	"github.com/cmsgov/easi-app/pkg/graph/generated"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/graph/resolvers"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/services"
)

// Documents is the resolver for the documents field.
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

// RelevantTestDate is the resolver for the relevantTestDate field.
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

// System is the resolver for the system field.
func (r *accessibilityRequestResolver) System(ctx context.Context, obj *models.AccessibilityRequest) (*models.System, error) {
	if obj.IntakeID == nil {
		return nil, nil
	}
	system, systemErr := r.store.FetchSystemByIntakeID(ctx, *obj.IntakeID)
	if systemErr != nil {
		return nil, systemErr
	}
	system.BusinessOwner = &models.BusinessOwner{
		Name:      system.BusinessOwnerName.String,
		Component: system.BusinessOwnerComponent.String,
	}

	return system, nil
}

// TestDates is the resolver for the testDates field.
func (r *accessibilityRequestResolver) TestDates(ctx context.Context, obj *models.AccessibilityRequest) ([]*models.TestDate, error) {
	return r.store.FetchTestDatesByRequestID(ctx, obj.ID)
}

// StatusRecord is the resolver for the statusRecord field.
func (r *accessibilityRequestResolver) StatusRecord(ctx context.Context, obj *models.AccessibilityRequest) (*models.AccessibilityRequestStatusRecord, error) {
	return r.store.FetchLatestAccessibilityRequestStatusRecordByRequestID(ctx, obj.ID)
}

// Notes is the resolver for the notes field.
func (r *accessibilityRequestResolver) Notes(ctx context.Context, obj *models.AccessibilityRequest) ([]*models.AccessibilityRequestNote, error) {
	return r.store.FetchAccessibilityRequestNotesByRequestID(ctx, obj.ID)
}

// CedarSystemID is the resolver for the cedarSystemId field.
func (r *accessibilityRequestResolver) CedarSystemID(ctx context.Context, obj *models.AccessibilityRequest) (*string, error) {
	return obj.CedarSystemID.Ptr(), nil
}

// DocumentType is the resolver for the documentType field.
func (r *accessibilityRequestDocumentResolver) DocumentType(ctx context.Context, obj *models.AccessibilityRequestDocument) (*model.AccessibilityRequestDocumentType, error) {
	return &model.AccessibilityRequestDocumentType{
		CommonType:           obj.CommonDocumentType,
		OtherTypeDescription: &obj.OtherType,
	}, nil
}

// MimeType is the resolver for the mimeType field.
func (r *accessibilityRequestDocumentResolver) MimeType(ctx context.Context, obj *models.AccessibilityRequestDocument) (string, error) {
	return obj.FileType, nil
}

// UploadedAt is the resolver for the uploadedAt field.
func (r *accessibilityRequestDocumentResolver) UploadedAt(ctx context.Context, obj *models.AccessibilityRequestDocument) (*time.Time, error) {
	return obj.CreatedAt, nil
}

// AuthorName is the resolver for the authorName field.
func (r *accessibilityRequestNoteResolver) AuthorName(ctx context.Context, obj *models.AccessibilityRequestNote) (string, error) {
	user, err := r.service.FetchUserInfo(ctx, obj.EUAUserID)
	if err != nil {
		return "", err
	}
	return user.CommonName, nil
}

// Email is the resolver for the email field.
func (r *augmentedSystemIntakeContactResolver) Email(ctx context.Context, obj *models.AugmentedSystemIntakeContact) (*string, error) {
	return (*string)(&obj.Email), nil
}

// AlternativeASolution is the resolver for the alternativeASolution field.
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

// AlternativeBSolution is the resolver for the alternativeBSolution field.
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

// BusinessNeed is the resolver for the businessNeed field.
func (r *businessCaseResolver) BusinessNeed(ctx context.Context, obj *models.BusinessCase) (*string, error) {
	return obj.BusinessNeed.Ptr(), nil
}

// BusinessOwner is the resolver for the businessOwner field.
func (r *businessCaseResolver) BusinessOwner(ctx context.Context, obj *models.BusinessCase) (*string, error) {
	return obj.BusinessOwner.Ptr(), nil
}

// CmsBenefit is the resolver for the cmsBenefit field.
func (r *businessCaseResolver) CmsBenefit(ctx context.Context, obj *models.BusinessCase) (*string, error) {
	return obj.CMSBenefit.Ptr(), nil
}

// CurrentSolutionSummary is the resolver for the currentSolutionSummary field.
func (r *businessCaseResolver) CurrentSolutionSummary(ctx context.Context, obj *models.BusinessCase) (*string, error) {
	return obj.CurrentSolutionSummary.Ptr(), nil
}

// LifecycleCostLines is the resolver for the lifecycleCostLines field.
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

// PreferredSolution is the resolver for the preferredSolution field.
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

// PriorityAlignment is the resolver for the priorityAlignment field.
func (r *businessCaseResolver) PriorityAlignment(ctx context.Context, obj *models.BusinessCase) (*string, error) {
	return obj.PriorityAlignment.Ptr(), nil
}

// ProjectName is the resolver for the projectName field.
func (r *businessCaseResolver) ProjectName(ctx context.Context, obj *models.BusinessCase) (*string, error) {
	return obj.ProjectName.Ptr(), nil
}

// Requester is the resolver for the requester field.
func (r *businessCaseResolver) Requester(ctx context.Context, obj *models.BusinessCase) (*string, error) {
	return obj.Requester.Ptr(), nil
}

// RequesterPhoneNumber is the resolver for the requesterPhoneNumber field.
func (r *businessCaseResolver) RequesterPhoneNumber(ctx context.Context, obj *models.BusinessCase) (*string, error) {
	return obj.RequesterPhoneNumber.Ptr(), nil
}

// SuccessIndicators is the resolver for the successIndicators field.
func (r *businessCaseResolver) SuccessIndicators(ctx context.Context, obj *models.BusinessCase) (*string, error) {
	return obj.SuccessIndicators.Ptr(), nil
}

// SystemIntake is the resolver for the systemIntake field.
func (r *businessCaseResolver) SystemIntake(ctx context.Context, obj *models.BusinessCase) (*models.SystemIntake, error) {
	return r.store.FetchSystemIntakeByID(ctx, obj.SystemIntakeID)
}

// ActualDispositionDate is the resolver for the actualDispositionDate field.
func (r *cedarAuthorityToOperateResolver) ActualDispositionDate(ctx context.Context, obj *models.CedarAuthorityToOperate) (*time.Time, error) {
	return obj.ActualDispositionDate.Ptr(), nil
}

// ContainsPersonallyIdentifiableInformation is the resolver for the containsPersonallyIdentifiableInformation field.
func (r *cedarAuthorityToOperateResolver) ContainsPersonallyIdentifiableInformation(ctx context.Context, obj *models.CedarAuthorityToOperate) (*bool, error) {
	return obj.ContainsPersonallyIdentifiableInformation.Ptr(), nil
}

// CountOfTotalNonPrivilegedUserPopulation is the resolver for the countOfTotalNonPrivilegedUserPopulation field.
func (r *cedarAuthorityToOperateResolver) CountOfTotalNonPrivilegedUserPopulation(ctx context.Context, obj *models.CedarAuthorityToOperate) (int, error) {
	return int(obj.CountOfTotalNonPrivilegedUserPopulation.ValueOrZero()), nil
}

// CountOfOpenPoams is the resolver for the countOfOpenPoams field.
func (r *cedarAuthorityToOperateResolver) CountOfOpenPoams(ctx context.Context, obj *models.CedarAuthorityToOperate) (int, error) {
	return int(obj.CountOfOpenPoams.ValueOrZero()), nil
}

// CountOfTotalPrivilegedUserPopulation is the resolver for the countOfTotalPrivilegedUserPopulation field.
func (r *cedarAuthorityToOperateResolver) CountOfTotalPrivilegedUserPopulation(ctx context.Context, obj *models.CedarAuthorityToOperate) (int, error) {
	return int(obj.CountOfTotalPrivilegedUserPopulation.ValueOrZero()), nil
}

// DateAuthorizationMemoExpires is the resolver for the dateAuthorizationMemoExpires field.
func (r *cedarAuthorityToOperateResolver) DateAuthorizationMemoExpires(ctx context.Context, obj *models.CedarAuthorityToOperate) (*time.Time, error) {
	return obj.DateAuthorizationMemoExpires.Ptr(), nil
}

// DateAuthorizationMemoSigned is the resolver for the dateAuthorizationMemoSigned field.
func (r *cedarAuthorityToOperateResolver) DateAuthorizationMemoSigned(ctx context.Context, obj *models.CedarAuthorityToOperate) (*time.Time, error) {
	return obj.DateAuthorizationMemoSigned.Ptr(), nil
}

// EAuthenticationLevel is the resolver for the eAuthenticationLevel field.
func (r *cedarAuthorityToOperateResolver) EAuthenticationLevel(ctx context.Context, obj *models.CedarAuthorityToOperate) (*string, error) {
	return obj.EAuthenticationLevel.Ptr(), nil
}

// Fips199OverallImpactRating is the resolver for the fips199OverallImpactRating field.
func (r *cedarAuthorityToOperateResolver) Fips199OverallImpactRating(ctx context.Context, obj *models.CedarAuthorityToOperate) (*int, error) {
	return zeroIntToIntPtr(obj.Fips199OverallImpactRating), nil
}

// FismaSystemAcronym is the resolver for the fismaSystemAcronym field.
func (r *cedarAuthorityToOperateResolver) FismaSystemAcronym(ctx context.Context, obj *models.CedarAuthorityToOperate) (*string, error) {
	return obj.FismaSystemAcronym.Ptr(), nil
}

// FismaSystemName is the resolver for the fismaSystemName field.
func (r *cedarAuthorityToOperateResolver) FismaSystemName(ctx context.Context, obj *models.CedarAuthorityToOperate) (*string, error) {
	return obj.FismaSystemName.Ptr(), nil
}

// IsAccessedByNonOrganizationalUsers is the resolver for the isAccessedByNonOrganizationalUsers field.
func (r *cedarAuthorityToOperateResolver) IsAccessedByNonOrganizationalUsers(ctx context.Context, obj *models.CedarAuthorityToOperate) (*bool, error) {
	return obj.IsAccessedByNonOrganizationalUsers.Ptr(), nil
}

// IsPiiLimitedToUserNameAndPass is the resolver for the isPiiLimitedToUserNameAndPass field.
func (r *cedarAuthorityToOperateResolver) IsPiiLimitedToUserNameAndPass(ctx context.Context, obj *models.CedarAuthorityToOperate) (*bool, error) {
	return obj.IsPiiLimitedToUserNameAndPass.Ptr(), nil
}

// IsProtectedHealthInformation is the resolver for the isProtectedHealthInformation field.
func (r *cedarAuthorityToOperateResolver) IsProtectedHealthInformation(ctx context.Context, obj *models.CedarAuthorityToOperate) (*bool, error) {
	return obj.IsProtectedHealthInformation.Ptr(), nil
}

// LastActScaDate is the resolver for the lastActScaDate field.
func (r *cedarAuthorityToOperateResolver) LastActScaDate(ctx context.Context, obj *models.CedarAuthorityToOperate) (*time.Time, error) {
	return obj.LastActScaDate.Ptr(), nil
}

// LastAssessmentDate is the resolver for the lastAssessmentDate field.
func (r *cedarAuthorityToOperateResolver) LastAssessmentDate(ctx context.Context, obj *models.CedarAuthorityToOperate) (*time.Time, error) {
	return obj.LastAssessmentDate.Ptr(), nil
}

// LastContingencyPlanCompletionDate is the resolver for the lastContingencyPlanCompletionDate field.
func (r *cedarAuthorityToOperateResolver) LastContingencyPlanCompletionDate(ctx context.Context, obj *models.CedarAuthorityToOperate) (*time.Time, error) {
	return obj.LastContingencyPlanCompletionDate.Ptr(), nil
}

// LastPenTestDate is the resolver for the lastPenTestDate field.
func (r *cedarAuthorityToOperateResolver) LastPenTestDate(ctx context.Context, obj *models.CedarAuthorityToOperate) (*time.Time, error) {
	return obj.LastPenTestDate.Ptr(), nil
}

// PiaCompletionDate is the resolver for the piaCompletionDate field.
func (r *cedarAuthorityToOperateResolver) PiaCompletionDate(ctx context.Context, obj *models.CedarAuthorityToOperate) (*time.Time, error) {
	return obj.PiaCompletionDate.Ptr(), nil
}

// PrimaryCyberRiskAdvisor is the resolver for the primaryCyberRiskAdvisor field.
func (r *cedarAuthorityToOperateResolver) PrimaryCyberRiskAdvisor(ctx context.Context, obj *models.CedarAuthorityToOperate) (*string, error) {
	return obj.PrimaryCyberRiskAdvisor.Ptr(), nil
}

// PrivacySubjectMatterExpert is the resolver for the privacySubjectMatterExpert field.
func (r *cedarAuthorityToOperateResolver) PrivacySubjectMatterExpert(ctx context.Context, obj *models.CedarAuthorityToOperate) (*string, error) {
	return obj.PrivacySubjectMatterExpert.Ptr(), nil
}

// RecoveryPointObjective is the resolver for the recoveryPointObjective field.
func (r *cedarAuthorityToOperateResolver) RecoveryPointObjective(ctx context.Context, obj *models.CedarAuthorityToOperate) (*float64, error) {
	return obj.RecoveryPointObjective.Ptr(), nil
}

// RecoveryTimeObjective is the resolver for the recoveryTimeObjective field.
func (r *cedarAuthorityToOperateResolver) RecoveryTimeObjective(ctx context.Context, obj *models.CedarAuthorityToOperate) (*float64, error) {
	return obj.RecoveryTimeObjective.Ptr(), nil
}

// TlcPhase is the resolver for the tlcPhase field.
func (r *cedarAuthorityToOperateResolver) TlcPhase(ctx context.Context, obj *models.CedarAuthorityToOperate) (*string, error) {
	return obj.TLCPhase.Ptr(), nil
}

// XlcPhase is the resolver for the xlcPhase field.
func (r *cedarAuthorityToOperateResolver) XlcPhase(ctx context.Context, obj *models.CedarAuthorityToOperate) (*string, error) {
	return obj.XLCPhase.Ptr(), nil
}

// ID is the resolver for the id field.
func (r *cedarDataCenterResolver) ID(ctx context.Context, obj *models.CedarDataCenter) (*string, error) {
	return obj.ID.Ptr(), nil
}

// Name is the resolver for the name field.
func (r *cedarDataCenterResolver) Name(ctx context.Context, obj *models.CedarDataCenter) (*string, error) {
	return obj.Name.Ptr(), nil
}

// Version is the resolver for the version field.
func (r *cedarDataCenterResolver) Version(ctx context.Context, obj *models.CedarDataCenter) (*string, error) {
	return obj.Version.Ptr(), nil
}

// Description is the resolver for the description field.
func (r *cedarDataCenterResolver) Description(ctx context.Context, obj *models.CedarDataCenter) (*string, error) {
	return obj.Description.Ptr(), nil
}

// State is the resolver for the state field.
func (r *cedarDataCenterResolver) State(ctx context.Context, obj *models.CedarDataCenter) (*string, error) {
	return obj.State.Ptr(), nil
}

// Status is the resolver for the status field.
func (r *cedarDataCenterResolver) Status(ctx context.Context, obj *models.CedarDataCenter) (*string, error) {
	return obj.Status.Ptr(), nil
}

// StartDate is the resolver for the startDate field.
func (r *cedarDataCenterResolver) StartDate(ctx context.Context, obj *models.CedarDataCenter) (*time.Time, error) {
	return obj.StartDate.Ptr(), nil
}

// EndDate is the resolver for the endDate field.
func (r *cedarDataCenterResolver) EndDate(ctx context.Context, obj *models.CedarDataCenter) (*time.Time, error) {
	return obj.EndDate.Ptr(), nil
}

// Address1 is the resolver for the address1 field.
func (r *cedarDataCenterResolver) Address1(ctx context.Context, obj *models.CedarDataCenter) (*string, error) {
	return obj.Address1.Ptr(), nil
}

// Address2 is the resolver for the address2 field.
func (r *cedarDataCenterResolver) Address2(ctx context.Context, obj *models.CedarDataCenter) (*string, error) {
	return obj.Address2.Ptr(), nil
}

// City is the resolver for the city field.
func (r *cedarDataCenterResolver) City(ctx context.Context, obj *models.CedarDataCenter) (*string, error) {
	return obj.City.Ptr(), nil
}

// AddressState is the resolver for the addressState field.
func (r *cedarDataCenterResolver) AddressState(ctx context.Context, obj *models.CedarDataCenter) (*string, error) {
	return obj.AddressState.Ptr(), nil
}

// Zip is the resolver for the zip field.
func (r *cedarDataCenterResolver) Zip(ctx context.Context, obj *models.CedarDataCenter) (*string, error) {
	return obj.Zip.Ptr(), nil
}

// StartDate is the resolver for the startDate field.
func (r *cedarDeploymentResolver) StartDate(ctx context.Context, obj *models.CedarDeployment) (*time.Time, error) {
	return obj.StartDate.Ptr(), nil
}

// EndDate is the resolver for the endDate field.
func (r *cedarDeploymentResolver) EndDate(ctx context.Context, obj *models.CedarDeployment) (*time.Time, error) {
	return obj.EndDate.Ptr(), nil
}

// IsHotSite is the resolver for the isHotSite field.
func (r *cedarDeploymentResolver) IsHotSite(ctx context.Context, obj *models.CedarDeployment) (*string, error) {
	return obj.IsHotSite.Ptr(), nil
}

// Description is the resolver for the description field.
func (r *cedarDeploymentResolver) Description(ctx context.Context, obj *models.CedarDeployment) (*string, error) {
	return obj.Description.Ptr(), nil
}

// ContractorName is the resolver for the contractorName field.
func (r *cedarDeploymentResolver) ContractorName(ctx context.Context, obj *models.CedarDeployment) (*string, error) {
	return obj.ContractorName.Ptr(), nil
}

// SystemVersion is the resolver for the systemVersion field.
func (r *cedarDeploymentResolver) SystemVersion(ctx context.Context, obj *models.CedarDeployment) (*string, error) {
	return obj.SystemVersion.Ptr(), nil
}

// HasProductionData is the resolver for the hasProductionData field.
func (r *cedarDeploymentResolver) HasProductionData(ctx context.Context, obj *models.CedarDeployment) (*string, error) {
	return obj.HasProductionData.Ptr(), nil
}

// DeploymentType is the resolver for the deploymentType field.
func (r *cedarDeploymentResolver) DeploymentType(ctx context.Context, obj *models.CedarDeployment) (*string, error) {
	return obj.DeploymentType.Ptr(), nil
}

// SystemName is the resolver for the systemName field.
func (r *cedarDeploymentResolver) SystemName(ctx context.Context, obj *models.CedarDeployment) (*string, error) {
	return obj.SystemName.Ptr(), nil
}

// DeploymentElementID is the resolver for the deploymentElementID field.
func (r *cedarDeploymentResolver) DeploymentElementID(ctx context.Context, obj *models.CedarDeployment) (*string, error) {
	return obj.DeploymentElementID.Ptr(), nil
}

// State is the resolver for the state field.
func (r *cedarDeploymentResolver) State(ctx context.Context, obj *models.CedarDeployment) (*string, error) {
	return obj.State.Ptr(), nil
}

// Status is the resolver for the status field.
func (r *cedarDeploymentResolver) Status(ctx context.Context, obj *models.CedarDeployment) (*string, error) {
	return obj.Status.Ptr(), nil
}

// WanType is the resolver for the wanType field.
func (r *cedarDeploymentResolver) WanType(ctx context.Context, obj *models.CedarDeployment) (*string, error) {
	return obj.WanType.Ptr(), nil
}

// ExchangeEndDate is the resolver for the exchangeEndDate field.
func (r *cedarExchangeResolver) ExchangeEndDate(ctx context.Context, obj *models.CedarExchange) (*time.Time, error) {
	return obj.ExchangeEndDate.Ptr(), nil
}

// ExchangeRetiredDate is the resolver for the exchangeRetiredDate field.
func (r *cedarExchangeResolver) ExchangeRetiredDate(ctx context.Context, obj *models.CedarExchange) (*time.Time, error) {
	return obj.ExchangeRetiredDate.Ptr(), nil
}

// ExchangeStartDate is the resolver for the exchangeStartDate field.
func (r *cedarExchangeResolver) ExchangeStartDate(ctx context.Context, obj *models.CedarExchange) (*time.Time, error) {
	return obj.ExchangeStartDate.Ptr(), nil
}

// AssigneeUsername is the resolver for the assigneeUsername field.
func (r *cedarRoleResolver) AssigneeUsername(ctx context.Context, obj *models.CedarRole) (*string, error) {
	return obj.AssigneeUsername.Ptr(), nil
}

// AssigneeEmail is the resolver for the assigneeEmail field.
func (r *cedarRoleResolver) AssigneeEmail(ctx context.Context, obj *models.CedarRole) (*string, error) {
	return obj.AssigneeEmail.Ptr(), nil
}

// AssigneeOrgID is the resolver for the assigneeOrgID field.
func (r *cedarRoleResolver) AssigneeOrgID(ctx context.Context, obj *models.CedarRole) (*string, error) {
	return obj.AssigneeOrgID.Ptr(), nil
}

// AssigneeOrgName is the resolver for the assigneeOrgName field.
func (r *cedarRoleResolver) AssigneeOrgName(ctx context.Context, obj *models.CedarRole) (*string, error) {
	return obj.AssigneeOrgName.Ptr(), nil
}

// AssigneeFirstName is the resolver for the assigneeFirstName field.
func (r *cedarRoleResolver) AssigneeFirstName(ctx context.Context, obj *models.CedarRole) (*string, error) {
	return obj.AssigneeFirstName.Ptr(), nil
}

// AssigneeLastName is the resolver for the assigneeLastName field.
func (r *cedarRoleResolver) AssigneeLastName(ctx context.Context, obj *models.CedarRole) (*string, error) {
	return obj.AssigneeLastName.Ptr(), nil
}

// AssigneePhone is the resolver for the assigneePhone field.
func (r *cedarRoleResolver) AssigneePhone(ctx context.Context, obj *models.CedarRole) (*string, error) {
	return obj.AssigneePhone.Ptr(), nil
}

// AssigneeDesc is the resolver for the assigneeDesc field.
func (r *cedarRoleResolver) AssigneeDesc(ctx context.Context, obj *models.CedarRole) (*string, error) {
	return obj.AssigneeDesc.Ptr(), nil
}

// RoleTypeName is the resolver for the roleTypeName field.
func (r *cedarRoleResolver) RoleTypeName(ctx context.Context, obj *models.CedarRole) (*string, error) {
	return obj.RoleTypeName.Ptr(), nil
}

// RoleTypeDesc is the resolver for the roleTypeDesc field.
func (r *cedarRoleResolver) RoleTypeDesc(ctx context.Context, obj *models.CedarRole) (*string, error) {
	return obj.RoleTypeDesc.Ptr(), nil
}

// RoleID is the resolver for the roleID field.
func (r *cedarRoleResolver) RoleID(ctx context.Context, obj *models.CedarRole) (*string, error) {
	return obj.RoleID.Ptr(), nil
}

// ObjectType is the resolver for the objectType field.
func (r *cedarRoleResolver) ObjectType(ctx context.Context, obj *models.CedarRole) (*string, error) {
	return obj.ObjectType.Ptr(), nil
}

// SystemMaintainerInformation is the resolver for the systemMaintainerInformation field.
func (r *cedarSystemDetailsResolver) SystemMaintainerInformation(ctx context.Context, obj *models.CedarSystemDetails) (*model.CedarSystemMaintainerInformation, error) {
	ipEnabledCt := int(obj.SystemMaintainerInformation.IPEnabledAssetCount)
	return &model.CedarSystemMaintainerInformation{
		AgileUsed:                  &obj.SystemMaintainerInformation.AgileUsed,
		BusinessArtifactsOnDemand:  &obj.SystemMaintainerInformation.BusinessArtifactsOnDemand,
		DeploymentFrequency:        &obj.SystemMaintainerInformation.DeploymentFrequency,
		DevCompletionPercent:       &obj.SystemMaintainerInformation.DevCompletionPercent,
		DevWorkDescription:         &obj.SystemMaintainerInformation.DevWorkDescription,
		EcapParticipation:          &obj.SystemMaintainerInformation.EcapParticipation,
		FrontendAccessType:         &obj.SystemMaintainerInformation.FrontendAccessType,
		HardCodedIPAddress:         &obj.SystemMaintainerInformation.HardCodedIPAddress,
		IP6EnabledAssetPercent:     &obj.SystemMaintainerInformation.IP6EnabledAssetPercent,
		IP6TransitionPlan:          &obj.SystemMaintainerInformation.IP6TransitionPlan,
		IPEnabledAssetCount:        &ipEnabledCt,
		MajorRefreshDate:           &obj.SystemMaintainerInformation.MajorRefreshDate,
		NetAccessibility:           &obj.SystemMaintainerInformation.NetAccessibility,
		OmDocumentationOnDemand:    &obj.SystemMaintainerInformation.OmDocumentationOnDemand,
		PlansToRetireReplace:       &obj.SystemMaintainerInformation.PlansToRetireReplace,
		QuarterToRetireReplace:     &obj.SystemMaintainerInformation.QuarterToRetireReplace,
		RecordsManagementBucket:    obj.SystemMaintainerInformation.RecordsManagementBucket,
		SourceCodeOnDemand:         &obj.SystemMaintainerInformation.SourceCodeOnDemand,
		SystemCustomization:        &obj.SystemMaintainerInformation.SystemCustomization,
		SystemDesignOnDemand:       &obj.SystemMaintainerInformation.SystemDesignOnDemand,
		SystemProductionDate:       &obj.SystemMaintainerInformation.SystemProductionDate,
		SystemRequirementsOnDemand: &obj.SystemMaintainerInformation.SystemRequirementsOnDemand,
		TestPlanOnDemand:           &obj.SystemMaintainerInformation.TestPlanOnDemand,
		TestReportsOnDemand:        &obj.SystemMaintainerInformation.TestReportsOnDemand,
		TestScriptsOnDemand:        &obj.SystemMaintainerInformation.TestScriptsOnDemand,
		YearToRetireReplace:        &obj.SystemMaintainerInformation.YearToRetireReplace,
	}, nil
}

// BusinessOwnerInformation is the resolver for the businessOwnerInformation field.
func (r *cedarSystemDetailsResolver) BusinessOwnerInformation(ctx context.Context, obj *models.CedarSystemDetails) (*model.CedarBusinessOwnerInformation, error) {
	return &model.CedarBusinessOwnerInformation{
		BeneficiaryAddressPurpose:      obj.BusinessOwnerInformation.BeneficiaryAddressPurpose,
		BeneficiaryAddressPurposeOther: &obj.BusinessOwnerInformation.BeneficiaryAddressPurposeOther,
		BeneficiaryAddressSource:       obj.BusinessOwnerInformation.BeneficiaryAddressSource,
		BeneficiaryAddressSourceOther:  &obj.BusinessOwnerInformation.BeneficiaryAddressSourceOther,
		CostPerYear:                    &obj.BusinessOwnerInformation.CostPerYear,
		IsCmsOwned:                     &obj.BusinessOwnerInformation.IsCmsOwned,
		NumberOfContractorFte:          &obj.BusinessOwnerInformation.NumberOfContractorFte,
		NumberOfFederalFte:             &obj.BusinessOwnerInformation.NumberOfFederalFte,
		NumberOfSupportedUsersPerMonth: &obj.BusinessOwnerInformation.NumberOfSupportedUsersPerMonth,
		StoresBankingData:              &obj.BusinessOwnerInformation.StoresBankingData,
		StoresBeneficiaryAddress:       &obj.BusinessOwnerInformation.StoresBeneficiaryAddress,
	}, nil
}

// AlternativeID is the resolver for the alternativeId field.
func (r *cedarThreatResolver) AlternativeID(ctx context.Context, obj *models.CedarThreat) (*string, error) {
	return obj.AlternativeID.Ptr(), nil
}

// ControlFamily is the resolver for the controlFamily field.
func (r *cedarThreatResolver) ControlFamily(ctx context.Context, obj *models.CedarThreat) (*string, error) {
	return obj.ControlFamily.Ptr(), nil
}

// DaysOpen is the resolver for the daysOpen field.
func (r *cedarThreatResolver) DaysOpen(ctx context.Context, obj *models.CedarThreat) (*int, error) {
	return zeroIntToIntPtr(obj.DaysOpen), nil
}

// ID is the resolver for the id field.
func (r *cedarThreatResolver) ID(ctx context.Context, obj *models.CedarThreat) (*string, error) {
	return obj.ID.Ptr(), nil
}

// ParentID is the resolver for the parentId field.
func (r *cedarThreatResolver) ParentID(ctx context.Context, obj *models.CedarThreat) (*string, error) {
	return obj.ParentID.Ptr(), nil
}

// Type is the resolver for the type field.
func (r *cedarThreatResolver) Type(ctx context.Context, obj *models.CedarThreat) (*string, error) {
	return obj.Type.Ptr(), nil
}

// WeaknessRiskLevel is the resolver for the weaknessRiskLevel field.
func (r *cedarThreatResolver) WeaknessRiskLevel(ctx context.Context, obj *models.CedarThreat) (*string, error) {
	return obj.WeaknessRiskLevel.Ptr(), nil
}

// AddGRTFeedbackAndKeepBusinessCaseInDraft is the resolver for the addGRTFeedbackAndKeepBusinessCaseInDraft field.
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
		models.SystemIntakeStatusBIZCASECHANGESNEEDED,
		input.ShouldSendEmail,
		input.NotificationRecipients,
	)
	if err != nil {
		return nil, err
	}

	return &model.AddGRTFeedbackPayload{ID: &grtFeedback.ID}, nil
}

// AddGRTFeedbackAndProgressToFinalBusinessCase is the resolver for the addGRTFeedbackAndProgressToFinalBusinessCase field.
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
		models.SystemIntakeStatusBIZCASEFINALNEEDED,
		input.ShouldSendEmail,
		input.NotificationRecipients,
	)
	if err != nil {
		return nil, err
	}

	return &model.AddGRTFeedbackPayload{ID: &grtFeedback.ID}, nil
}

// AddGRTFeedbackAndRequestBusinessCase is the resolver for the addGRTFeedbackAndRequestBusinessCase field.
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
		models.SystemIntakeStatusNEEDBIZCASE,
		input.ShouldSendEmail,
		input.NotificationRecipients,
	)
	if err != nil {
		return nil, err
	}

	return &model.AddGRTFeedbackPayload{ID: &grtFeedback.ID}, nil
}

// CreateAccessibilityRequest is the resolver for the createAccessibilityRequest field.
func (r *mutationResolver) CreateAccessibilityRequest(ctx context.Context, input model.CreateAccessibilityRequestInput) (*model.CreateAccessibilityRequestPayload, error) {
	requesterEUAID := appcontext.Principal(ctx).ID()
	requesterInfo, err := r.service.FetchUserInfo(ctx, requesterEUAID)
	if err != nil {
		return nil, err
	}

	if input.IntakeID == nil && (input.CedarSystemID == nil || len(*input.CedarSystemID) == 0) {
		return nil, errors.New("Either a system intake ID or a CEDAR system ID is required to create a 508 request")
	}

	newRequest := &models.AccessibilityRequest{
		EUAUserID: requesterEUAID,
	}

	var systemName string
	if input.IntakeID != nil {
		intake, intakeErr := r.store.FetchSystemIntakeByID(ctx, *input.IntakeID)
		if intakeErr != nil {
			return nil, intakeErr
		}
		newRequest.IntakeID = &intake.ID
		systemName = intake.ProjectName.String
	}

	cedarSystemID := null.StringFromPtr(input.CedarSystemID)
	cedarSystemIDStr := cedarSystemID.ValueOrZero()
	if input.CedarSystemID != nil && len(*input.CedarSystemID) > 0 {
		cedarSystem, cedarSystemErr := r.cedarCoreClient.GetSystem(ctx, cedarSystemIDStr)
		if cedarSystemErr != nil {
			return nil, cedarSystemErr
		}
		newRequest.CedarSystemID = null.StringFromPtr(input.CedarSystemID)
		systemName = cedarSystem.Name
	}

	newRequest.Name = systemName

	request, err := r.store.CreateAccessibilityRequestAndInitialStatusRecord(ctx, newRequest)
	if err != nil {
		return nil, err
	}

	err = r.emailClient.SendNewAccessibilityRequestEmail(
		ctx,
		requesterInfo.CommonName,
		request.Name,
		systemName,
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

// DeleteAccessibilityRequest is the resolver for the deleteAccessibilityRequest field.
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

// CreateAccessibilityRequestDocument is the resolver for the createAccessibilityRequestDocument field.
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

// CreateAccessibilityRequestNote is the resolver for the createAccessibilityRequestNote field.
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

// DeleteAccessibilityRequestDocument is the resolver for the deleteAccessibilityRequestDocument field.
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

// UpdateAccessibilityRequestStatus is the resolver for the updateAccessibilityRequestStatus field.
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

// UpdateAccessibilityRequestCedarSystem is the resolver for the updateAccessibilityRequestCedarSystem field.
func (r *mutationResolver) UpdateAccessibilityRequestCedarSystem(ctx context.Context, input *model.UpdateAccessibilityRequestCedarSystemInput) (*model.UpdateAccessibilityRequestCedarSystemPayload, error) {
	_, err := r.cedarCoreClient.GetSystem(ctx, input.CedarSystemID)
	if err != nil {
		return nil, err
	}

	updatedRequest, err := r.store.UpdateAccessibilityRequestCedarSystem(ctx, input.ID, null.StringFrom(input.CedarSystemID))
	return &model.UpdateAccessibilityRequestCedarSystemPayload{
		ID:                   updatedRequest.ID,
		AccessibilityRequest: updatedRequest,
	}, err
}

// CreateSystemIntakeActionBusinessCaseNeeded is the resolver for the createSystemIntakeActionBusinessCaseNeeded field.
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
		input.ShouldSendEmail,
		input.NotificationRecipients,
	)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

// CreateSystemIntakeActionBusinessCaseNeedsChanges is the resolver for the createSystemIntakeActionBusinessCaseNeedsChanges field.
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
		input.ShouldSendEmail,
		input.NotificationRecipients,
	)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

// CreateSystemIntakeActionGuideReceievedClose is the resolver for the createSystemIntakeActionGuideReceievedClose field.
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
		input.ShouldSendEmail,
		input.NotificationRecipients,
	)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

// CreateSystemIntakeActionNoGovernanceNeeded is the resolver for the createSystemIntakeActionNoGovernanceNeeded field.
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
		input.ShouldSendEmail,
		input.NotificationRecipients,
	)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

// CreateSystemIntakeActionNotItRequest is the resolver for the createSystemIntakeActionNotItRequest field.
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
		input.ShouldSendEmail,
		input.NotificationRecipients,
	)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

// CreateSystemIntakeActionNotRespondingClose is the resolver for the createSystemIntakeActionNotRespondingClose field.
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
		input.ShouldSendEmail,
		input.NotificationRecipients,
	)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

// CreateSystemIntakeActionReadyForGrt is the resolver for the createSystemIntakeActionReadyForGRT field.
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
		input.ShouldSendEmail,
		input.NotificationRecipients,
	)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

// CreateSystemIntakeActionSendEmail is the resolver for the createSystemIntakeActionSendEmail field.
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
		input.ShouldSendEmail,
		input.NotificationRecipients,
	)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

// CreateSystemIntakeActionExtendLifecycleID is the resolver for the createSystemIntakeActionExtendLifecycleId field.
func (r *mutationResolver) CreateSystemIntakeActionExtendLifecycleID(ctx context.Context, input model.CreateSystemIntakeActionExtendLifecycleIDInput) (*model.CreateSystemIntakeActionExtendLifecycleIDPayload, error) {
	if input.ExpirationDate == nil {
		return &model.CreateSystemIntakeActionExtendLifecycleIDPayload{
			UserErrors: []*model.UserError{{Message: "Must provide a valid future date", Path: []string{"expirationDate"}}},
		}, nil
	}

	if input.Scope == "" {
		return &model.CreateSystemIntakeActionExtendLifecycleIDPayload{
			UserErrors: []*model.UserError{{Message: "Must provide a non-empty scope", Path: []string{"scope"}}},
		}, nil
	}

	intake, err := r.service.CreateActionExtendLifecycleID(
		ctx,
		&models.Action{
			IntakeID:   &input.ID,
			ActionType: models.ActionTypeEXTENDLCID,
		},
		input.ID,
		input.ExpirationDate,
		input.NextSteps,
		input.Scope,
		input.CostBaseline,
		input.ShouldSendEmail,
		input.NotificationRecipients,
	)

	if err != nil {
		return nil, err
	}

	return &model.CreateSystemIntakeActionExtendLifecycleIDPayload{
		SystemIntake: intake,
	}, nil
}

// CreateSystemIntakeNote is the resolver for the createSystemIntakeNote field.
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

// CreateSystemIntake is the resolver for the createSystemIntake field.
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

// CreateTestDate is the resolver for the createTestDate field.
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

// UpdateTestDate is the resolver for the updateTestDate field.
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

// DeleteTestDate is the resolver for the deleteTestDate field.
func (r *mutationResolver) DeleteTestDate(ctx context.Context, input model.DeleteTestDateInput) (*model.DeleteTestDatePayload, error) {
	testDate, err := r.store.DeleteTestDate(ctx, &models.TestDate{
		ID: input.ID,
	})
	if err != nil {
		return nil, err
	}
	return &model.DeleteTestDatePayload{TestDate: testDate, UserErrors: nil}, nil
}

// GeneratePresignedUploadURL is the resolver for the generatePresignedUploadURL field.
func (r *mutationResolver) GeneratePresignedUploadURL(ctx context.Context, input model.GeneratePresignedUploadURLInput) (*model.GeneratePresignedUploadURLPayload, error) {
	url, err := r.s3Client.NewPutPresignedURL(input.MimeType)
	if err != nil {
		return nil, err
	}
	return &model.GeneratePresignedUploadURLPayload{
		URL: &url.URL,
	}, nil
}

// IssueLifecycleID is the resolver for the issueLifecycleId field.
func (r *mutationResolver) IssueLifecycleID(ctx context.Context, input model.IssueLifecycleIDInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.service.IssueLifecycleID(
		ctx,
		&models.SystemIntake{
			ID:                    input.IntakeID,
			LifecycleExpiresAt:    &input.ExpiresAt,
			LifecycleScope:        null.StringFrom(input.Scope),
			DecisionNextSteps:     null.StringFrom(*input.NextSteps),
			LifecycleID:           null.StringFrom(*input.Lcid),
			LifecycleCostBaseline: null.StringFromPtr(input.CostBaseline),
		},
		&models.Action{
			IntakeID: &input.IntakeID,
			Feedback: null.StringFrom(input.Feedback),
		},
		input.ShouldSendEmail,
		input.NotificationRecipients,
	)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

// MarkSystemIntakeReadyForGrb is the resolver for the markSystemIntakeReadyForGRB field.
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
		models.SystemIntakeStatusREADYFORGRB,
		input.ShouldSendEmail,
		input.NotificationRecipients,
	)
	if err != nil {
		return nil, err
	}

	return &model.AddGRTFeedbackPayload{ID: &grtFeedback.ID}, nil
}

// RejectIntake is the resolver for the rejectIntake field.
func (r *mutationResolver) RejectIntake(ctx context.Context, input model.RejectIntakeInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.service.RejectIntake(
		ctx,
		&models.SystemIntake{
			ID:                input.IntakeID,
			DecisionNextSteps: null.StringFromPtr(input.NextSteps),
			RejectionReason:   null.StringFrom(input.Reason),
		},
		&models.Action{
			IntakeID: &input.IntakeID,
			Feedback: null.StringFrom(input.Feedback),
		},
		input.ShouldSendEmail,
		input.NotificationRecipients,
	)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

// SubmitIntake is the resolver for the submitIntake field.
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

// UpdateSystemIntakeAdminLead is the resolver for the updateSystemIntakeAdminLead field.
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

// UpdateSystemIntakeReviewDates is the resolver for the updateSystemIntakeReviewDates field.
func (r *mutationResolver) UpdateSystemIntakeReviewDates(ctx context.Context, input model.UpdateSystemIntakeReviewDatesInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.store.UpdateReviewDates(ctx, input.ID, input.GrbDate, input.GrtDate)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, err
}

// UpdateSystemIntakeContactDetails is the resolver for the updateSystemIntakeContactDetails field.
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

// UpdateSystemIntakeRequestDetails is the resolver for the updateSystemIntakeRequestDetails field.
func (r *mutationResolver) UpdateSystemIntakeRequestDetails(ctx context.Context, input model.UpdateSystemIntakeRequestDetailsInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.store.FetchSystemIntakeByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}
	intake.ProcessStatus = null.StringFromPtr(input.CurrentStage)
	intake.ProjectName = null.StringFromPtr(input.RequestName)
	intake.BusinessNeed = null.StringFromPtr(input.BusinessNeed)
	intake.Solution = null.StringFromPtr(input.BusinessSolution)
	intake.EASupportRequest = null.BoolFromPtr(input.NeedsEaSupport)

	cedarSystemID := null.StringFromPtr(input.CedarSystemID)
	cedarSystemIDStr := cedarSystemID.ValueOrZero()
	if input.CedarSystemID != nil && len(*input.CedarSystemID) > 0 {
		_, err = r.cedarCoreClient.GetSystem(ctx, cedarSystemIDStr)
		if err != nil {
			return nil, err
		}
		intake.CedarSystemID = null.StringFromPtr(input.CedarSystemID)
	}

	savedIntake, err := r.store.UpdateSystemIntake(ctx, intake)
	return &model.UpdateSystemIntakePayload{
		SystemIntake: savedIntake,
	}, err
}

// UpdateSystemIntakeContractDetails is the resolver for the updateSystemIntakeContractDetails field.
func (r *mutationResolver) UpdateSystemIntakeContractDetails(ctx context.Context, input model.UpdateSystemIntakeContractDetailsInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.store.FetchSystemIntakeByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}

	if input.FundingSources != nil && input.FundingSources.FundingSources != nil {
		intake.ExistingFunding = null.BoolFromPtr(input.FundingSources.ExistingFunding)
		if intake.ExistingFunding.ValueOrZero() {
			fundingSources := make([]*models.SystemIntakeFundingSource, 0, len(input.FundingSources.FundingSources))
			for _, fundingSourceInput := range input.FundingSources.FundingSources {
				fundingSources = append(fundingSources, &models.SystemIntakeFundingSource{
					SystemIntakeID: intake.ID,
					Source:         null.StringFromPtr(fundingSourceInput.Source),
					FundingNumber:  null.StringFromPtr(fundingSourceInput.FundingNumber),
				})
			}

			_, err = r.store.UpdateSystemIntakeFundingSources(ctx, input.ID, fundingSources)

			if err != nil {
				return nil, err
			}
		} else {
			// Delete existing funding source records
			_, err = r.store.UpdateSystemIntakeFundingSources(ctx, input.ID, nil)

			if err != nil {
				return nil, err
			}
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
		intake.ContractNumber = null.StringFromPtr(input.Contract.Number)
		intake.ContractVehicle = null.StringFromPtr(nil) // blank this out in favor of the newer ContractNumber field (see EASI-1977)

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
				intake.ContractNumber = null.StringFromPtr(nil)
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

// CreateCedarSystemBookmark is the resolver for the createCedarSystemBookmark field.
func (r *mutationResolver) CreateCedarSystemBookmark(ctx context.Context, input model.CreateCedarSystemBookmarkInput) (*model.CreateCedarSystemBookmarkPayload, error) {
	bookmark := models.CedarSystemBookmark{
		EUAUserID:     appcontext.Principal(ctx).ID(),
		CedarSystemID: input.CedarSystemID,
	}
	createdBookmark, err := r.store.CreateCedarSystemBookmark(ctx, &bookmark)
	if err != nil {
		return nil, err
	}
	return &model.CreateCedarSystemBookmarkPayload{
		CedarSystemBookmark: createdBookmark,
	}, nil
}

// DeleteCedarSystemBookmark is the resolver for the deleteCedarSystemBookmark field.
func (r *mutationResolver) DeleteCedarSystemBookmark(ctx context.Context, input model.CreateCedarSystemBookmarkInput) (*model.DeleteCedarSystemBookmarkPayload, error) {
	_, err := r.store.DeleteCedarSystemBookmark(ctx, &models.CedarSystemBookmark{
		CedarSystemID: input.CedarSystemID,
	})
	if err != nil {
		return nil, err
	}
	return &model.DeleteCedarSystemBookmarkPayload{CedarSystemID: input.CedarSystemID}, nil
}

// CreateSystemIntakeContact is the resolver for the createSystemIntakeContact field.
func (r *mutationResolver) CreateSystemIntakeContact(ctx context.Context, input model.CreateSystemIntakeContactInput) (*model.CreateSystemIntakeContactPayload, error) {
	contact := &models.SystemIntakeContact{
		SystemIntakeID: input.SystemIntakeID,
		EUAUserID:      input.EuaUserID,
		Component:      input.Component,
		Role:           input.Role,
	}
	createdContact, err := r.store.CreateSystemIntakeContact(ctx, contact)
	if err != nil {
		return nil, err
	}
	return &model.CreateSystemIntakeContactPayload{
		SystemIntakeContact: createdContact,
	}, nil
}

// UpdateSystemIntakeContact is the resolver for the updateSystemIntakeContact field.
func (r *mutationResolver) UpdateSystemIntakeContact(ctx context.Context, input model.UpdateSystemIntakeContactInput) (*model.CreateSystemIntakeContactPayload, error) {
	contact := &models.SystemIntakeContact{
		ID:             input.ID,
		SystemIntakeID: input.SystemIntakeID,
		EUAUserID:      input.EuaUserID,
		Component:      input.Component,
		Role:           input.Role,
	}

	updatedContact, err := r.store.UpdateSystemIntakeContact(ctx, contact)
	if err != nil {
		return nil, err
	}

	return &model.CreateSystemIntakeContactPayload{
		SystemIntakeContact: updatedContact,
	}, nil
}

// DeleteSystemIntakeContact is the resolver for the deleteSystemIntakeContact field.
func (r *mutationResolver) DeleteSystemIntakeContact(ctx context.Context, input model.DeleteSystemIntakeContactInput) (*model.DeleteSystemIntakeContactPayload, error) {
	contact := &models.SystemIntakeContact{
		ID: input.ID,
	}
	_, err := r.store.DeleteSystemIntakeContact(ctx, contact)
	if err != nil {
		return nil, err
	}
	return &model.DeleteSystemIntakeContactPayload{
		SystemIntakeContact: contact,
	}, nil
}

// UpdateSystemIntakeLinkedCedarSystem is the resolver for the updateSystemIntakeLinkedCedarSystem field.
func (r *mutationResolver) UpdateSystemIntakeLinkedCedarSystem(ctx context.Context, input model.UpdateSystemIntakeLinkedCedarSystemInput) (*model.UpdateSystemIntakePayload, error) {
	// If the linked system is not nil, make sure it's a valid CEDAR system, otherwise return an error
	if input.CedarSystemID != nil && len(*input.CedarSystemID) > 0 {
		_, err := r.cedarCoreClient.GetSystem(ctx, *input.CedarSystemID)

		if err != nil {
			return nil, err
		}
	}

	intake, err := r.store.UpdateSystemIntakeLinkedCedarSystem(ctx, input.ID, null.StringFromPtr(input.CedarSystemID))

	if err != nil {
		return nil, err
	}

	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, nil
}

// UpdateSystemIntakeLinkedContract is the resolver for the updateSystemIntakeLinkedContract field.
func (r *mutationResolver) UpdateSystemIntakeLinkedContract(ctx context.Context, input model.UpdateSystemIntakeLinkedContractInput) (*model.UpdateSystemIntakePayload, error) {
	intake, err := r.store.UpdateSystemIntakeLinkedContract(ctx, input.ID, null.StringFromPtr(input.ContractNumber))

	if err != nil {
		return nil, err
	}

	return &model.UpdateSystemIntakePayload{
		SystemIntake: intake,
	}, nil
}

// SendFeedbackEmail is the resolver for the sendFeedbackEmail field.
func (r *mutationResolver) SendFeedbackEmail(ctx context.Context, input model.SendFeedbackEmailInput) (*string, error) {
	var reporterName, reporterEmail string

	if !input.IsAnonymous {
		euaUserID := appcontext.Principal(ctx).ID()
		userInfo, err := r.service.FetchUserInfo(ctx, euaUserID)
		if err != nil {
			return nil, err
		}
		reporterName = userInfo.CommonName
		reporterEmail = userInfo.Email.String()
	}

	err := r.emailClient.SendFeedbackEmail(ctx, email.SendFeedbackEmailInput{
		IsAnonymous:            input.IsAnonymous,
		ReporterName:           reporterName,
		ReporterEmail:          reporterEmail,
		CanBeContacted:         input.CanBeContacted,
		EasiServicesUsed:       input.EasiServicesUsed,
		CmsRole:                input.CmsRole,
		SystemEasyToUse:        input.SystemEasyToUse,
		DidntNeedHelpAnswering: input.DidntNeedHelpAnswering,
		QuestionsWereRelevant:  input.QuestionsWereRelevant,
		HadAccessToInformation: input.HadAccessToInformation,
		HowSatisfied:           input.HowSatisfied,
		HowCanWeImprove:        input.HowCanWeImprove,
	})

	if err != nil {
		return nil, err
	}

	msg := "Feedback sent successfully"
	return &msg, nil
}

// SendCantFindSomethingEmail is the resolver for the sendCantFindSomethingEmail field.
func (r *mutationResolver) SendCantFindSomethingEmail(ctx context.Context, input model.SendCantFindSomethingEmailInput) (*string, error) {
	euaUserID := appcontext.Principal(ctx).ID()
	userInfo, err := r.service.FetchUserInfo(ctx, euaUserID)
	if err != nil {
		return nil, err
	}

	err = r.emailClient.SendCantFindSomethingEmail(ctx, email.SendCantFindSomethingEmailInput{
		Name:  userInfo.CommonName,
		Email: userInfo.Email.String(),
		Body:  input.Body,
	})

	if err != nil {
		return nil, err
	}

	msg := "Feedback sent successfully"
	return &msg, nil
}

// SendReportAProblemEmail is the resolver for the sendReportAProblemEmail field.
func (r *mutationResolver) SendReportAProblemEmail(ctx context.Context, input model.SendReportAProblemEmailInput) (*string, error) {
	var reporterName, reporterEmail string

	if !input.IsAnonymous {
		euaUserID := appcontext.Principal(ctx).ID()
		userInfo, err := r.service.FetchUserInfo(ctx, euaUserID)
		if err != nil {
			return nil, err
		}
		reporterName = userInfo.CommonName
		reporterEmail = userInfo.Email.String()
	}

	err := r.emailClient.SendReportAProblemEmail(ctx, email.SendReportAProblemEmailInput{
		IsAnonymous:            input.IsAnonymous,
		ReporterName:           reporterName,
		ReporterEmail:          reporterEmail,
		CanBeContacted:         input.CanBeContacted,
		EasiService:            input.EasiService,
		WhatWereYouDoing:       input.WhatWereYouDoing,
		WhatWentWrong:          input.WhatWentWrong,
		HowSevereWasTheProblem: input.HowSevereWasTheProblem,
	})

	if err != nil {
		return nil, err
	}

	msg := "Feedback sent successfully"
	return &msg, nil
}

// CreateTRBRequest is the resolver for the createTRBRequest field.
func (r *mutationResolver) CreateTRBRequest(ctx context.Context, requestType models.TRBRequestType) (*models.TRBRequest, error) {
	return resolvers.TRBRequestCreate(ctx, requestType, r.store)
}

// UpdateTRBRequest is the resolver for the updateTRBRequest field.
func (r *mutationResolver) UpdateTRBRequest(ctx context.Context, id uuid.UUID, changes map[string]interface{}) (*models.TRBRequest, error) {
	return resolvers.TRBRequestUpdate(ctx, id, changes, r.store)
}

// AccessibilityRequest is the resolver for the accessibilityRequest field.
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

// AccessibilityRequests is the resolver for the accessibilityRequests field.
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

// Requests is the resolver for the requests field.
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

// SystemIntake is the resolver for the systemIntake field.
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

// Systems is the resolver for the systems field.
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

// CurrentUser is the resolver for the currentUser field.
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

// CedarAuthorityToOperate is the resolver for the cedarAuthorityToOperate field.
func (r *queryResolver) CedarAuthorityToOperate(ctx context.Context, cedarSystemID string) ([]*models.CedarAuthorityToOperate, error) {
	cedarATO, err := r.cedarCoreClient.GetAuthorityToOperate(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}

	return cedarATO, nil
}

// CedarPersonsByCommonName is the resolver for the cedarPersonsByCommonName field.
func (r *queryResolver) CedarPersonsByCommonName(ctx context.Context, commonName string) ([]*models.UserInfo, error) {
	response, err := r.service.SearchCommonNameContains(ctx, commonName)
	if err != nil {
		return nil, err
	}

	return response, nil
}

// CedarSystem is the resolver for the cedarSystem field.
func (r *queryResolver) CedarSystem(ctx context.Context, cedarSystemID string) (*models.CedarSystem, error) {
	cedarSystem, err := r.cedarCoreClient.GetSystem(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}
	return cedarSystem, nil
}

// CedarSystems is the resolver for the cedarSystems field.
func (r *queryResolver) CedarSystems(ctx context.Context) ([]*models.CedarSystem, error) {
	cedarSystems, err := r.cedarCoreClient.GetSystemSummary(ctx, true)
	if err != nil {
		return nil, err
	}
	return cedarSystems, nil
}

// CedarSystemBookmarks is the resolver for the cedarSystemBookmarks field.
func (r *queryResolver) CedarSystemBookmarks(ctx context.Context) ([]*models.CedarSystemBookmark, error) {
	cedarSystemBookmarks, err := r.store.FetchCedarSystemBookmarks(ctx)
	if err != nil {
		return nil, err
	}
	return cedarSystemBookmarks, nil
}

// CedarThreat is the resolver for the cedarThreat field.
func (r *queryResolver) CedarThreat(ctx context.Context, cedarSystemID string) ([]*models.CedarThreat, error) {
	cedarThreat, err := r.cedarCoreClient.GetThreat(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}
	return cedarThreat, nil
}

// Deployments is the resolver for the deployments field.
func (r *queryResolver) Deployments(ctx context.Context, cedarSystemID string, deploymentType *string, state *string, status *string) ([]*models.CedarDeployment, error) {
	var optionalParams *cedarcore.GetDeploymentsOptionalParams
	if deploymentType != nil || state != nil || status != nil {
		optionalParams = &cedarcore.GetDeploymentsOptionalParams{}

		if deploymentType != nil {
			optionalParams.DeploymentType = null.StringFromPtr(deploymentType)
		}

		if state != nil {
			optionalParams.State = null.StringFromPtr(state)
		}

		if status != nil {
			optionalParams.Status = null.StringFromPtr(status)
		}
	}

	cedarDeployments, err := r.cedarCoreClient.GetDeployments(ctx, cedarSystemID, optionalParams)
	if err != nil {
		return nil, err
	}

	return cedarDeployments, nil
}

// Roles is the resolver for the roles field.
func (r *queryResolver) Roles(ctx context.Context, cedarSystemID string, roleTypeID *string) ([]*models.CedarRole, error) {
	cedarRoles, err := r.cedarCoreClient.GetRolesBySystem(ctx, cedarSystemID, null.StringFromPtr(roleTypeID))
	if err != nil {
		return nil, err
	}

	return cedarRoles, nil
}

// Exchanges is the resolver for the exchanges field.
func (r *queryResolver) Exchanges(ctx context.Context, cedarSystemID string) ([]*models.CedarExchange, error) {
	exchanges, err := r.cedarCoreClient.GetExchangesBySystem(ctx, cedarSystemID)

	if err != nil {
		return nil, err
	}

	return exchanges, nil
}

// Urls is the resolver for the urls field.
func (r *queryResolver) Urls(ctx context.Context, cedarSystemID string) ([]*models.CedarURL, error) {
	cedarURLs, err := r.cedarCoreClient.GetURLsForSystem(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}
	return cedarURLs, nil
}

// CedarSystemDetails is the resolver for the cedarSystemDetails field.
func (r *queryResolver) CedarSystemDetails(ctx context.Context, cedarSystemID string) (*models.CedarSystemDetails, error) {
	g := new(errgroup.Group)

	var sysDetail *models.CedarSystemDetails
	var errS error
	g.Go(func() error {
		sysDetail, errS = r.cedarCoreClient.GetSystemDetail(ctx, cedarSystemID)
		return errS
	})

	var cedarRoles []*models.CedarRole
	var errR error
	g.Go(func() error {
		cedarRoles, errS = r.cedarCoreClient.GetRolesBySystem(ctx, cedarSystemID, null.String{})
		return errR
	})

	var cedarDeployments []*models.CedarDeployment
	var errD error
	g.Go(func() error {
		cedarDeployments, errD = r.cedarCoreClient.GetDeployments(ctx, cedarSystemID, nil)
		return errD
	})

	var cedarThreats []*models.CedarThreat
	var errT error
	g.Go(func() error {
		cedarThreats, errT = r.cedarCoreClient.GetThreat(ctx, cedarSystemID)
		return errT
	})

	var cedarURLs []*models.CedarURL
	var errU error
	g.Go(func() error {
		cedarURLs, errU = r.cedarCoreClient.GetURLsForSystem(ctx, cedarSystemID)
		return errU
	})

	if err := g.Wait(); err != nil {
		return nil, err
	}

	dCedarSys := models.CedarSystemDetails{
		CedarSystem:                 sysDetail.CedarSystem,
		BusinessOwnerInformation:    sysDetail.BusinessOwnerInformation,
		SystemMaintainerInformation: sysDetail.SystemMaintainerInformation,
		Roles:                       cedarRoles,
		Deployments:                 cedarDeployments,
		Threats:                     cedarThreats,
		URLs:                        cedarURLs,
	}

	return &dCedarSys, nil
}

// SystemIntakeContacts is the resolver for the systemIntakeContacts field.
func (r *queryResolver) SystemIntakeContacts(ctx context.Context, id uuid.UUID) (*model.SystemIntakeContactsPayload, error) {
	contacts, err := r.store.FetchSystemIntakeContactsBySystemIntakeID(ctx, id)
	if err != nil {
		return nil, err
	}

	if len(contacts) == 0 {
		return &model.SystemIntakeContactsPayload{}, nil
	}

	euaIDs := make([]string, len(contacts))
	for i, contact := range contacts {
		euaIDs[i] = contact.EUAUserID
	}

	userInfos, err := r.service.FetchUserInfos(ctx, euaIDs)
	if err != nil {
		return nil, err
	}

	userInfoMap := make(map[string]*models.UserInfo)
	for _, userInfo := range userInfos {
		if userInfo != nil {
			userInfoMap[userInfo.EuaUserID] = userInfo
		}
	}

	augmentedContacts := make([]*models.AugmentedSystemIntakeContact, 0, len(contacts))
	invalidEUAIDs := make([]string, 0, len(contacts))
	for _, contact := range contacts {
		if userInfo, found := userInfoMap[contact.EUAUserID]; found {
			augmentedContacts = append(augmentedContacts, &models.AugmentedSystemIntakeContact{
				SystemIntakeContact: *contact,
				CommonName:          userInfo.CommonName,
				Email:               userInfo.Email,
			})
		} else {
			invalidEUAIDs = append(invalidEUAIDs, contact.EUAUserID)
		}
	}

	return &model.SystemIntakeContactsPayload{
		SystemIntakeContacts: augmentedContacts,
		InvalidEUAIDs:        invalidEUAIDs,
	}, nil
}

// RelatedSystemIntakes is the resolver for the relatedSystemIntakes field.
func (r *queryResolver) RelatedSystemIntakes(ctx context.Context, id uuid.UUID) ([]*models.SystemIntake, error) {
	intakes, err := r.store.FetchRelatedSystemIntakes(ctx, id)

	if err != nil {
		return nil, err
	}
	return intakes, nil
}

// TrbRequest is the resolver for the trbRequest field.
func (r *queryResolver) TrbRequest(ctx context.Context, id uuid.UUID) (*models.TRBRequest, error) {
	return resolvers.TRBRequestGetByID(ctx, id, r.store)
}

// TrbRequestCollection is the resolver for the trbRequestCollection field.
func (r *queryResolver) TrbRequestCollection(ctx context.Context, archived bool) ([]*models.TRBRequest, error) {
	return resolvers.TRBRequestCollectionGet(ctx, archived, r.store)
}

// Actions is the resolver for the actions field.
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

		if action.LCIDExpirationChangeNewDate != nil && action.LCIDExpirationChangePreviousDate != nil {
			graphAction.LcidExpirationChange = &model.SystemIntakeLCIDExpirationChange{
				NewDate:              *action.LCIDExpirationChangeNewDate,
				PreviousDate:         *action.LCIDExpirationChangePreviousDate,
				NewScope:             action.LCIDExpirationChangeNewScope.Ptr(),
				PreviousScope:        action.LCIDExpirationChangePreviousScope.Ptr(),
				NewNextSteps:         action.LCIDExpirationChangeNewNextSteps.Ptr(),
				PreviousNextSteps:    action.LCIDExpirationChangePreviousNextSteps.Ptr(),
				NewCostBaseline:      action.LCIDExpirationChangeNewCostBaseline.Ptr(),
				PreviousCostBaseline: action.LCIDExpirationChangePreviousCostBaseline.Ptr(),
			}
		}
		results = append(results, &graphAction)
	}
	return results, nil
}

// AdminLead is the resolver for the adminLead field.
func (r *systemIntakeResolver) AdminLead(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.AdminLead.Ptr(), nil
}

// BusinessCase is the resolver for the businessCase field.
func (r *systemIntakeResolver) BusinessCase(ctx context.Context, obj *models.SystemIntake) (*models.BusinessCase, error) {
	if obj.BusinessCaseID == nil {
		return nil, nil
	}
	return r.store.FetchBusinessCaseByID(ctx, *obj.BusinessCaseID)
}

// BusinessNeed is the resolver for the businessNeed field.
func (r *systemIntakeResolver) BusinessNeed(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.BusinessNeed.Ptr(), nil
}

// BusinessOwner is the resolver for the businessOwner field.
func (r *systemIntakeResolver) BusinessOwner(ctx context.Context, obj *models.SystemIntake) (*model.SystemIntakeBusinessOwner, error) {
	return &model.SystemIntakeBusinessOwner{
		Component: obj.BusinessOwnerComponent.Ptr(),
		Name:      obj.BusinessOwner.Ptr(),
	}, nil
}

// BusinessSolution is the resolver for the businessSolution field.
func (r *systemIntakeResolver) BusinessSolution(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.Solution.Ptr(), nil
}

// Contract is the resolver for the contract field.
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
		Number:      obj.ContractNumber.Ptr(),
	}, nil
}

// Costs is the resolver for the costs field.
func (r *systemIntakeResolver) Costs(ctx context.Context, obj *models.SystemIntake) (*model.SystemIntakeCosts, error) {
	return &model.SystemIntakeCosts{
		ExpectedIncreaseAmount: obj.CostIncreaseAmount.Ptr(),
		IsExpectingIncrease:    obj.CostIncrease.Ptr(),
	}, nil
}

// CurrentStage is the resolver for the currentStage field.
func (r *systemIntakeResolver) CurrentStage(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ProcessStatus.Ptr(), nil
}

// DecisionNextSteps is the resolver for the decisionNextSteps field.
func (r *systemIntakeResolver) DecisionNextSteps(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.DecisionNextSteps.Ptr(), nil
}

// EaCollaborator is the resolver for the eaCollaborator field.
func (r *systemIntakeResolver) EaCollaborator(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.EACollaborator.Ptr(), nil
}

// EaCollaboratorName is the resolver for the eaCollaboratorName field.
func (r *systemIntakeResolver) EaCollaboratorName(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.EACollaboratorName.Ptr(), nil
}

// EuaUserID is the resolver for the euaUserId field.
func (r *systemIntakeResolver) EuaUserID(ctx context.Context, obj *models.SystemIntake) (string, error) {
	return obj.EUAUserID.String, nil
}

// ExistingFunding is the resolver for the existingFunding field.
func (r *systemIntakeResolver) ExistingFunding(ctx context.Context, obj *models.SystemIntake) (*bool, error) {
	return obj.ExistingFunding.Ptr(), nil
}

// GovernanceTeams is the resolver for the governanceTeams field.
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

// GrtFeedbacks is the resolver for the grtFeedbacks field.
func (r *systemIntakeResolver) GrtFeedbacks(ctx context.Context, obj *models.SystemIntake) ([]*models.GRTFeedback, error) {
	return r.store.FetchGRTFeedbacksByIntakeID(ctx, obj.ID)
}

// Isso is the resolver for the isso field.
func (r *systemIntakeResolver) Isso(ctx context.Context, obj *models.SystemIntake) (*model.SystemIntakeIsso, error) {
	isPresent := len(obj.ISSOName.String) > 0

	return &model.SystemIntakeIsso{
		IsPresent: &isPresent,
		Name:      obj.ISSOName.Ptr(),
	}, nil
}

// Lcid is the resolver for the lcid field.
func (r *systemIntakeResolver) Lcid(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.LifecycleID.Ptr(), nil
}

// LcidScope is the resolver for the lcidScope field.
func (r *systemIntakeResolver) LcidScope(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.LifecycleScope.Ptr(), nil
}

// LcidCostBaseline is the resolver for the lcidCostBaseline field.
func (r *systemIntakeResolver) LcidCostBaseline(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.LifecycleCostBaseline.Ptr(), nil
}

// NeedsEaSupport is the resolver for the needsEaSupport field.
func (r *systemIntakeResolver) NeedsEaSupport(ctx context.Context, obj *models.SystemIntake) (*bool, error) {
	return obj.EASupportRequest.Ptr(), nil
}

// Notes is the resolver for the notes field.
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

// OitSecurityCollaborator is the resolver for the oitSecurityCollaborator field.
func (r *systemIntakeResolver) OitSecurityCollaborator(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.OITSecurityCollaborator.Ptr(), nil
}

// OitSecurityCollaboratorName is the resolver for the oitSecurityCollaboratorName field.
func (r *systemIntakeResolver) OitSecurityCollaboratorName(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.OITSecurityCollaboratorName.Ptr(), nil
}

// ProductManager is the resolver for the productManager field.
func (r *systemIntakeResolver) ProductManager(ctx context.Context, obj *models.SystemIntake) (*model.SystemIntakeProductManager, error) {
	return &model.SystemIntakeProductManager{
		Component: obj.ProductManagerComponent.Ptr(),
		Name:      obj.ProductManager.Ptr(),
	}, nil
}

// ProjectAcronym is the resolver for the projectAcronym field.
func (r *systemIntakeResolver) ProjectAcronym(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ProjectAcronym.Ptr(), nil
}

// RejectionReason is the resolver for the rejectionReason field.
func (r *systemIntakeResolver) RejectionReason(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.RejectionReason.Ptr(), nil
}

// RequestName is the resolver for the requestName field.
func (r *systemIntakeResolver) RequestName(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.ProjectName.Ptr(), nil
}

// Requester is the resolver for the requester field.
func (r *systemIntakeResolver) Requester(ctx context.Context, obj *models.SystemIntake) (*model.SystemIntakeRequester, error) {
	requesterWithoutEmail := &model.SystemIntakeRequester{
		Component: obj.Component.Ptr(),
		Email:     nil,
		Name:      obj.Requester,
	}

	// if the EUA doesn't exist (Sharepoint imports), don't bother calling CEDAR LDAP
	if !obj.EUAUserID.Valid {
		return requesterWithoutEmail, nil
	}

	user, err := r.service.FetchUserInfo(ctx, obj.EUAUserID.ValueOrZero())
	if err != nil {
		// check if the EUA ID is just invalid in CEDAR LDAP (i.e. the requester no longer has an active EUA account)
		if _, ok := err.(*apperrors.InvalidEUAIDError); ok {
			return requesterWithoutEmail, nil
		}

		// error we can't handle, like being unable to communicate with CEDAR
		return nil, err
	}

	email := user.Email.String()
	return &model.SystemIntakeRequester{
		Component: obj.Component.Ptr(),
		Email:     &email,
		Name:      obj.Requester,
	}, nil
}

// TrbCollaborator is the resolver for the trbCollaborator field.
func (r *systemIntakeResolver) TrbCollaborator(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.TRBCollaborator.Ptr(), nil
}

// TrbCollaboratorName is the resolver for the trbCollaboratorName field.
func (r *systemIntakeResolver) TrbCollaboratorName(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.TRBCollaboratorName.Ptr(), nil
}

// GrtReviewEmailBody is the resolver for the grtReviewEmailBody field.
func (r *systemIntakeResolver) GrtReviewEmailBody(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.GrtReviewEmailBody.Ptr(), nil
}

// LastAdminNote is the resolver for the lastAdminNote field.
func (r *systemIntakeResolver) LastAdminNote(ctx context.Context, obj *models.SystemIntake) (*model.LastAdminNote, error) {
	return &model.LastAdminNote{
		Content:   obj.LastAdminNoteContent.Ptr(),
		CreatedAt: obj.LastAdminNoteCreatedAt,
	}, nil
}

// CedarSystemID is the resolver for the cedarSystemId field.
func (r *systemIntakeResolver) CedarSystemID(ctx context.Context, obj *models.SystemIntake) (*string, error) {
	return obj.CedarSystemID.Ptr(), nil
}

// FundingNumber is the resolver for the fundingNumber field.
func (r *systemIntakeFundingSourceResolver) FundingNumber(ctx context.Context, obj *models.SystemIntakeFundingSource) (*string, error) {
	return obj.FundingNumber.Ptr(), nil
}

// Source is the resolver for the source field.
func (r *systemIntakeFundingSourceResolver) Source(ctx context.Context, obj *models.SystemIntakeFundingSource) (*string, error) {
	return obj.Source.Ptr(), nil
}

// Email is the resolver for the email field.
func (r *userInfoResolver) Email(ctx context.Context, obj *models.UserInfo) (string, error) {
	return string(obj.Email), nil
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

// AugmentedSystemIntakeContact returns generated.AugmentedSystemIntakeContactResolver implementation.
func (r *Resolver) AugmentedSystemIntakeContact() generated.AugmentedSystemIntakeContactResolver {
	return &augmentedSystemIntakeContactResolver{r}
}

// BusinessCase returns generated.BusinessCaseResolver implementation.
func (r *Resolver) BusinessCase() generated.BusinessCaseResolver { return &businessCaseResolver{r} }

// CedarAuthorityToOperate returns generated.CedarAuthorityToOperateResolver implementation.
func (r *Resolver) CedarAuthorityToOperate() generated.CedarAuthorityToOperateResolver {
	return &cedarAuthorityToOperateResolver{r}
}

// CedarDataCenter returns generated.CedarDataCenterResolver implementation.
func (r *Resolver) CedarDataCenter() generated.CedarDataCenterResolver {
	return &cedarDataCenterResolver{r}
}

// CedarDeployment returns generated.CedarDeploymentResolver implementation.
func (r *Resolver) CedarDeployment() generated.CedarDeploymentResolver {
	return &cedarDeploymentResolver{r}
}

// CedarExchange returns generated.CedarExchangeResolver implementation.
func (r *Resolver) CedarExchange() generated.CedarExchangeResolver { return &cedarExchangeResolver{r} }

// CedarRole returns generated.CedarRoleResolver implementation.
func (r *Resolver) CedarRole() generated.CedarRoleResolver { return &cedarRoleResolver{r} }

// CedarSystemDetails returns generated.CedarSystemDetailsResolver implementation.
func (r *Resolver) CedarSystemDetails() generated.CedarSystemDetailsResolver {
	return &cedarSystemDetailsResolver{r}
}

// CedarThreat returns generated.CedarThreatResolver implementation.
func (r *Resolver) CedarThreat() generated.CedarThreatResolver { return &cedarThreatResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// SystemIntake returns generated.SystemIntakeResolver implementation.
func (r *Resolver) SystemIntake() generated.SystemIntakeResolver { return &systemIntakeResolver{r} }

// SystemIntakeFundingSource returns generated.SystemIntakeFundingSourceResolver implementation.
func (r *Resolver) SystemIntakeFundingSource() generated.SystemIntakeFundingSourceResolver {
	return &systemIntakeFundingSourceResolver{r}
}

// UserInfo returns generated.UserInfoResolver implementation.
func (r *Resolver) UserInfo() generated.UserInfoResolver { return &userInfoResolver{r} }

type accessibilityRequestResolver struct{ *Resolver }
type accessibilityRequestDocumentResolver struct{ *Resolver }
type accessibilityRequestNoteResolver struct{ *Resolver }
type augmentedSystemIntakeContactResolver struct{ *Resolver }
type businessCaseResolver struct{ *Resolver }
type cedarAuthorityToOperateResolver struct{ *Resolver }
type cedarDataCenterResolver struct{ *Resolver }
type cedarDeploymentResolver struct{ *Resolver }
type cedarExchangeResolver struct{ *Resolver }
type cedarRoleResolver struct{ *Resolver }
type cedarSystemDetailsResolver struct{ *Resolver }
type cedarThreatResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type systemIntakeResolver struct{ *Resolver }
type systemIntakeFundingSourceResolver struct{ *Resolver }
type userInfoResolver struct{ *Resolver }
