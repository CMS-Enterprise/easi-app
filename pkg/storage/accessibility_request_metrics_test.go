package storage

import (
	"context"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s StoreTestSuite) TestFetchAccessibilityMetrics() {
	s.NoError(s.emptyDatabaseTables())

	ctx := context.Background()
	intake := testhelpers.NewSystemIntake()
	_, err := s.store.CreateSystemIntake(ctx, &intake)
	s.NoError(err)

	_, err = s.store.UpdateSystemIntake(ctx, &intake)
	s.NoError(err)

	s.Run("returns correct metrics", func() {
		today := time.Now().Round(time.Microsecond)
		yesterday := time.Now().Add(time.Hour * -24).Round(time.Microsecond)
		tomorrow := time.Now().Add(time.Hour * 24).Round(time.Microsecond)

		newRequest1 := testhelpers.NewAccessibilityRequest(intake.ID)
		newRequest1.Name = "My Accessibility Request 1"
		newRequest1.CreatedAt = &yesterday

		newRequest2 := testhelpers.NewAccessibilityRequest(intake.ID)
		newRequest2.Name = "My Accessibility Request 2"
		newRequest2.CreatedAt = &today

		_, err = s.store.CreateAccessibilityRequestAndInitialStatusRecord(ctx, &newRequest1)
		s.NoError(err)

		seventyFive := 75
		_, err = s.store.CreateTestDate(ctx, &models.TestDate{
			Score:     &seventyFive,
			Date:      yesterday,
			TestType:  models.TestDateTestTypeInitial,
			RequestID: newRequest1.ID,
		})
		s.NoError(err)

		ninety := 90
		_, err = s.store.CreateTestDate(ctx, &models.TestDate{
			Score:     &ninety,
			Date:      today,
			TestType:  models.TestDateTestTypeRemediation,
			RequestID: newRequest1.ID,
		})
		s.NoError(err)

		oneHundred := 100
		_, err = s.store.CreateTestDate(ctx, &models.TestDate{
			Score:     &oneHundred,
			Date:      tomorrow,
			TestType:  models.TestDateTestTypeRemediation,
			RequestID: newRequest1.ID,
		})
		s.NoError(err)

		_, err = s.store.CreateAccessibilityRequestAndInitialStatusRecord(ctx, &newRequest2)
		s.NoError(err)

		metrics, fetchError := s.store.FetchAccessibilityMetrics()
		s.NoError(fetchError)
		s.Len(metrics, 2)

		s.Equal("My Accessibility Request 1", metrics[0].Name)
		s.Equal("123456", metrics[0].LCID)
		s.Equal(models.AccessibilityRequestStatus("OPEN"), metrics[0].Status)
		s.True(metrics[0].CreatedAt.Equal(yesterday))
		s.Equal(3, metrics[0].TestCount)
		s.Equal(2, metrics[0].FailedTestCount)
		s.True(yesterday.Equal(metrics[0].InitialTestDate.Time))
		s.Equal(int64(75), metrics[0].InitialTestScore.Int64)
		s.True(tomorrow.Equal(metrics[0].EarliestPassingTestDate.Time))
		s.Equal(int64(100), metrics[0].MostRecentRemediationScore.Int64)

		s.Equal("My Accessibility Request 2", metrics[1].Name)
		s.Equal(0, metrics[1].TestCount)
		s.Equal(0, metrics[1].FailedTestCount)
		s.False(metrics[1].InitialTestDate.Valid)
		s.False(metrics[1].InitialTestScore.Valid)
		s.False(metrics[1].EarliestPassingTestDate.Valid)
		s.False(metrics[1].MostRecentRemediationScore.Valid)
	})
}
