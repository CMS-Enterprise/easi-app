package cedarcore

import (
	"context"
	"net/http"
	"time"

	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"
	cache "github.com/patrickmn/go-cache"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	apiclient "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client"
	"github.com/cmsgov/easi-app/pkg/flags"
)

const (
	cedarCoreEnabledKey     = "cedarCoreEnabled"
	cedarCoreEnabledDefault = false
)

// NewClient builds the type that holds a connection to the CEDAR Core API
func NewClient(ctx context.Context, cedarHost string, cedarAPIKey string, ldClient *ld.LDClient) *Client {
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

	c := cache.New(cache.NoExpiration, cache.NoExpiration) // Don't expire data _or_ clean it up

	hc := http.DefaultClient

	client := &Client{
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
		hc:    hc,
		cache: c,
	}

	// Start cache refresh for systems
	client.startCacheRefresh(ctx, time.Minute*5, client.populateSystemSummaryCache)

	return client
}

// Client represents a connection to the CEDAR Core API
type Client struct {
	cedarCoreEnabled func(context.Context) bool
	auth             runtime.ClientAuthInfoWriter
	sdk              *apiclient.CEDARCoreAPI
	hc               *http.Client
	cache            *cache.Cache
}

// startCacheRefresh starts a goroutine that will run `populateCache` based on cacheRefreshTime
// This function returns no errors, and only logs when something goes wrong
func (c *Client) startCacheRefresh(ctx context.Context, cacheRefreshTime time.Duration, populateCache func(context.Context) error) {
	ticker := time.NewTicker(cacheRefreshTime)
	go func(ctx context.Context) {
		for {
			err := populateCache(ctx)
			if err != nil {
				appcontext.ZLogger(ctx).Error("Failed to refresh cache", zap.Error(err))
			}
			// Wait for the ticker. This will block the current goroutine until the ticker sends a message over the channel
			<-ticker.C
		}
	}(ctx)
}
