package resolvers

import (
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
)

func (s *ResolverSuite) TestRelatedRequests() {
	ctx := s.testConfigs.Context

	const (
		systemID1               = "{11AB1A00-1234-5678-ABC1-1A001B00CC0A}"
		systemID2               = "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"
		systemID3               = "{11AB1A00-1234-5678-ABC1-1A001B00CC2C}"
		unrelatedSystemID       = "{11AB1A00-1234-5678-ABC1-1A001B00CC3D}"
		contractNumber1         = "00001"
		contractNumber2         = "00002"
		contractNumber3         = "00003"
		unrelatedContractNumber = "00004"
	)

	var relations = map[string]struct {
		Systems                 []string
		ContractNumbers         []string
		ExpectedRelatedRequests int
		TrbRequestID            uuid.UUID
		SystemIntakeID          uuid.UUID
	}{
		"no relation should have no relations": {
			[]string{}, []string{}, 0, uuid.Nil, uuid.Nil,
		},
		"req with sys1 should relate to req with sys1 and sys2": {
			[]string{systemID1}, []string{}, 1, uuid.Nil, uuid.Nil,
		},
		"req with sys2 should relate to req with sys1 and sys2": {
			[]string{systemID2}, []string{}, 1, uuid.Nil, uuid.Nil,
		},
		"req with sys1 and sys2 should relate to req with sys1 and req with sys2": {
			[]string{systemID1, systemID2}, []string{}, 2, uuid.Nil, uuid.Nil,
		},
		"unrelated system ID should relate to no requests": {
			[]string{unrelatedSystemID}, []string{}, 0, uuid.Nil, uuid.Nil,
		},
		"req with cn1 should relate to req with cn1 and cn2": {
			[]string{}, []string{contractNumber1}, 1, uuid.Nil, uuid.Nil,
		},
		"req with cn2 should relate to req with cn1 and cn2": {
			[]string{}, []string{contractNumber2}, 1, uuid.Nil, uuid.Nil,
		},
		"req with cn1 and cn2 should relate to req with cn1 and req with cn2": {
			[]string{}, []string{contractNumber1, contractNumber2}, 2, uuid.Nil, uuid.Nil,
		},
		"unrelated contract number should relate to no requests": {
			[]string{}, []string{unrelatedContractNumber}, 0, uuid.Nil, uuid.Nil,
		},
		"req with sys3 and cn3 should relate to req with sys3 and req with cn3": {
			[]string{systemID3}, []string{contractNumber3}, 2, uuid.Nil, uuid.Nil,
		},
		"req with cn3 should relate to req with sys3 and cn3": {
			[]string{}, []string{contractNumber3}, 1, uuid.Nil, uuid.Nil,
		},
		"req with sys3 should relate to req with sys3 and cn3": {
			[]string{systemID3}, []string{}, 1, uuid.Nil, uuid.Nil,
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
				if err := s.testConfigs.Store.SetSystemIntakeSystems(ctx, tx, intake.ID, relation.Systems); err != nil {
					panic(err)
				}
				if err := s.testConfigs.Store.SetSystemIntakeContractNumbers(ctx, tx, intake.ID, relation.ContractNumbers); err != nil {
					panic(err)
				}
				if err := s.testConfigs.Store.SetTRBRequestSystems(ctx, tx, trbRequest.ID, relation.Systems); err != nil {
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
			s.Len(relatedIntakes, relation.ExpectedRelatedRequests)
		})
		s.Run("trb req related trb reqs "+caseName, func() {
			relatedTRBRequests, err := TRBRequestRelatedTRBRequests(s.ctxWithNewDataloaders(), relation.TrbRequestID)
			s.NoError(err)
			s.Len(relatedTRBRequests, relation.ExpectedRelatedRequests)
		})
		s.Run("system intake related trb reqs "+caseName, func() {
			relatedTRBRequests, err := SystemIntakeRelatedTRBRequests(s.ctxWithNewDataloaders(), relation.SystemIntakeID)
			s.NoError(err)
			// requests of a different type will relate to the same case so will have one additional expected relation
			// except for the case where there are no related systems or contract numbers
			if len(relation.ContractNumbers) == 0 && len(relation.Systems) == 0 {
				s.Len(relatedTRBRequests, 0)
				return
			}
			s.Len(relatedTRBRequests, relation.ExpectedRelatedRequests+1)
		})
		s.Run("trb req related intakes "+caseName, func() {
			relatedIntakes, err := TRBRequestRelatedSystemIntakes(s.ctxWithNewDataloaders(), relation.TrbRequestID)
			s.NoError(err)
			// requests of a different type will relate to the same case so will have one additional expected relation
			// except for the case where there are no related systems or contract numbers
			if len(relation.ContractNumbers) == 0 && len(relation.Systems) == 0 {
				s.Len(relatedIntakes, 0)
				return
			}
			s.Len(relatedIntakes, relation.ExpectedRelatedRequests+1)
		})
	}
}
