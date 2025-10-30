package cedarcore

import (
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
		newClient, err := gen.NewClientWithResponses("TODO")
		if err != nil {
			panic(err)
		}

		viperNew := viper.New()
		viperNew.AutomaticEnv()

		client3 = &cedarCoreClient3{
			Client:      newClient,
			MockEnabled: viperNew.GetBool(appconfig.CEDARCoreMock),
		}
	})

	return client3
}
