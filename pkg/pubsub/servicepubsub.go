package pubsub

import (
	"sync"

	"github.com/google/uuid"
)

// ServicePubSub is a PubSub service implementation boxing communication by Session
type ServicePubSub struct {
	sessions SessionMap
	lock     sync.Mutex
}

// NewServicePubSub is a constructor to create a new instance of a PubSub service
func NewServicePubSub() *ServicePubSub {
	return &ServicePubSub{
		sessions: make(SessionMap),
	}
}

// Subscribe will register the subscriber for notifications of a given eventType within a session
func (ps *ServicePubSub) Subscribe(sessionID uuid.UUID, eventType EventType, subscriber Subscriber, onDisconnect <-chan struct{}) {
	session, found := ps.sessions[sessionID]
	if !found {
		session = ps.createSession(sessionID)
	}

	subscriberMap, found := session[eventType]
	if !found {
		subscriberMap = ps.createSubscriberMap(session, eventType)
	}

	ps.assignSubscriber(subscriberMap, subscriber)
	ps.awaitDisconnectUnregister(sessionID, subscriber.GetID(), eventType, onDisconnect)
}

// Unsubscribe unregisters a subscriber from notifications of a given eventType within a session
func (ps *ServicePubSub) Unsubscribe(sessionID uuid.UUID, eventType EventType, subscriberID string) {
	session, wasSessionFound := ps.findSession(sessionID)
	if !wasSessionFound {
		return
	}

	subscriberMap, wasSubscriberMapFound := session[eventType]
	if !wasSubscriberMapFound {
		return
	}

	subscriber, wasSubscriberFound := subscriberMap[subscriberID]
	if !wasSubscriberFound {
		return
	}

	ps.deleteSubscriber(subscriberMap, subscriberID)

	subscriber.NotifyUnsubscribed(ps, sessionID)

	if len(subscriberMap) == 0 {
		delete(session, eventType)
	}

	if len(session) == 0 {
		delete(ps.sessions, sessionID)
	}
}

// Publish dispatches an event and corresponding payload to all registered Subscriber entities
func (ps *ServicePubSub) Publish(sessionID uuid.UUID, eventType EventType, payload interface{}) {
	session, wasSessionFound := ps.findSession(sessionID)
	if !wasSessionFound {
		return
	}

	subscriberMap, wasSubscriberMapFound := session[eventType]
	if !wasSubscriberMapFound {
		return
	}

	for _, subscriber := range subscriberMap {
		subscriber.Notify(payload)
	}
}

func (ps *ServicePubSub) createSession(sessionID uuid.UUID) Session {
	session := make(Session)
	ps.lock.Lock()
	ps.sessions[sessionID] = session
	ps.lock.Unlock()
	return session
}

func (ps *ServicePubSub) findSession(sessionID uuid.UUID) (Session, bool) {
	session, found := ps.sessions[sessionID]
	return session, found
}

func (ps *ServicePubSub) assignSubscriber(subscriberMap SubscriberMap, subscriber Subscriber) {
	ps.lock.Lock()
	subscriberMap[subscriber.GetID()] = subscriber
	ps.lock.Unlock()
}

func (ps *ServicePubSub) createSubscriberMap(session Session, eventType EventType) SubscriberMap {
	eventListeners := make(SubscriberMap)
	ps.lock.Lock()
	session[eventType] = eventListeners
	ps.lock.Unlock()
	return eventListeners
}

func (ps *ServicePubSub) deleteSubscriber(subscriberMap SubscriberMap, subscriberID string) {
	ps.lock.Lock()
	delete(subscriberMap, subscriberID)
	ps.lock.Unlock()
}

func (ps *ServicePubSub) awaitDisconnectUnregister(sessionID uuid.UUID, subscriberID string, eventType EventType, onDisconnect <-chan struct{}) {
	go func() {
		<-onDisconnect
		ps.Unsubscribe(sessionID, eventType, subscriberID)
	}()
}
