package pubsub_test

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/suite"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/local/pubsubmock"
	"github.com/cms-enterprise/easi-app/pkg/pubsub"
)

type PubSubTestSuite struct {
	suite.Suite
}

func TestPubSubTestSuite(t *testing.T) {
	suite.Run(t, new(PubSubTestSuite))
}

// setupTestData creates common test fixtures used across multiple tests
func (s *PubSubTestSuite) setupTestData() (uuid.UUID, pubsub.EventType, string, chan struct{}, *authentication.EUAPrincipal, *pubsubmock.MockSubscriber) {
	sessionID := uuid.MustParse("ce3405a0-3399-4e3a-88d7-3cfc613d2905")
	eventType := pubsubmock.MockEvent
	payload := "test"
	disconnectChannel := make(chan struct{})

	principal := &authentication.EUAPrincipal{
		EUAID: "ABCD",
	}
	subscriber := pubsubmock.NewMockSubscriber("mock-subscriber-1", principal)

	return sessionID, eventType, payload, disconnectChannel, principal, subscriber
}

func (s *PubSubTestSuite) TestPubSubImplementation_Publish() {
	ps := pubsub.NewServicePubSub()

	sessionID, eventType, payload, disconnectChannel, _, subscriber := s.setupTestData()

	// Subscribe the mock subscriber
	ps.Subscribe(sessionID, eventType, subscriber, disconnectChannel)

	// Publish a message
	ps.Publish(sessionID, eventType, payload)

	// Verify the subscriber received the notification
	s.Len(subscriber.NotifyCalls, 1, "expected one notification")
	s.Equal(payload, subscriber.NotifyCalls[0], "payload should match")
}

func (s *PubSubTestSuite) TestPubSubImplementation_Unsubscribe() {
	ps := pubsub.NewServicePubSub()

	sessionID, eventType, payload, disconnectChannel, _, subscriber := s.setupTestData()

	// Subscribe the mock subscriber
	ps.Subscribe(sessionID, eventType, subscriber, disconnectChannel)

	// Unsubscribe
	ps.Unsubscribe(sessionID, eventType, subscriber.GetID())

	// Verify NotifyUnsubscribed was called
	s.Len(subscriber.NotifyUnsubscribedCalls, 1, "expected NotifyUnsubscribed to be called")

	// Publish a message after unsubscribe - should not be received
	ps.Publish(sessionID, eventType, payload)

	// Verify no additional notifications were received
	s.Empty(subscriber.NotifyCalls, "should not receive notifications after unsubscribe")
}

func (s *PubSubTestSuite) TestMockPubSub() {
	mockPS := pubsubmock.NewMockPubSub()

	sessionID, eventType, payload, disconnectChannel, _, subscriber := s.setupTestData()

	// Test Subscribe
	mockPS.Subscribe(sessionID, eventType, subscriber, disconnectChannel)
	s.Len(mockPS.SubscribeCalls, 1, "expected one Subscribe call")

	// Test Publish
	mockPS.Publish(sessionID, eventType, payload)
	s.Len(mockPS.PublishCalls, 1, "expected one Publish call")
	s.Equal(payload, mockPS.PublishCalls[0].Payload, "payload should match")

	// Test Unsubscribe
	mockPS.Unsubscribe(sessionID, eventType, subscriber.GetID())
	s.Len(mockPS.UnsubscribeCalls, 1, "expected one Unsubscribe call")
}
