package resolvers

import (
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
)

func (s *ResolverSuite) TestRelatedRequests() {
	ctx := s.testConfigs.Context

	systemID1 := "{11AB1A00-1234-5678-ABC1-1A001B00CC0A}"
	systemID2 := "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"
	systemID3 := "{11AB1A00-1234-5678-ABC1-1A001B00CC2C}"
	unrelatedSystemID := "{11AB1A00-1234-5678-ABC1-1A001B00CC3D}"

	description := "other description"

	const (
		contractNumber1         = "00001"
		contractNumber2         = "00002"
		contractNumber3         = "00003"
		unrelatedContractNumber = "00004"
	)

	system1 := models.SystemRelationshipInput{
		CedarSystemID:          &systemID1,
		SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT", "OTHER"},
		OtherTypeDescription:   &description,
	}

	system2 := models.SystemRelationshipInput{
		CedarSystemID:          &systemID2,
		SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT", "OTHER"},
		OtherTypeDescription:   &description,
	}

	system3 := models.SystemRelationshipInput{
		CedarSystemID:          &systemID3,
		SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT", "OTHER"},
		OtherTypeDescription:   &description,
	}

	unrelatedSystem := models.SystemRelationshipInput{
		CedarSystemID:          &unrelatedSystemID,
		SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT"},
	}

	var relations = map[string]struct {
		TrbSystems                  []string
		CedarSystems                []*models.SystemRelationshipInput
		ContractNumbers             []string
		ExpectedRelatedTrbRequests  int
		ExpectedRelatedCedarSystems int
		TrbRequestID                uuid.UUID
		SystemIntakeID              uuid.UUID
	}{
		"no relation should have no relations": {
			[]string{}, []*models.SystemRelationshipInput{}, []string{}, 0, 0, uuid.Nil, uuid.Nil,
		},
		"req with sys1 should relate to req with sys1 and sys2": {
			[]string{systemID1}, []*models.SystemRelationshipInput{&system1}, []string{}, 1, 1, uuid.Nil, uuid.Nil,
		},
		"req with sys2 should relate to req with sys1 and sys2": {
			[]string{systemID2}, []*models.SystemRelationshipInput{&system2}, []string{}, 1, 1, uuid.Nil, uuid.Nil,
		},
		"req with sys1 and sys2 should relate to req with sys1 and req with sys2": {
			[]string{systemID1, systemID2}, []*models.SystemRelationshipInput{&system1, &system2}, []string{}, 2, 2, uuid.Nil, uuid.Nil,
		},
		"unrelated system ID should relate to no requests": {
			[]string{unrelatedSystemID}, []*models.SystemRelationshipInput{&unrelatedSystem}, []string{}, 0, 0, uuid.Nil, uuid.Nil,
		},
		"req with cn1 should relate to req with cn1 and cn2": {
			[]string{}, []*models.SystemRelationshipInput{}, []string{contractNumber1}, 1, 1, uuid.Nil, uuid.Nil,
		},
		"req with cn2 should relate to req with cn1 and cn2": {
			[]string{}, []*models.SystemRelationshipInput{}, []string{contractNumber2}, 1, 1, uuid.Nil, uuid.Nil,
		},
		"req with cn1 and cn2 should relate to req with cn1 and req with cn2": {
			[]string{}, []*models.SystemRelationshipInput{}, []string{contractNumber1, contractNumber2}, 2, 0, uuid.Nil, uuid.Nil,
		},
		"unrelated contract number should relate to no requests": {
			[]string{}, []*models.SystemRelationshipInput{}, []string{unrelatedContractNumber}, 0, 0, uuid.Nil, uuid.Nil,
		},
		"req with sys3 and cn3 should relate to req with sys3 and req with cn3": {
			[]string{systemID3}, []*models.SystemRelationshipInput{&system3}, []string{contractNumber3}, 2, 1, uuid.Nil, uuid.Nil,
		},
		"req with cn3 should relate to req with sys3 and cn3": {
			[]string{}, []*models.SystemRelationshipInput{&system3}, []string{contractNumber3}, 1, 1, uuid.Nil, uuid.Nil,
		},
		"req with sys3 should relate to req with sys3 and cn3": {
			[]string{systemID3}, []*models.SystemRelationshipInput{&system3}, []string{contractNumber3}, 1, 1, uuid.Nil, uuid.Nil,
		},
	}
	// create system intakes and trb requests for testing
	s.Run("setup related intakes for testing", func() {
		for caseName, relation := range relations {
			intake := s.createNewIntake()
			relation.SystemIntakeID = intake.ID

			trbRequest := s.createNewTRBRequest()
			relation.TrbRequestID = trbRequest.ID

			relations[caseName] = relation

			err := sqlutils.WithTransaction(s.testConfigs.Context, s.testConfigs.Store, func(tx *sqlx.Tx) error {
				if err := s.testConfigs.Store.SetSystemIntakeSystems(ctx, tx, intake.ID, relation.CedarSystems); err != nil {
					panic(err)
				}
				if err := s.testConfigs.Store.SetSystemIntakeContractNumbers(ctx, tx, intake.ID, relation.ContractNumbers); err != nil {
					panic(err)
				}
				if err := s.testConfigs.Store.SetTRBRequestSystems(ctx, tx, trbRequest.ID, relation.TrbSystems); err != nil {
					panic(err)
				}
				if err := s.testConfigs.Store.SetTRBRequestContractNumbers(ctx, tx, trbRequest.ID, relation.ContractNumbers); err != nil {
					panic(err)
				}
				return nil
			})
			s.NoError(err)
		}
	})
	for caseName, relation := range relations {
		s.Run("system intake related intakes "+caseName, func() {
			relatedIntakes, err := SystemIntakeRelatedSystemIntakes(s.ctxWithNewDataloaders(), relation.SystemIntakeID)
			s.NoError(err)
			s.Len(relatedIntakes, relation.ExpectedRelatedCedarSystems)
		})
		s.Run("trb req related trb reqs "+caseName, func() {
			relatedTRBRequests, err := TRBRequestRelatedTRBRequests(s.ctxWithNewDataloaders(), relation.TrbRequestID)
			s.NoError(err)
			s.Len(relatedTRBRequests, relation.ExpectedRelatedTrbRequests)
		})
		s.Run("system intake related trb reqs "+caseName, func() {
			relatedTRBRequests, err := SystemIntakeRelatedTRBRequests(s.ctxWithNewDataloaders(), relation.SystemIntakeID)
			s.NoError(err)
			// requests of a different type will relate to the same case so will have one additional expected relation
			// except for the case where there are no related systems or contract numbers
			if len(relation.ContractNumbers) == 0 && len(relation.TrbSystems) == 0 {
				s.Len(relatedTRBRequests, 0)
				return
			}
			s.Len(relatedTRBRequests, relation.ExpectedRelatedTrbRequests+1)
		})
		s.Run("trb req related intakes "+caseName, func() {
			relatedIntakes, err := TRBRequestRelatedSystemIntakes(s.ctxWithNewDataloaders(), relation.TrbRequestID)
			s.NoError(err)
			// requests of a different type will relate to the same case so will have one additional expected relation
			// except for the case where there are no related systems or contract numbers
			if len(relation.ContractNumbers) == 0 && len(relation.TrbSystems) == 0 {
				s.Len(relatedIntakes, 0)
				return
			}
			s.Len(relatedIntakes, relation.ExpectedRelatedTrbRequests+1)
		})
	}
}
