package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s HandlerTestSuite) TestMetricsHandler() {

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
		q.Add("startTime", s.base.clock.Now().Add(time.Hour).Format(time.RFC3339))
		u := url.URL{
			RawQuery: q.Encode(),
		}
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", u.String(), nil)
		s.NoError(err)

		SystemIntakeMetricsHandler{
			FetchMetrics: fetchMetrics,
			HandlerBase:  s.base,
		}.Handle()(rr, req)

		s.Equal(http.StatusOK, rr.Code)

	})

	var paramTests = []struct {
		name   string
		params map[string]string
		status int
	}{
		{
			name:   "no params",
			params: map[string]string{},
			status: http.StatusUnprocessableEntity,
		},
		{
			name: "bad startTime",
			params: map[string]string{
				"startTime": "bad time",
			},
			status: http.StatusUnprocessableEntity,
		},
		{
			name: "non RFC3339 format startTime",
			params: map[string]string{
				"startTime": s.base.clock.Now().Format(time.RFC822),
			},
			status: http.StatusUnprocessableEntity,
		},
		{
			name: "non RFC3339 format endTime",
			params: map[string]string{
				"startTime": s.base.clock.Now().Format(time.RFC3339),
				"endTime":   s.base.clock.Now().Format(time.RFC822),
			},
			status: http.StatusUnprocessableEntity,
		},
		{
			name: "bad endTime",
			params: map[string]string{
				"startTime": s.base.clock.Now().Format(time.RFC3339),
				"endTime":   "badTime",
			},
			status: http.StatusUnprocessableEntity,
		},
		{
			name: "startTime no endTime",
			params: map[string]string{
				"startTime": s.base.clock.Now().Format(time.RFC3339),
			},
			status: http.StatusOK,
		},
		{
			name: "startTime and endTime",
			params: map[string]string{
				"startTime": s.base.clock.Now().Format(time.RFC3339),
				"endTime":   s.base.clock.Now().Format(time.RFC3339),
			},
			status: http.StatusOK,
		},
	}
	for _, t := range paramTests {
		s.Run(fmt.Sprintf("%s returns %d", t.name, t.status), func() {
			q := metricsURL.Query()
			for k, v := range t.params {
				q.Add(k, v)
			}
			u := url.URL{
				RawQuery: q.Encode(),
			}
			rr := httptest.NewRecorder()
			req, err := http.NewRequest("GET", u.String(), nil)
			s.NoError(err)

			SystemIntakeMetricsHandler{
				FetchMetrics: fetchMetrics,
				HandlerBase:  s.base,
			}.Handle()(rr, req)

			s.Equal(t.status, rr.Code)

			if t.status == http.StatusOK {
				var metrics models.MetricsDigest
				err = json.Unmarshal(rr.Body.Bytes(), &metrics)
				s.NoError(err)
				s.Equal(expectedMetrics, metrics)
			}
		})
	}

	s.Run("fetch error returns server error", func() {
		failFetchMetrics := func(ctx context.Context, startTime time.Time, endTime time.Time) (models.MetricsDigest, error) {
			return models.MetricsDigest{}, errors.New("failed to fetch metrics")
		}
		q := metricsURL.Query()
		q.Add("startTime", s.base.clock.Now().Format(time.RFC3339))
		u := url.URL{
			RawQuery: q.Encode(),
		}
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", u.String(), nil)
		s.NoError(err)

		SystemIntakeMetricsHandler{
			FetchMetrics: failFetchMetrics,
			HandlerBase:  s.base,
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
	})

	s.Run("Invalid method is not allowed", func() {
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("POST", metricsURL.String(), nil)
		s.NoError(err)

		SystemIntakeMetricsHandler{
			FetchMetrics: fetchMetrics,
			HandlerBase:  s.base,
		}.Handle()(rr, req)

		s.Equal(http.StatusMethodNotAllowed, rr.Code)
	})
}

func (s HandlerTestSuite) TestAccessibilityMetricsHandler() {

	fetchMetrics := func() ([][]string, error) {
		return [][]string{{"Column 1", "Column 2"}, {"Field 1", "Field 2"}, {"Field 1", "Field 2"}}, nil
	}

	metricsURL := url.URL{
		Path: "/508/metrics",
	}

	s.Run("golden path passes", func() {
		q := metricsURL.Query()
		u := url.URL{
			RawQuery: q.Encode(),
		}
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", u.String(), nil)
		s.NoError(err)

		AccessibilityMetricsHandler{
			fetchAccessibilityMetrics: fetchMetrics,
			HandlerBase:               s.base,
		}.Handle()(rr, req)

		s.Equal(http.StatusOK, rr.Code)

	})

	s.Run("fetch error returns server error", func() {
		failFetchMetrics := func() ([][]string, error) {
			return [][]string{}, errors.New("failed to fetch metrics")
		}
		q := metricsURL.Query()
		u := url.URL{
			RawQuery: q.Encode(),
		}
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", u.String(), nil)
		s.NoError(err)

		AccessibilityMetricsHandler{
			fetchAccessibilityMetrics: failFetchMetrics,
			HandlerBase:               s.base,
		}.Handle()(rr, req)

		s.Equal(http.StatusInternalServerError, rr.Code)
	})
}
