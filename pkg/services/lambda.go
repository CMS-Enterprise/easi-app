package services

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/lambda"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
)

type generateRequest struct {
	HTML string `json:"html"`
}

type generateResponse struct {
	Content []byte `json:"content"`
}

// NewInvokeGeneratePDF returns a function that saves the metadata of an uploaded file
func NewInvokeGeneratePDF(config Config, client *lambda.Lambda, functionName string) func(cxt context.Context, html string) ([]byte, error) {
	return func(ctx context.Context, html string) ([]byte, error) {
		appcontext.ZLogger(ctx).Info("making request to lambda")

		request := generateRequest{
			HTML: html,
		}
		payload, marshalErr := json.Marshal(request)
		if marshalErr != nil {
			return nil, fmt.Errorf("error marshaling generateRequest: %w", marshalErr)
		}

		result, invokeErr := client.Invoke(&lambda.InvokeInput{FunctionName: aws.String(functionName), Payload: payload})
		if invokeErr != nil {
			return nil, fmt.Errorf("error invoking lambda: %w", invokeErr)
		}

		appcontext.ZLogger(ctx).Info("response from lambda", zap.Int64p("statusCode", result.StatusCode), zap.String("version", *result.ExecutedVersion), zap.Int("payloadLength", len(result.Payload)))

		if *result.StatusCode != 200 {
			return nil, fmt.Errorf("error invoking lambda: %v", result.Payload)
		}

		var generated generateResponse
		jsonErr := json.Unmarshal(result.Payload, &generated)
		if jsonErr != nil {
			return nil, fmt.Errorf("error unmarshaling generateResponse: %w", jsonErr)
		}

		return generated.Content, nil
	}
}
