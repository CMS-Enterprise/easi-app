package local

import (
	"go.uber.org/zap"
)

// NewSender returns a fake email sender
func NewSender(logger *zap.Logger) Sender {
	return Sender{
		logger: logger,
	}
}

// Sender is a mock email sender for local environments
type Sender struct {
	logger *zap.Logger
}

// Send logs an email
func (s Sender) Send(toAddress string, subject string, body string) error {
	s.logger.Info("Mock sending email",
		zap.String("To", toAddress),
		zap.String("Subject", subject),
		zap.String("Body", body),
	)
	return nil
}
