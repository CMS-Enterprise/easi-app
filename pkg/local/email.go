package local

import (
	"context"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewSender returns a fake email sender
func NewSender() Sender {
	return Sender{}
}

// Sender is a mock email sender for local environments
type Sender struct {
}

// Send logs an email
func (s Sender) Send(ctx context.Context, toAddress models.EmailAddress, subject string, body string) error {
	appcontext.ZLogger(ctx).Info("Mock sending email",
		zap.String("To", toAddress.String()),
		zap.String("Subject", subject),
		zap.String("Body", body),
	)
	return nil
}
