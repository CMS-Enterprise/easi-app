package loaders

import (
	"context"
	"fmt"
	"runtime/debug"

	"github.com/stretchr/testify/suite"
	"golang.org/x/sync/errgroup"
)

type KeyAndExpected[K comparable, Expected any] struct {
	Key      K
	Expected Expected
}

// verifyLoader is meant to be called by VerifyLoaders to validate a result set of data, and the returned results
func verifyLoader[K comparable, V any, Expected any](ctx context.Context, suite *suite.Suite, loaderWrapper LoaderWrapper[K, V], key K, expected Expected, validateResult func(V, Expected) bool) bool {
	res, err := loaderWrapper.Load(ctx, key)
	suite.NoError(err)
	return validateResult(res, expected)
}

// VerifyLoaders validates a data loader. It takes a loaderWrapper and a list of expected results and loads the data loader asynchronously. This ensures that the dataloader is returning the results as expected
/*
example
	expectedResults := []loaders.KeyAndExpected[uuid.UUID, uuid.UUID]{
		{Key: model_plan1.ID, Expected: approach1.ID},
		{Key: model_plan2.ID, Expected: approach2.ID},
		{Key: model_plan3.ID, Expected: approach3.ID},
	}

	verifyFunc := func(data *models.PlanDataExchangeApproach, expected uuid.UUID) bool {
		if suite.NotNil(data) {
			return suite.EqualValues(expected, data.ID)
		}
		return false

	}

	loaders.VerifyLoaders[uuid.UUID, *models.PlanDataExchangeApproach, uuid.UUID](suite.testConfigs.Context, &suite.Suite, loaders.PlanDataExchangeApproach.ByModelPlanID,
		expectedResults, verifyFunc)

		This example takes the model_plan_id keys, and specifies the expected values.


*/
func VerifyLoaders[K comparable, V any, Expected any](ctx context.Context, suite *suite.Suite, loaderWrapper LoaderWrapper[K, V], expectedResults []KeyAndExpected[K, Expected], validateResult func(V, Expected) bool) {
	g, ctx := errgroup.WithContext(ctx)
	for _, expected := range expectedResults {
		expected := expected      // capture range variable by rebinding to prevent nil reference issue
		g.Go(func() (err error) { // named error allows us to pass an error from defer
			defer func() {
				if r := recover(); r != nil {
					stack := debug.Stack()
					err = fmt.Errorf("panic in loader verification for key %#v: %v\n%s", expected.Key, r, stack)
				}

			}()
			passed := verifyLoader[K, V, Expected](ctx, suite, loaderWrapper, expected.Key, expected.Expected, validateResult)
			if !passed {
				err = fmt.Errorf("dataloader verification function failed. expected %v for key %v", expected.Expected, expected.Key)
			}
			return
		})
	}
	err := g.Wait()
	suite.NoError(err)
}
