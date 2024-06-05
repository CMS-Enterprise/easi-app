package dataloaders

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (d *dataReader) getTRBRequestContractNumbersByTRBRequestID(ctx context.Context, trbRequestIDs []uuid.UUID) ([][]*models.TRBRequestContractNumber, []error) {
	data, err := d.db.TRBRequestContractNumbersByTRBRequestIDLOADER(ctx, trbRequestIDs)
	if err != nil {
		return nil, []error{err}
	}

	return data, nil
}

func GetTRBRequestContractNumbersByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestContractNumber, error) {
	loaders := loadersFromCTX(ctx)
	if loaders == nil {
		return nil, errors.New("unexpected nil loaders in GetTRBRequestContractNumbersByTRBRequestID")
	}

	time.Sleep(5 * time.Second)
	fmt.Println("==== trbRequestID ====")
	fmt.Println(trbRequestID)
	fmt.Println("==== trbRequestID ====")

	return loaders.TRBRequestContractNumbers.Load(ctx, trbRequestID)
}
