package scheduler

import (
	"testing"

	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

//TODO implement shared testing utilities

// TestShardScheduler tests the shard scheduler
func TestShardScheduler(t *testing.T) {
	testhelpers.NewConfig()
	StartScheduler(nil, nil)

}
