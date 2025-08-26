package resolvers

import (
	"context"
	"sync"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	cedarcore "github.com/cms-enterprise/easi-app/pkg/cedar/core"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

const maxConcurrency = 20

func AttachOAStatus(ctx context.Context, client *cedarcore.Client, systems []*models.CedarSystem) []*models.CedarSystem {
	logger := appcontext.ZLogger(ctx)

	var wg sync.WaitGroup
	wg.Add(len(systems))

	sem := make(chan struct{}, maxConcurrency)

	for i := range systems {
		go func(idx int) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()

			ato, err := client.GetAuthorityToOperate(ctx, systems[i].ID.String)
			if err != nil {
				logger.Error("problem getting ato for system id", zap.Error(err), zap.String("system.id", systems[i].ID.String))
				return
			}

			if len(ato) < 1 {
				return
			}

			systems[i].OaStatus = ato[0].OaStatus
		}(i)

	}
	wg.Wait()
	return systems
}
