package storage

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s StoreTestSuite) TestDeleteAccessibilityRequestDocument() {
	ctx := context.Background()

	s.Run("happy path for deleting document", func() {
		intake := testhelpers.NewSystemIntake()
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)

		accessibilityRequest := testhelpers.NewAccessibilityRequest(intake.ID)
		_, err = s.store.CreateAccessibilityRequest(ctx, &accessibilityRequest)
		s.NoError(err)

		document := testhelpers.NewAccessibilityRequestDocument(accessibilityRequest.ID)
		document, err = s.store.CreateAccessibilityRequestDocument(ctx, document)
		s.NoError(err)

		err = s.store.DeleteAccessibilityRequestDocument(ctx, document.RequestID)
		s.NoError(err)
	})
}
