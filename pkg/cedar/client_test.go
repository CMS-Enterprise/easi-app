package cedar

import (
	"fmt"
	"log"
	"os"
	"testing"

	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"

	apiclient "github.com/cmsgov/easi-app/pkg/cedar/gen/client"
)

func TestClient(t *testing.T) {
	// create the transport
	transport := httptransport.New(apiclient.DefaultHost, apiclient.DefaultBasePath, nil)
	transport.

	// create the API client, with the transport
	client := apiclient.New(transport, strfmt.Default)

	// Set auth header
	apiKeyHeaderAuth := httptransport.APIKeyAuth("x-Gateway-APIKey", "header", os.Getenv("CEDAR_API_KEY"))

	// make the request to get all items
	resp, err := client.BackendIs.ListGET2(nil, apiKeyHeaderAuth)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%#v\n", resp.Payload)
}
