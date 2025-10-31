package server

import (
	"context"
	"errors"
	"strings"

	"github.com/99designs/gqlgen/graphql/handler/transport"

	"github.com/cms-enterprise/easi-app/pkg/local"
	"github.com/cms-enterprise/easi-app/pkg/okta"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// HandleLocalOrOktaWebSocketAuth returns a websocket InitFunc that authenticates connections
// using either Local or Okta authentication based on the authToken prefix.
func HandleLocalOrOktaWebSocketAuth(oktaMiddlewareFactory *okta.OktaMiddlewareFactory, store *storage.Store) transport.WebsocketInitFunc {
	return func(ctx context.Context, initPayload transport.InitPayload) (context.Context, *transport.InitPayload, error) {
		token, ok := initPayload["authToken"].(string)
		if !ok || token == "" {
			return nil, &initPayload, errors.New("authToken not found in transport payload")
		}

		if strings.HasPrefix(token, "Local ") {
			return local.NewLocalWebSocketAuthenticationMiddleware(store)(ctx, initPayload)
		}
		return oktaMiddlewareFactory.NewOktaWebSocketAuthenticationMiddleware()(ctx, initPayload)
	}
}
