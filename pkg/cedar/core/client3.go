package cedarcore

import (
	"context"
	"net/http"
	"sync"

	"github.com/spf13/viper"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen"
)

type cedarCoreClient3 struct {
	Client      *gen.ClientWithResponses
	MockEnabled bool
}

var (
	client3     *cedarCoreClient3
	client3Once sync.Once
)

func NewCedarClient3() *cedarCoreClient3 {
	client3Once.Do(func() {
		viperNew := viper.New()
		viperNew.AutomaticEnv()

		newClient, err := gen.NewClientWithResponses(
			"http://pinecone.impl.cedar.cms.gov",
			gen.WithRequestEditorFn(func(ctx context.Context, req *http.Request) error {
				req.Header.Set("x-Gateway-APIKey", viperNew.GetString(appconfig.CEDARAPIKey))
				return nil
			}))
		if err != nil {
			panic(err)
		}

		client3 = &cedarCoreClient3{
			Client:      newClient,
			MockEnabled: viperNew.GetBool(appconfig.CEDARCoreMock),
		}

	})

	return client3
}
