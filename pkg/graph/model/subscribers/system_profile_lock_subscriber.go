package subscribers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/pubsub"
)

// OnUnsubscribeCallback is a callback that will be called when a SystemProfileLockChangedSubscriber is unsubscribed
type OnUnsubscribeCallback func(ps pubsub.PubSub, subscriber *SystemProfileLockChangedSubscriber)

// SystemProfileLockChangedSubscriber is a Subscriber definition to receive SystemProfileSectionLockStatusChanged payloads
type SystemProfileLockChangedSubscriber struct {
	ID             uuid.UUID
	Principal      authentication.Principal
	CedarSystemID  string // Original system ID for callback use
	Channel        chan *models.SystemProfileSectionLockStatusChanged
	Logger         *zap.Logger
	onUnsubscribed OnUnsubscribeCallback
}

// NewSystemProfileLockChangedSubscriber is a constructor to create a new SystemProfileLockChangedSubscriber
func NewSystemProfileLockChangedSubscriber(principal authentication.Principal, cedarSystemID string, logger *zap.Logger) *SystemProfileLockChangedSubscriber {
	id := uuid.New()

	// Guard against nil logger
	if logger == nil {
		logger = zap.NewNop()
	}

	subscriber := &SystemProfileLockChangedSubscriber{
		ID:            id,
		Principal:     principal,
		CedarSystemID: cedarSystemID,
		Channel:       make(chan *models.SystemProfileSectionLockStatusChanged, 10), // Buffered to prevent blocking publishers
		Logger:        logger,
	}

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
		s.onUnsubscribed(ps, s)
	}
}

// GetChannel provides this Subscriber's feedback channel
func (s *SystemProfileLockChangedSubscriber) GetChannel() <-chan *models.SystemProfileSectionLockStatusChanged {
	return s.Channel
}

// SetOnUnsubscribedCallback is an optional callback that will be called when this Subscriber is unsubscribed
func (s *SystemProfileLockChangedSubscriber) SetOnUnsubscribedCallback(onUnsubscribed OnUnsubscribeCallback) {
	s.onUnsubscribed = onUnsubscribed
}
