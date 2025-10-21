package pubsubmock

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/pubsub"
)

// MockPubSub is a mock implementation of the PubSub interface for testing
type MockPubSub struct {
	SubscribeCalls   []SubscribeCall
	UnsubscribeCalls []UnsubscribeCall
	PublishCalls     []PublishCall
}

// SubscribeCall records the arguments passed to Subscribe
type SubscribeCall struct {
	SessionID    uuid.UUID
	EventType    pubsub.EventType
	Subscriber   pubsub.Subscriber
	OnDisconnect <-chan struct{}
}

// UnsubscribeCall records the arguments passed to Unsubscribe
type UnsubscribeCall struct {
	SessionID    uuid.UUID
	EventType    pubsub.EventType
	SubscriberID string
}

// PublishCall records the arguments passed to Publish
type PublishCall struct {
	SessionID uuid.UUID
	EventType pubsub.EventType
	Payload   interface{}
}

// NewMockPubSub creates a new mock PubSub instance for testing
func NewMockPubSub() *MockPubSub {
	return &MockPubSub{
		SubscribeCalls:   []SubscribeCall{},
		UnsubscribeCalls: []UnsubscribeCall{},
		PublishCalls:     []PublishCall{},
	}
}

// Subscribe mocks the Subscribe method and records the call
func (m *MockPubSub) Subscribe(sessionID uuid.UUID, eventType pubsub.EventType, subscriber pubsub.Subscriber, onDisconnect <-chan struct{}) {
	m.SubscribeCalls = append(m.SubscribeCalls, SubscribeCall{
		SessionID:    sessionID,
		EventType:    eventType,
		Subscriber:   subscriber,
		OnDisconnect: onDisconnect,
	})
}

// Unsubscribe mocks the Unsubscribe method and records the call
func (m *MockPubSub) Unsubscribe(sessionID uuid.UUID, eventType pubsub.EventType, subscriberID string) {
	m.UnsubscribeCalls = append(m.UnsubscribeCalls, UnsubscribeCall{
		SessionID:    sessionID,
		EventType:    eventType,
		SubscriberID: subscriberID,
	})
}

// Publish mocks the Publish method and records the call
func (m *MockPubSub) Publish(sessionID uuid.UUID, eventType pubsub.EventType, payload interface{}) {
	m.PublishCalls = append(m.PublishCalls, PublishCall{
		SessionID: sessionID,
		EventType: eventType,
		Payload:   payload,
	})
}
