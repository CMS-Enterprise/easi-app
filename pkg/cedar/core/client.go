package cedarcore

import (
	"context"
	"fmt"
	"net/http"

	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	apiclient "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client"
	apisystems "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/system"
	coremodels "github.com/cmsgov/easi-app/pkg/cedar/core/gen/models"
	"github.com/cmsgov/easi-app/pkg/flags"
)

const (
	cedarCoreEnabledKey     = "cedarCoreEnabled"
	cedarCoreEnabledDefault = true
)

// NewClient builds the type that holds a connection to the CEDAR Core API
func NewClient(cedarHost string, cedarAPIKey string, ldClient *ld.LDClient) *Client {
	fnEmit := func(ctx context.Context) bool {
		lduser := flags.Principal(ctx)
		result, err := ldClient.BoolVariation(cedarCoreEnabledKey, lduser, cedarCoreEnabledDefault)
		if err != nil {
			appcontext.ZLogger(ctx).Info(
				"problem evaluating feature flag",
				zap.Error(err),
				zap.String("flagName", cedarCoreEnabledKey),
				zap.Bool("flagDefault", cedarCoreEnabledDefault),
				zap.Bool("flagResult", result),
			)
		}
		return result
	}

	hc := http.DefaultClient

	// Uncomment the following if you're having trouble with TLS locally
	// hc := &http.Client{
	// 	Transport: &http.Transport{
	// 		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	// 	},
	// }

	return &Client{
		cedarCoreEnabled: fnEmit,
		auth: httptransport.APIKeyAuth(
			"x-Gateway-APIKey",
			"header",
			cedarAPIKey,
		),
		sdk: apiclient.New(
			httptransport.New(
				cedarHost,
				apiclient.DefaultBasePath,
				apiclient.DefaultSchemes,
			),
			strfmt.Default,
		),
		hc: hc,
	}
}

// Client represents a connection to the CEDAR Core API
type Client struct {
	cedarCoreEnabled func(context.Context) bool
	auth             runtime.ClientAuthInfoWriter
	sdk              *apiclient.CEDARCoreAPI
	hc               *http.Client
}

// GetSystemSummary makes a GET call to the /system/summary endpoint
func (c *Client) GetSystemSummary(ctx context.Context) (coremodels.SystemSummaryResponse, error) {
	if !c.cedarCoreEnabled(ctx) {
		fmt.Println("CEDAR CORE IS DISABLED")
		return coremodels.SystemSummaryResponse{}, nil
	}

	params := apisystems.NewSystemSummaryFindListParams()
	params.HTTPClient = c.hc

	resp, err := c.sdk.System.SystemSummaryFindList(params, c.auth)
	if err != nil {
		return coremodels.SystemSummaryResponse{}, err
	}
	if resp.Payload == nil {
		return coremodels.SystemSummaryResponse{}, fmt.Errorf("no body received")
	}

	return *resp.Payload, nil
}
