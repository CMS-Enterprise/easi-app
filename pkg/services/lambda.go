package services

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/lambda"

	"github.com/cmsgov/easi-app/pkg/appcontext"
)

type generateRequest struct {
	HTML string `json:"html"`
}

type generateResponse struct {
	Content []byte `json:"content"`
}

// NewInvokeGeneratePDF returns a function that saves the metadata of an uploaded file
func NewInvokeGeneratePDF(config Config, client *lambda.Lambda) func(cxt context.Context, html string) ([]byte, error) {
	return func(ctx context.Context, html string) ([]byte, error) {
		appcontext.ZLogger(ctx).Info("making request to lambda")

		var request generateRequest
		payload, marshalErr := json.Marshal(request)
		if marshalErr != nil {
			return nil, fmt.Errorf("error marshaling generateRequest: %w", marshalErr)
		}

		result, invokeErr := client.Invoke(&lambda.InvokeInput{FunctionName: aws.String("main"), Payload: payload})
		if invokeErr != nil {
			return nil, fmt.Errorf("error invoking lambda: %w", invokeErr)
		}

		var generated generateResponse
		jsonErr := json.Unmarshal(result.Payload, &generated)
		if jsonErr != nil {
			return nil, fmt.Errorf("error unmarshaling generateResponse: %w", jsonErr)
		}

		return generated.Content, nil
	}
}
