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

type loggingTransport struct {
	logger *zap.Logger
}

func (t *loggingTransport) RoundTrip(r *http.Request) (*http.Response, error) {
	start := time.Now().UnixMilli()
	resp, err := http.DefaultTransport.RoundTrip(r)
	end := time.Now().UnixMilli()

	// Start a status code of 0, in case the request fails (and we get a nil resp)
	status := 0
	if resp != nil {
		status = resp.StatusCode
	}

	t.logger.Info(
		"Call to CEDAR core",
		zap.String("service", "cedarcore"),
		zap.Bool("cacheEnabled", false),
		zap.String("method", r.Method),
		zap.Int("status", status),
		zap.String("path", r.URL.Path),
		zap.String("queryParams", r.URL.RawQuery),
		zap.Int64("timeMS", end-start),
	)

	return resp, err
}

var cedarPath string

func PurgeCacheByPath(ctx context.Context, path string) error {
	req, err := http.NewRequest("PURGE", cedarPath+path, nil)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return err
	}
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	var cacheIsPurged bool
	if res.StatusCode == 200 {
		cacheIsPurged = true
	}
	logger.Info(
		"Cache Purge",
		zap.String("pathArg", path),
		zap.String("path", req.URL.Path),
		zap.String("queryParams", req.URL.RawQuery),
		zap.Int("status", res.StatusCode),
		zap.Bool("success", cacheIsPurged),
	)
	return nil
}

// NewClient builds the type that holds a connection to the CEDAR Core API
func NewClient(ctx context.Context, cedarHost string, cedarAPIKey string, cedarAPIVersion string, cacheRefreshTime time.Duration, mockEnabled bool) *Client {
	c := cache.New(cache.NoExpiration, cache.NoExpiration) // Don't expire data _or_ clean it up

	hc := http.Client{
		Transport: &loggingTransport{
			logger: appcontext.ZLogger(ctx),
		},
	}

	basePath := "/gateway/CEDAR Core API/" + cedarAPIVersion
	cedarPath = "http://" + cedarHost + basePath
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
		hc:    &hc,
		cache: c,
	}

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
// func (c *Client) startCacheRefresh(ctx context.Context, cacheRefreshTime time.Duration, populateCache func(context.Context) error) {
// 	ticker := time.NewTicker(cacheRefreshTime)
// 	go func(ctx context.Context) {
// 		for {
// 			err := populateCache(ctx)
// 			if err != nil {
// 				// This is a Warn() instead of Error() as it happens somewhat frequently, and doesn't necessarily warrant immediate attention
// 				appcontext.ZLogger(ctx).Warn("Failed to refresh cache", zap.Error(err))
// 			}
// 			// Wait for the ticker. This will block the current goroutine until the ticker sends a message over the channel
// 			<-ticker.C
// 		}
// 	}(ctx)
// }
