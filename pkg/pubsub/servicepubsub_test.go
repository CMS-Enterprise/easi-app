package pubsub_test

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/local/pubsubmock"
	"github.com/cms-enterprise/easi-app/pkg/pubsub"
)

func TestPubSubImplementation_Publish(t *testing.T) {
	ps := pubsub.NewServicePubSub()

	modelPlanID, _ := uuid.Parse("ce3405a0-3399-4e3a-88d7-3cfc613d2905")
	eventType := pubsubmock.MockEvent
	payload := "test"
	disconnectChannel := make(chan struct{})

	// Create a mock subscriber
	principal := &authentication.EUAPrincipal{
		EUAID: "TEST_USER",
	}
	subscriber := pubsubmock.NewMockSubscriber("MOCK_SUBSCRIBER", principal)

	// Subscribe the mock subscriber
	ps.Subscribe(modelPlanID, eventType, subscriber, disconnectChannel)

	// Publish a message
	ps.Publish(modelPlanID, eventType, payload)

	// Verify the subscriber received the notification
	assert.Len(t, subscriber.NotifyCalls, 1, "expected one notification")
	assert.Equal(t, payload, subscriber.NotifyCalls[0], "payload should match")
}

func TestPubSubImplementation_Unsubscribe(t *testing.T) {
	ps := pubsub.NewServicePubSub()

	modelPlanID, _ := uuid.Parse("ce3405a0-3399-4e3a-88d7-3cfc613d2905")
	eventType := pubsubmock.MockEvent
	payload := "test"
	disconnectChannel := make(chan struct{})

	// Create a mock subscriber
	principal := &authentication.EUAPrincipal{
		EUAID: "TEST_USER",
	}
	subscriber := pubsubmock.NewMockSubscriber("MOCK_SUBSCRIBER", principal)

	// Subscribe the mock subscriber
	ps.Subscribe(modelPlanID, eventType, subscriber, disconnectChannel)

	// Unsubscribe
	ps.Unsubscribe(modelPlanID, eventType, subscriber.GetID())

	// Verify NotifyUnsubscribed was called
	assert.Len(t, subscriber.NotifyUnsubscribedCalls, 1, "expected NotifyUnsubscribed to be called")

	// Publish a message after unsubscribe - should not be received
	ps.Publish(modelPlanID, eventType, payload)

	// Verify no additional notifications were received
	assert.Empty(t, subscriber.NotifyCalls, "should not receive notifications after unsubscribe")
}

func TestMockPubSub(t *testing.T) {
	mockPS := pubsubmock.NewMockPubSub()

	modelPlanID, _ := uuid.Parse("ce3405a0-3399-4e3a-88d7-3cfc613d2905")
	eventType := pubsubmock.MockEvent
	payload := "test"
	disconnectChannel := make(chan struct{})

	principal := &authentication.EUAPrincipal{
		EUAID: "TEST_USER",
	}
	subscriber := pubsubmock.NewMockSubscriber("MOCK_SUBSCRIBER", principal)

	// Test Subscribe
	mockPS.Subscribe(modelPlanID, eventType, subscriber, disconnectChannel)
	assert.Len(t, mockPS.SubscribeCalls, 1, "expected one Subscribe call")

	// Test Publish
	mockPS.Publish(modelPlanID, eventType, payload)
	assert.Len(t, mockPS.PublishCalls, 1, "expected one Publish call")
	assert.Equal(t, payload, mockPS.PublishCalls[0].Payload, "payload should match")

	// Test Unsubscribe
	mockPS.Unsubscribe(modelPlanID, eventType, subscriber.GetID())
	assert.Len(t, mockPS.UnsubscribeCalls, 1, "expected one Unsubscribe call")
}
