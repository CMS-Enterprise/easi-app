package cedarcore

import (
	"context"
	"fmt"
	"time"

	"github.com/guregu/null"
	"github.com/guregu/null/zero"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	apideployments "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/deployment"
	"github.com/cmsgov/easi-app/pkg/models"
)

// GetDeploymentsOptionalParams represents the optional parameters that can be used to filter deployments when searching through the CEDAR API
type GetDeploymentsOptionalParams struct {
	DeploymentType null.String
	State          null.String
	Status         null.String
}

// GetDeployments makes a GET call to the /deployment endpoint
func (c *Client) GetDeployments(ctx context.Context, systemID string, optionalParams *GetDeploymentsOptionalParams) ([]*models.CedarDeployment, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return []*models.CedarDeployment{}, nil
	}

	// Construct the parameters
	params := apideployments.NewDeploymentFindListParams()
	params.SetSystemID(systemID)
	params.HTTPClient = c.hc

	if optionalParams != nil {
		if optionalParams.DeploymentType.Ptr() != nil {
			params.SetDeploymentType(optionalParams.DeploymentType.Ptr())
		}

		if optionalParams.State.Ptr() != nil {
			params.SetState(optionalParams.State.Ptr())
		}

		if optionalParams.Status.Ptr() != nil {
			params.SetStatus(optionalParams.Status.Ptr())
		}
	}

	// Make the API call
	resp, err := c.sdk.Deployment.DeploymentFindList(params, c.auth)
	if err != nil {
		return []*models.CedarDeployment{}, err
	}

	if resp.Payload == nil {
		return []*models.CedarDeployment{}, fmt.Errorf("no body received")
	}

	responseArray := resp.Payload.Deployments

	if len(responseArray) == 0 {
		return nil, &apperrors.ResourceNotFoundError{Err: fmt.Errorf("no deployments found"), Resource: []*models.CedarDeployment{}}
	}

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := []*models.CedarDeployment{}

	// Populate the Deployment field by converting each item in resp.Payload.Deployments
	// generated swagger client turns JSON nulls into Go zero values, so use null/zero package to convert them back to nullable values
	for _, deployment := range resp.Payload.Deployments {
		if deployment.ID == nil {
			appcontext.ZLogger(ctx).Error("Error decoding deployment; deployment ID was null", zap.String("systemID", systemID))
			continue
		}

		if deployment.Name == nil {
			appcontext.ZLogger(ctx).Error("Error decoding deployment; deployment name was null", zap.String("systemID", systemID))
			continue
		}

		if deployment.SystemID == nil {
			appcontext.ZLogger(ctx).Error("Error decoding deployment; deployment system ID was null", zap.String("systemID", systemID))
			continue
		}

		retDeployment := &models.CedarDeployment{
			ID:                *deployment.ID,
			Name:              *deployment.Name,
			SystemID:          *deployment.SystemID,
			StartDate:         zero.TimeFrom(time.Time(deployment.StartDate)),
			EndDate:           zero.TimeFrom(time.Time(deployment.EndDate)),
			IsHotSite:         zero.StringFrom(deployment.IsHotSite),
			Description:       zero.StringFrom(deployment.Description),
			ContractorName:    zero.StringFrom(deployment.ContractorName),
			SystemVersion:     zero.StringFrom(deployment.ContractorName),
			HasProductionData: zero.StringFrom(deployment.HasProductionData),

			// TODO - assumes no nulls in array returned from query
			ReplicatedSystemElements: deployment.ReplicatedSystemElements,

			DeploymentType:      zero.StringFrom(deployment.DeploymentType),
			SystemName:          zero.StringFrom(deployment.SystemName),
			DeploymentElementID: zero.StringFrom(deployment.DeploymentElementID),
			State:               zero.StringFrom(deployment.State),
			Status:              zero.StringFrom(deployment.Status),
			WanType:             zero.StringFrom(deployment.WanType),
		}

		if deployment.DataCenter != nil {
			retDataCenter := &models.CedarDataCenter{
				ID:           zero.StringFrom(deployment.DataCenter.ID),
				Name:         zero.StringFrom(deployment.DataCenter.Name),
				Version:      zero.StringFrom(deployment.DataCenter.Version),
				Description:  zero.StringFrom(deployment.DataCenter.Description),
				State:        zero.StringFrom(deployment.DataCenter.State),
				Status:       zero.StringFrom(deployment.DataCenter.Status),
				StartDate:    zero.TimeFrom(time.Time(deployment.DataCenter.StartDate)),
				EndDate:      zero.TimeFrom(time.Time(deployment.DataCenter.EndDate)),
				Address1:     zero.StringFrom(deployment.DataCenter.Address1),
				Address2:     zero.StringFrom(deployment.DataCenter.Address2),
				City:         zero.StringFrom(deployment.DataCenter.City),
				AddressState: zero.StringFrom(deployment.DataCenter.AddressState),
				Zip:          zero.StringFrom(deployment.DataCenter.Zip),
			}
			retDeployment.DataCenter = retDataCenter
		}

		retVal = append(retVal, retDeployment)
	}

	return retVal, nil
}
