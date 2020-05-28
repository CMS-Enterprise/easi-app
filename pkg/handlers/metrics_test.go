package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"net/url"
	"time"

	"github.com/facebookgo/clock"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s HandlerTestSuite) TestMetricsHandler() {

	handlerClock := clock.NewMock()
	expectedMetrics := models.MetricsDigest{
		SystemIntakeMetrics: models.SystemIntakeMetrics{
			Started:            5,
			CompletedOfStarted: 2,
			Completed:          3,
			Funded:             2,
		},
	}
	fetchMetrics := func(ctx context.Context, startTime time.Time, endTime time.Time) (models.MetricsDigest, error) {
		return expectedMetrics, nil
	}
	metricsURL := url.URL{
		Path: "/metrics",
	}

	s.Run("golden path passes", func() {
		q := metricsURL.Query()
		q.Add("startTime", handlerClock.Now().Add(time.Hour).Format(time.RFC3339))
		u := url.URL{
			RawQuery: q.Encode(),
		}
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", u.String(), nil)
		s.NoError(err)

		MetricsHandler{
			FetchMetrics: fetchMetrics,
			Logger:       s.logger,
			Clock:        handlerClock,
		}.Handle()(rr, req)

		s.Equal(http.StatusOK, rr.Code)

		var metrics models.MetricsDigest
		err = json.Unmarshal(rr.Body.Bytes(), &metrics)
		s.NoError(err)
		s.Equal(expectedMetrics, metrics)
	})

	s.Run("Invalid method is not allowed", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("POST", metricsURL.String(), nil)
		s.NoError(err)

		MetricsHandler{
			FetchMetrics: fetchMetrics,
			Logger:       s.logger,
			Clock:        handlerClock,
		}.Handle()(rr, req)

		s.Equal(http.StatusMethodNotAllowed, rr.Code)
	})
}
