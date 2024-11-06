package resolvers

import (
	"github.com/samber/lo"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// TestCreateTRBRequestForm makes a new TRB request
func (s *ResolverSuite) TestModifyTRBFundingSources() {
	ctx := s.testConfigs.Context

	trbRequest := s.createNewTRBRequest()

	s.Run("create/fetch/update/delete TRB request form funding sources", func() {
		fetched, err := GetTRBFundingSourcesByRequestID(s.ctxWithNewDataloaders(), trbRequest.ID)
		s.NoError(err)
		s.Empty(fetched)
		// should have no sources initially
		s.Len(fetched, 0)
		// add first funding sources
		newFundingNumber1 := "12345"
		newFundingSources1 := []string{"banana", "apple", "mango"}

		updatedSources, err := UpdateTRBRequestFundingSources(
			ctx,
			s.testConfigs.Store,
			trbRequest.ID,
			newFundingNumber1,
			newFundingSources1,
		)
		s.NoError(err)
		s.Len(updatedSources, 3)
		for _, source := range newFundingSources1 {
			updatedSource, _, _ := lo.FindIndexOf(updatedSources, func(s *models.TRBFundingSource) bool { return s.Source == source })
			s.NotNil(updatedSource)
			s.EqualValues(updatedSource.FundingNumber, newFundingNumber1)
		}
		// add second funding source
		newFundingNumber2 := "67890"
		newFundingSources2 := []string{"meatloaf", "spaghetti", "cereal"}

		_, err = UpdateTRBRequestFundingSources(
			ctx,
			s.testConfigs.Store,
			trbRequest.ID,
			newFundingNumber2,
			newFundingSources2,
		)
		s.NoError(err)
		updatedSources, err = GetTRBFundingSourcesByRequestID(s.ctxWithNewDataloaders(), trbRequest.ID)
		s.NoError(err)
		s.Len(updatedSources, 6)
		// should have all funding sources
		for _, source := range newFundingSources1 {
			updatedSource, _, _ := lo.FindIndexOf(updatedSources, func(s *models.TRBFundingSource) bool { return s.Source == source })
			s.NotNil(updatedSource)
			s.EqualValues(updatedSource.FundingNumber, newFundingNumber1)
		}
		for _, source := range newFundingSources2 {
			updatedSource, _, _ := lo.FindIndexOf(updatedSources, func(s *models.TRBFundingSource) bool { return s.Source == source })
			s.NotNil(updatedSource)
			s.EqualValues(updatedSource.FundingNumber, newFundingNumber2)
		}

		// remove a funding source (cereal)
		newFundingSources2 = []string{"meatloaf", "spaghetti"}
		_, err = UpdateTRBRequestFundingSources(
			ctx,
			s.testConfigs.Store,
			trbRequest.ID,
			newFundingNumber2,
			newFundingSources2,
		)
		s.NoError(err)
		updatedSources, err = GetTRBFundingSourcesByRequestID(s.ctxWithNewDataloaders(), trbRequest.ID)
		s.NoError(err)
		s.Len(updatedSources, 5)
		// ensure other funding sources are unaffected
		for _, source := range newFundingSources1 {
			updatedSource, _, _ := lo.FindIndexOf(updatedSources, func(s *models.TRBFundingSource) bool { return s.Source == source })
			s.NotNil(updatedSource)
			s.EqualValues(updatedSource.FundingNumber, newFundingNumber1)
		}
		for _, source := range newFundingSources2 {
			updatedSource, _, _ := lo.FindIndexOf(updatedSources, func(s *models.TRBFundingSource) bool { return s.Source == source })
			s.NotNil(updatedSource)
			s.EqualValues(updatedSource.FundingNumber, newFundingNumber2)
		}
		// removed source should be removed
		deletedSource, _, _ := lo.FindIndexOf(updatedSources, func(s *models.TRBFundingSource) bool { return s.Source == "cereal" })
		s.Nil(deletedSource)

		// delete a funding source by number
		_, err = DeleteTRBRequestFundingSources(ctx, s.testConfigs.Store, trbRequest.ID, newFundingNumber2)
		s.NoError(err)
		updatedSources, err = GetTRBFundingSourcesByRequestID(s.ctxWithNewDataloaders(), trbRequest.ID)
		s.NoError(err)
		s.Len(updatedSources, 3)
		// original funding sources should exist
		for _, source := range newFundingSources1 {
			updatedSource, _, _ := lo.FindIndexOf(updatedSources, func(s *models.TRBFundingSource) bool { return s.Source == source })
			s.NotNil(updatedSource)
			s.EqualValues(updatedSource.FundingNumber, newFundingNumber1)
		}
		// funding sources added later should be removed
		for _, source := range newFundingSources2 {
			deletedSource, _, _ := lo.FindIndexOf(updatedSources, func(s *models.TRBFundingSource) bool { return s.Source == source })
			s.Nil(deletedSource)
		}
	})
}
