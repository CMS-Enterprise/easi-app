package storage

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

// TODO Implement store methods that have to deal with setting System Intake linking/relation data
func (s *Store) LinkSystemIntakeContractNumbers(ctx context.Context, link *model.SetSystemIntakeRelationNewSystemInput) error {
	if link == nil || link.SystemIntakeID == uuid.Nil {
		return errors.New("unexpected nil link/system intake ID when linking system intake to contract number")
	}

	euaUserID := appcontext.Principal(ctx).ID()

	ceateSystemIntakeContractNumbersLinks := make([]models.CreateSystemIntakeContractNumbersLink, len(link.ContractNumbers))

	for i, contractNumber := range link.ContractNumbers {
		ceateSystemIntakeContractNumbersLinks[i] = models.CreateSystemIntakeContractNumbersLink{
			IntakeID:       link.SystemIntakeID,
			ContractNumber: contractNumber,
			CreatedBy:      euaUserID,
			ModifiedBy:     euaUserID,
		}
	}

	sqlStatement := `INSERT INTO contract_numbers (
		intake_id,
		contract_number,
		created_by,
		modified_by
	)
	VALUES (
		:intake_id,
		:contract_number,
		:created_by,
		:modified_by
	) ON CONFLICT DO NOTHING`

	if _, err := s.db.NamedExecContext(ctx, sqlStatement, ceateSystemIntakeContractNumbersLinks); err != nil {
		appcontext.ZLogger(ctx).Error("Failed to insert linked system intake to contract numbers", zap.Error(err))
		return err
	}

	return nil
}
