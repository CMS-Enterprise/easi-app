package resolvers

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/suite"
	"github.com/vikstrous/dataloadgen"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

type SystemIntakeDocumentUploadTestSuite struct {
	suite.Suite
}

func TestSystemIntakeDocumentUploadTestSuite(t *testing.T) {
	suite.Run(t, new(SystemIntakeDocumentUploadTestSuite))
}

func (s *SystemIntakeDocumentUploadTestSuite) setupContext(principalID uuid.UUID, isAdmin bool, contacts []*models.SystemIntakeContact) context.Context {
	ctx := context.Background()
	principal := &authentication.EUAPrincipal{
		EUAID:      "TEST",
		JobCodeGRT: isAdmin,
		UserAccount: &authentication.UserAccount{
			ID:       principalID,
			Username: "TEST",
		},
	}
	ctx = appcontext.WithPrincipal(ctx, principal)

	buildDataloaders := func() *dataloaders.Dataloaders {
		dl := dataloaders.NewDataloaders(
			nil,
			func(ctx context.Context, s []string) ([]*models.UserInfo, error) { return nil, nil },
			func(ctx context.Context) ([]*models.CedarSystem, error) { return nil, nil },
		)
		// Mock the SystemIntakeContactsBySystemIntakeID dataloader
		dl.SystemIntakeContactsBySystemIntakeID = dataloadgen.NewLoader(func(ctx context.Context, ids []uuid.UUID) ([][]*models.SystemIntakeContact, []error) {
			results := make([][]*models.SystemIntakeContact, len(ids))
			for i := range ids {
				results[i] = contacts
			}
			return results, nil
		})
		return dl
	}
	ctx = dataloaders.CTXWithLoaders(ctx, buildDataloaders)
	return ctx
}

func (s *SystemIntakeDocumentUploadTestSuite) TestGetUploaderRole() {
	intakeID := uuid.New()
	userID := uuid.New()

	intake := &models.SystemIntake{
		ID: intakeID,
	}

	s.Run("User is requester", func() {
		contact := models.NewSystemIntakeContact(userID, uuid.New())
		contact.SystemIntakeID = intakeID
		contact.IsRequester = true

		contacts := []*models.SystemIntakeContact{contact}
		ctx := s.setupContext(userID, false, contacts)

		role, err := getUploaderRole(ctx, intake)
		s.NoError(err)
		s.Equal(models.RequesterUploaderRole, role)
	})

	s.Run("User is not requester but is admin", func() {
		contact := models.NewSystemIntakeContact(uuid.New(), uuid.New())
		contact.SystemIntakeID = intakeID
		contact.IsRequester = true

		contacts := []*models.SystemIntakeContact{contact}
		ctx := s.setupContext(userID, true, contacts)

		role, err := getUploaderRole(ctx, intake)
		s.NoError(err)
		s.Equal(models.AdminUploaderRole, role)
	})

	s.Run("User is neither requester nor admin", func() {
		contact := models.NewSystemIntakeContact(uuid.New(), uuid.New())
		contact.SystemIntakeID = intakeID
		contact.IsRequester = true

		contacts := []*models.SystemIntakeContact{contact}
		ctx := s.setupContext(userID, false, contacts)

		role, err := getUploaderRole(ctx, intake)
		s.Error(err)
		s.Equal(models.DocumentUploaderRole(""), role)
		s.Contains(err.Error(), "unable to get uploader role")
	})

	s.Run("Requester not found", func() {
		contacts := []*models.SystemIntakeContact{}
		ctx := s.setupContext(userID, true, contacts)

		role, err := getUploaderRole(ctx, intake)
		s.Error(err)
		s.Equal(models.DocumentUploaderRole(""), role)
		s.Contains(err.Error(), "unable to get requester for uploader role")
	})
}

func (s *SystemIntakeDocumentUploadTestSuite) TestAllowCreate() {
	intakeID := uuid.New()
	userID := uuid.New()

	intake := &models.SystemIntake{
		ID: intakeID,
	}

	s.Run("User is requester", func() {
		contact := models.NewSystemIntakeContact(userID, uuid.New())
		contact.SystemIntakeID = intakeID
		contact.IsRequester = true

		contacts := []*models.SystemIntakeContact{contact}
		ctx := s.setupContext(userID, false, contacts)

		role, err := allowCreate(ctx, intake)
		s.NoError(err)
		s.Equal(models.RequesterUploaderRole, role)
	})

	s.Run("User is not requester but is admin", func() {
		contact := models.NewSystemIntakeContact(uuid.New(), uuid.New())
		contact.SystemIntakeID = intakeID
		contact.IsRequester = true

		contacts := []*models.SystemIntakeContact{contact}
		ctx := s.setupContext(userID, true, contacts)

		role, err := allowCreate(ctx, intake)
		s.NoError(err)
		s.Equal(models.AdminUploaderRole, role)
	})

	s.Run("User is neither requester nor admin", func() {
		contact := models.NewSystemIntakeContact(uuid.New(), uuid.New())
		contact.SystemIntakeID = intakeID
		contact.IsRequester = true

		contacts := []*models.SystemIntakeContact{contact}
		ctx := s.setupContext(userID, false, contacts)

		role, err := allowCreate(ctx, intake)
		s.Error(err)
		s.Equal(models.DocumentUploaderRole(""), role)
		s.Contains(err.Error(), "unable to get uploader role")
	})

	s.Run("Requester not found", func() {
		contacts := []*models.SystemIntakeContact{}
		ctx := s.setupContext(userID, true, contacts)

		role, err := allowCreate(ctx, intake)
		s.Error(err)
		s.Equal(models.DocumentUploaderRole(""), role)
		s.Contains(err.Error(), "unable to get requester for uploader role")
	})
}
