package cedarcore

import (
	"context"
	"net/http"
	"time"

	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"
	cache "github.com/patrickmn/go-cache"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	apiclient "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client"
)

const (
	cedarCoreCacheDurationDefault = time.Hour * 6
)

// NewClient builds the type that holds a connection to the CEDAR Core API
func NewClient(ctx context.Context, cedarHost string, cedarAPIKey string, cedarAPIVersion string, cacheRefreshTime time.Duration, mockEnabled bool) *Client {
	c := cache.New(cache.NoExpiration, cache.NoExpiration) // Don't expire data _or_ clean it up

	hc := http.DefaultClient

	basePath := "/gateway/CEDAR Core API/" + cedarAPIVersion
	client := &Client{
		mockEnabled: mockEnabled,
		auth: httptransport.APIKeyAuth(
			"x-Gateway-APIKey",
			"header",
			cedarAPIKey,
		),
		sdk: apiclient.New(
			httptransport.New(
				cedarHost,
				basePath,
				[]string{"http"},
				// apiclient.DefaultSchemes,
			),
			strfmt.Default,
		),
		hc:    hc,
		cache: c,
	}

	if cacheRefreshTime <= 0 {
		appcontext.ZLogger(ctx).Error(
			"CEDAR cacheRefreshTime is not a valid value, falling back to default",
			zap.Duration("cacheRefreshTime", cacheRefreshTime),
			zap.Duration("defaultDuration", cedarCoreCacheDurationDefault),
		)
		cacheRefreshTime = cedarCoreCacheDurationDefault
	}
	// client.startCacheRefresh(ctx, cacheRefreshTime, client.populateSystemSummaryCache)

	return client
}

// Client represents a connection to the CEDAR Core API
type Client struct {
	mockEnabled bool
	auth        runtime.ClientAuthInfoWriter
	sdk         *apiclient.CEDARCoreAPI
	hc          *http.Client
	cache       *cache.Cache
}

// startCacheRefresh starts a goroutine that will run `populateCache` based on cacheRefreshTime.
// startCacheRefresh returns no errors, and only logs when something goes wrong.
// Upon being called, startCacheRefresh will populate the cache once immediately, then again at an interval specificed by cacheRefreshTime.
func (c *Client) startCacheRefresh(ctx context.Context, cacheRefreshTime time.Duration, populateCache func(context.Context) error) {
	ticker := time.NewTicker(cacheRefreshTime)
	go func(ctx context.Context) {
		for {
			err := populateCache(ctx)
			if err != nil {
				// This is a Warn() instead of Error() as it happens somewhat frequently, and doesn't necessarily warrant immediate attention
				appcontext.ZLogger(ctx).Warn("Failed to refresh cache", zap.Error(err))
			}
			// Wait for the ticker. This will block the current goroutine until the ticker sends a message over the channel
			<-ticker.C
		}
	}(ctx)
}
