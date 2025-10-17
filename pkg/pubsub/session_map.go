package pubsub

import "github.com/google/uuid"

// SessionMap is a collection defining the subset of sessions in a subscription model
type SessionMap map[uuid.UUID]Session
