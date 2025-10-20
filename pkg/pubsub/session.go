package pubsub

// Session is a container to store information for a pubsub subset
type Session map[EventType]SubscriberMap
