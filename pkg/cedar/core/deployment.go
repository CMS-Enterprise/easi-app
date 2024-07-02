package cedarcore

import (
	"context"
	"fmt"
	"time"

	"github.com/guregu/null/zero"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	apideployments "github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/deployment"
	"github.com/cms-enterprise/easi-app/pkg/local/cedarcoremock"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// GetDeploymentsOptionalParams represents the optional parameters that can be used to filter deployments when searching through the CEDAR API
type GetDeploymentsOptionalParams struct {
	DeploymentType *string
	State          *string
	Status         *string
}

// GetDeployments makes a GET call to the /deployment endpoint
func (c *Client) GetDeployments(ctx context.Context, cedarSystemID string, optionalParams *GetDeploymentsOptionalParams) ([]*models.CedarDeployment, error) {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		if cedarcoremock.IsMockSystem(cedarSystemID) {
			return cedarcoremock.GetDeployments(), nil
		}
		return nil, cedarcoremock.NoSystemFoundError()
	}

	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}

	// Construct the parameters
	params := apideployments.NewDeploymentFindListParams()
	params.SetSystemID(cedarSystem.VersionID.String)
	params.HTTPClient = c.hc

	if optionalParams != nil {
		if optionalParams.DeploymentType != nil {
			params.SetDeploymentType(optionalParams.DeploymentType)
		}

		if optionalParams.State != nil {
			params.SetState(optionalParams.State)
		}

		if optionalParams.Status != nil {
			params.SetStatus(optionalParams.Status)
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

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := []*models.CedarDeployment{}

	// Populate the Deployment field by converting each item in resp.Payload.Deployments
	// generated swagger client turns JSON nulls into Go zero values, so use null/zero package to convert them back to nullable values
	for _, deployment := range resp.Payload.Deployments {
		if deployment.ID == nil {
			appcontext.ZLogger(ctx).Error("Error decoding deployment; deployment ID was null", zap.String("systemID", cedarSystemID))
			continue
		}

		if deployment.Name == nil {
			appcontext.ZLogger(ctx).Error("Error decoding deployment; deployment name was null", zap.String("systemID", cedarSystemID))
			continue
		}

		if deployment.SystemID == nil {
			appcontext.ZLogger(ctx).Error("Error decoding deployment; deployment system ID was null", zap.String("systemID", cedarSystemID))
			continue
		}

		retDeployment := &models.CedarDeployment{
			ID:                zero.StringFromPtr(deployment.ID),
			Name:              zero.StringFromPtr(deployment.Name),
			SystemID:          zero.StringFromPtr(deployment.SystemID),
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
