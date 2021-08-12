package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"

	"github.com/cmsgov/easi-app/pkg/apperrors"
)

type namedRequestWithdraw struct {
	RequestName string
}

func (c Client) withdrawNamedRequestBody(requestName string) (string, error) {
	data := namedRequestWithdraw{
		RequestName: requestName,
	}
	var b bytes.Buffer
	if c.templates.namedRequestWithdrawTemplate == nil {
		return "", errors.New("withdraw named request template is nil")
	}
	err := c.templates.namedRequestWithdrawTemplate.Execute(&b, data)
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

type unnamedRequestWithdraw struct{}

func (c Client) withdrawUnnamedRequestBody() (string, error) {
	var b bytes.Buffer
	if c.templates.unnamedRequestWithdrawTemplate == nil {
		return "", errors.New("withdraw unnamed request template is nil")
	}

	err := c.templates.unnamedRequestWithdrawTemplate.Execute(&b, unnamedRequestWithdraw{})
	if err != nil {
		return "", err
	}
	return b.String(), nil
}

// SendWithdrawRequestEmail sends an email for a submitted system intake
func (c Client) SendWithdrawRequestEmail(ctx context.Context, requestName string) error {
	var subject, body string
	var err error
	if requestName == "" {
		subject = "Request Withdrawn"
		body, err = c.withdrawUnnamedRequestBody()
	} else {
		subject = fmt.Sprintf("Request Withdrawn: %s", requestName)
		body, err = c.withdrawNamedRequestBody(requestName)
	}
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	err = c.sender.Send(
		ctx,
		c.config.GRTEmail,
		nil,
		subject,
		body,
	)
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}
	return nil
}
