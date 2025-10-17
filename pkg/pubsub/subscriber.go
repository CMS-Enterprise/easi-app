package pubsub

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
)

// Subscriber defines the interface for entities that can receive event notifications
type Subscriber interface {
	GetID() string
	GetPrincipal() authentication.Principal
	Notify(payload interface{})
	NotifyUnsubscribed(ps *ServicePubSub, sessionID uuid.UUID)
}
