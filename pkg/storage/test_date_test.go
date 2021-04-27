package storage

import (
	"context"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s StoreTestSuite) TestUpdateTestDate() {
	ctx := context.Background()

	s.Run("create a new test date", func() {
		intake := testhelpers.NewSystemIntake()
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)

		accessibilityRequest := testhelpers.NewAccessibilityRequest(intake.ID)
		_, err = s.store.CreateAccessibilityRequest(ctx, &accessibilityRequest)
		s.NoError(err)

		testDate := testhelpers.NewTestDate(accessibilityRequest.ID)
		score := 40
		testDate.Score = &score

		date, err := time.Parse(time.RFC3339, "2022-01-02T00:00:00Z")
		s.NoError(err)
		testDate.Date = date

		savedTestDate, err := s.store.CreateTestDate(ctx, &testDate)
		s.NoError(err)

		s.Equal(*savedTestDate.Score, score)
		s.Equal(savedTestDate.Date.Format("2006-01-02"), date.Format("2006-01-02"))
	})

	s.Run("update an existing test date", func() {
		intake := testhelpers.NewSystemIntake()
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)

		accessibilityRequest := testhelpers.NewAccessibilityRequest(intake.ID)
		_, err = s.store.CreateAccessibilityRequest(ctx, &accessibilityRequest)
		s.NoError(err)

		testDate := testhelpers.NewTestDate(accessibilityRequest.ID)
		oldTestDate, err := s.store.CreateTestDate(ctx, &testDate)
		s.NoError(err)

		score := 40
		oldTestDate.Score = &score

		date, err := time.Parse(time.RFC3339, "2022-01-02T00:00:00Z")
		s.NoError(err)
		oldTestDate.Date = date

		oldTestDate.TestType = models.TestDateTestTypeRemediation

		updatedTestDate, err := s.store.UpdateTestDate(ctx, oldTestDate)
		s.NoError(err)

		s.Equal(*updatedTestDate.Score, score)
		s.Equal(updatedTestDate.Date.Format("2006-01-02"), date.Format("2006-01-02"))
		s.Equal(updatedTestDate.TestType, models.TestDateTestTypeRemediation)
	})

	s.Run("update an existing test date to remove a score", func() {
		intake := testhelpers.NewSystemIntake()
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)

		accessibilityRequest := testhelpers.NewAccessibilityRequest(intake.ID)
		_, err = s.store.CreateAccessibilityRequest(ctx, &accessibilityRequest)
		s.NoError(err)

		testDate := testhelpers.NewTestDate(accessibilityRequest.ID)
		oldTestDate, err := s.store.CreateTestDate(ctx, &testDate)
		s.NoError(err)

		oldTestDate.Score = nil

		updatedTestDate, err := s.store.UpdateTestDate(ctx, oldTestDate)
		s.NoError(err)

		s.Nil(updatedTestDate.Score)
	})
}
