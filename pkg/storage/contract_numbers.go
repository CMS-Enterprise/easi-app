package storage

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/graph/model"
)

func (s *Store) LinkSystemIntakeContractNumber(ctx context.Context, link *model.SetSystemIntakeRelationNewSystemInput) error {
	if link == nil || link.SystemIntakeID == uuid.Nil {
		return errors.New("")
	}

	euaUserID := appcontext.Principal(ctx).ID()

	// build values
	var (
		intakeId        = make([]uuid.UUID, len(link.ContractNumbers))
		contractNumbers = make([]string, len(link.ContractNumbers))
		createdBy       = make([]string, len(link.ContractNumbers))
	)

	for i := range contractNumbers {
		intakeId[i] = link.SystemIntakeID
		contractNumbers[i] = link.ContractNumbers[i]
		createdBy[i] = euaUserID
	}

	linkSystemIntakeContractSQL := fmt.Sprintf(`
		INSERT INTO contract_numbers (
			intake_id,
			contract_number,
			created_by,
			modified_by
		)
		(SELECT * FROM UNNEST($1::UUID[], $2::TEXT[], $3::TEXT[], $3::TEXT[]))
	`)
	return nil
}
