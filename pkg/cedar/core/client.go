package cedarcore

import (
	"context"
	"net/http"
	"time"

	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	apiclient "github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client"
)

type loggingTransport struct {
	logger *zap.Logger
}

func (t *loggingTransport) RoundTrip(r *http.Request) (*http.Response, error) {
	start := time.Now()
	resp, err := http.DefaultTransport.RoundTrip(r)

	// Start a status code of 0, in case the request fails (and we get a nil resp)
	status := 0
	if resp != nil {
		status = resp.StatusCode
	}

	t.logger.Info(
		"Call to CEDAR core",
		zap.String("service", "cedarcore"),
		zap.String("method", r.Method),
		zap.Int("status", status),
		zap.String("path", r.URL.Path),
		zap.String("query-params", r.URL.RawQuery),
		zap.Int64("cedar-response-time-ms", time.Since(start).Milliseconds()),
	)

	return resp, err
}

var (
	cedarPath string
	client    *Client
)

// PurgeCacheByPath purges the Proxy Cache by URL using a given path
func (c *Client) PurgeCacheByPath(ctx context.Context, path string) error {
	if c.skipPurge {
		return nil
	}
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
func NewClient(ctx context.Context, cedarHost string, cedarAPIKey string, cedarAPIVersion string, skipProxy bool, mockEnabled bool) *Client {
	hc := http.Client{
		Transport: &loggingTransport{
			logger: appcontext.ZLogger(ctx),
		},
	}

	basePath := "/gateway/CEDARIntake/" + cedarAPIVersion
	cedarPath = "http://" + cedarHost + basePath
	client = &Client{
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
		hc: &hc,
	}
	if skipProxy {
		client.skipPurge = true
	}
	return client
}

// Client represents a connection to the CEDAR Core API
type Client struct {
	mockEnabled bool
	auth        runtime.ClientAuthInfoWriter
	sdk         *apiclient.CEDARCoreAPI
	hc          *http.Client
	skipPurge   bool
}
