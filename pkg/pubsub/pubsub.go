// Package pubsub provides a lightweight, thread-safe publish-subscribe service
// for managing event notifications within sessions.
package pubsub

import (
	"github.com/google/uuid"
)

// PubSub is a service to facilitate a lightweight, thread-safe subscription model
type PubSub interface {
	Subscribe(sessionID uuid.UUID, eventType EventType, subscriber Subscriber, onDisconnect <-chan struct{})
	Unsubscribe(sessionID uuid.UUID, eventType EventType, subscriberID string)
	Publish(sessionID uuid.UUID, eventType EventType, payload interface{})
}
