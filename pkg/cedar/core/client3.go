package cedarcore

import (
	"sync"

	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen"
)

var (
	client3     *gen.ClientWithResponses
	client3Once sync.Once
)

func NewCedarClient3() *gen.ClientWithResponses {
	client3Once.Do(func() {
		newClient, err := gen.NewClientWithResponses("TODO")
		if err != nil {
			panic(err)
		}

		client3 = newClient
	})

	return client3
}
