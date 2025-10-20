package subscribers

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/pubsub"
)

// OnSystemProfileLockChangedUnsubscribedCallback is a callback that will be called when a SystemProfileLockChangedSubscriber is unsubscribed
type OnSystemProfileLockChangedUnsubscribedCallback func(ps pubsub.PubSub, subscriber pubsub.Subscriber, cedarSystemID string)

// SystemProfileLockChangedSubscriber is a Subscriber definition to receive SystemProfileSectionLockStatusChanged payloads
type SystemProfileLockChangedSubscriber struct {
	ID             uuid.UUID
	Principal      authentication.Principal
	Channel        chan *models.SystemProfileSectionLockStatusChanged
	onUnsubscribed OnSystemProfileLockChangedUnsubscribedCallback
}

// NewSystemProfileLockChangedSubscriber is a constructor to create a new SystemProfileLockChangedSubscriber
func NewSystemProfileLockChangedSubscriber(principal authentication.Principal) *SystemProfileLockChangedSubscriber {
	id := uuid.New()

	subscriber := &SystemProfileLockChangedSubscriber{
		ID:        id,
		Principal: principal,
		Channel:   make(chan *models.SystemProfileSectionLockStatusChanged)}

	return subscriber
}

// GetID returns this Subscriber's unique identifying token
func (s *SystemProfileLockChangedSubscriber) GetID() string {
	return s.ID.String()
}

// GetPrincipal returns this Subscriber's associated principal
func (s *SystemProfileLockChangedSubscriber) GetPrincipal() authentication.Principal {
	return s.Principal
}

// Notify will be called by the PubSub service when an event this Subscriber is registered for is dispatched
func (s *SystemProfileLockChangedSubscriber) Notify(payload interface{}) {
	typedPayload := payload.(models.SystemProfileSectionLockStatusChanged)
	s.Channel <- &typedPayload
}

// NotifyUnsubscribed will be called by the PubSub service when this Subscriber is unsubscribed
func (s *SystemProfileLockChangedSubscriber) NotifyUnsubscribed(ps *pubsub.ServicePubSub, sessionID uuid.UUID) {
	if s.onUnsubscribed != nil {
		s.onUnsubscribed(ps, s, sessionID.String())
	}
}

// GetChannel provides this Subscriber's feedback channel
func (s *SystemProfileLockChangedSubscriber) GetChannel() <-chan *models.SystemProfileSectionLockStatusChanged {
	return s.Channel
}

// SetOnUnsubscribedCallback is an optional callback that will be called when this Subscriber is unsubscribed
func (s *SystemProfileLockChangedSubscriber) SetOnUnsubscribedCallback(onUnsubscribed OnSystemProfileLockChangedUnsubscribedCallback) {
	s.onUnsubscribed = onUnsubscribed
}
