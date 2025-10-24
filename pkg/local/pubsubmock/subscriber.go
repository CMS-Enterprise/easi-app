package pubsubmock

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/pubsub"
)

// MockSubscriber is a mock implementation of the Subscriber interface for testing
type MockSubscriber struct {
	ID                       string
	Principal                authentication.Principal
	NotifyCalls              []interface{}
	NotifyUnsubscribedCalls  []NotifyUnsubscribedCall
	ShouldNotify             bool
	ShouldNotifyUnsubscribed bool
}

// NotifyUnsubscribedCall records the arguments passed to NotifyUnsubscribed
type NotifyUnsubscribedCall struct {
	PubSub    *pubsub.ServicePubSub
	SessionID uuid.UUID
}

// NewMockSubscriber creates a new mock Subscriber instance for testing
func NewMockSubscriber(id string, principal authentication.Principal) *MockSubscriber {
	return &MockSubscriber{
		ID:                       id,
		Principal:                principal,
		NotifyCalls:              []interface{}{},
		NotifyUnsubscribedCalls:  []NotifyUnsubscribedCall{},
		ShouldNotify:             true,
		ShouldNotifyUnsubscribed: true,
	}
}

// GetID returns the subscriber's ID
func (m *MockSubscriber) GetID() string {
	return m.ID
}

// GetPrincipal returns the subscriber's principal
func (m *MockSubscriber) GetPrincipal() authentication.Principal {
	return m.Principal
}

// Notify records the notification payload
func (m *MockSubscriber) Notify(payload interface{}) {
	if m.ShouldNotify {
		m.NotifyCalls = append(m.NotifyCalls, payload)
	}
}

// NotifyUnsubscribed records the unsubscribe notification
func (m *MockSubscriber) NotifyUnsubscribed(ps *pubsub.ServicePubSub, sessionID uuid.UUID) {
	if m.ShouldNotifyUnsubscribed {
		m.NotifyUnsubscribedCalls = append(m.NotifyUnsubscribedCalls, NotifyUnsubscribedCall{
			PubSub:    ps,
			SessionID: sessionID,
		})
	}
}
