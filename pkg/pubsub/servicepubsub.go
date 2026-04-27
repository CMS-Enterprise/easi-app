package pubsub

import (
	"sync"

	"github.com/google/uuid"
)

// ServicePubSub is a thread-safe PubSub service implementation that organizes subscriptions by session
type ServicePubSub struct {
	sessions SessionMap
	lock     sync.Mutex
}

// NewServicePubSub creates a new instance of a PubSub service
func NewServicePubSub() *ServicePubSub {
	return &ServicePubSub{
		sessions: make(SessionMap),
	}
}

// Subscribe registers the subscriber for notifications of a given eventType within a session
func (ps *ServicePubSub) Subscribe(sessionID uuid.UUID, eventType EventType, subscriber Subscriber, onDisconnect <-chan struct{}) {
	func() {
		ps.lock.Lock()
		defer ps.lock.Unlock()

		session, wasSessionFound := ps.sessions[sessionID]
		if !wasSessionFound {
			session = make(Session)
			ps.sessions[sessionID] = session
		}

		subscriberMap, wasSubscriberMapFound := session[eventType]
		if !wasSubscriberMapFound {
			subscriberMap = make(SubscriberMap)
			session[eventType] = subscriberMap
		}

		subscriberMap[subscriber.GetID()] = subscriber
	}()

	ps.awaitDisconnectUnregister(sessionID, subscriber.GetID(), eventType, onDisconnect)
}

// Unsubscribe unregisters a subscriber from notifications of a given eventType within a session
func (ps *ServicePubSub) Unsubscribe(sessionID uuid.UUID, eventType EventType, subscriberID string) {
	subscriber, found := func() (Subscriber, bool) {
		ps.lock.Lock()
		defer ps.lock.Unlock()

		session, wasSessionFound := ps.sessions[sessionID]
		if !wasSessionFound {
			return nil, false
		}

		subscriberMap, wasSubscriberMapFound := session[eventType]
		if !wasSubscriberMapFound {
			return nil, false
		}

		subscriber, wasSubscriberFound := subscriberMap[subscriberID]
		if !wasSubscriberFound {
			return nil, false
		}

		delete(subscriberMap, subscriberID)

		if len(subscriberMap) == 0 {
			delete(session, eventType)
		}

		if len(session) == 0 {
			delete(ps.sessions, sessionID)
		}

		return subscriber, true
	}()
	if !found {
		return
	}

	subscriber.NotifyUnsubscribed(ps, sessionID)
}

// Publish dispatches an event and corresponding payload to all registered Subscriber entities
func (ps *ServicePubSub) Publish(sessionID uuid.UUID, eventType EventType, payload any) {
	subscribers := func() []Subscriber {
		ps.lock.Lock()
		defer ps.lock.Unlock()

		session, wasSessionFound := ps.sessions[sessionID]
		if !wasSessionFound {
			return nil
		}

		subscriberMap, wasSubscriberMapFound := session[eventType]
		if !wasSubscriberMapFound {
			return nil
		}

		// Copy subscribers to avoid holding lock during notifications
		subscribers := make([]Subscriber, 0, len(subscriberMap))
		for _, subscriber := range subscriberMap {
			subscribers = append(subscribers, subscriber)
		}
		return subscribers
	}()

	// Notify outside the lock to prevent deadlocks
	for _, subscriber := range subscribers {
		subscriber.Notify(payload)
	}
}

func (ps *ServicePubSub) awaitDisconnectUnregister(sessionID uuid.UUID, subscriberID string, eventType EventType, onDisconnect <-chan struct{}) {
	go func() {
		<-onDisconnect
		ps.Unsubscribe(sessionID, eventType, subscriberID)
	}()
}
