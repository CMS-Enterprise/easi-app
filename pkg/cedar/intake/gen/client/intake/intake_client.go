// Code generated by go-swagger; DO NOT EDIT.

package intake

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"fmt"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/strfmt"
)

// New creates a new intake API client.
func New(transport runtime.ClientTransport, formats strfmt.Registry) ClientService {
	return &Client{transport: transport, formats: formats}
}

/*
Client for intake API
*/
type Client struct {
	transport runtime.ClientTransport
	formats   strfmt.Registry
}

// ClientOption is the option for Client methods
type ClientOption func(*runtime.ClientOperation)

// ClientService is the interface for Client methods
type ClientService interface {
	IntakeAdd(params *IntakeAddParams, authInfo runtime.ClientAuthInfoWriter, opts ...ClientOption) (*IntakeAddOK, error)

	IntakeFindByCedarID(params *IntakeFindByCedarIDParams, authInfo runtime.ClientAuthInfoWriter, opts ...ClientOption) (*IntakeFindByCedarIDOK, error)

	IntakeFindByClientID(params *IntakeFindByClientIDParams, authInfo runtime.ClientAuthInfoWriter, opts ...ClientOption) (*IntakeFindByClientIDOK, error)

	IntakeStatusByCedarID(params *IntakeStatusByCedarIDParams, authInfo runtime.ClientAuthInfoWriter, opts ...ClientOption) (*IntakeStatusByCedarIDOK, error)

	IntakeStatusByClientID(params *IntakeStatusByClientIDParams, authInfo runtime.ClientAuthInfoWriter, opts ...ClientOption) (*IntakeStatusByClientIDOK, error)

	IntakeStatusFindList(params *IntakeStatusFindListParams, authInfo runtime.ClientAuthInfoWriter, opts ...ClientOption) (*IntakeStatusFindListOK, error)

	SetTransport(transport runtime.ClientTransport)
}

/*
  IntakeAdd adds an intake

  Add an intake
*/
func (a *Client) IntakeAdd(params *IntakeAddParams, authInfo runtime.ClientAuthInfoWriter, opts ...ClientOption) (*IntakeAddOK, error) {
	// TODO: Validate the params before sending
	if params == nil {
		params = NewIntakeAddParams()
	}
	op := &runtime.ClientOperation{
		ID:                 "intakeAdd",
		Method:             "POST",
		PathPattern:        "/intake",
		ProducesMediaTypes: []string{"application/json"},
		ConsumesMediaTypes: []string{"application/json"},
		Schemes:            []string{"https"},
		Params:             params,
		Reader:             &IntakeAddReader{formats: a.formats},
		AuthInfo:           authInfo,
		Context:            params.Context,
		Client:             params.HTTPClient,
	}
	for _, opt := range opts {
		opt(op)
	}

	result, err := a.transport.Submit(op)
	if err != nil {
		return nil, err
	}
	success, ok := result.(*IntakeAddOK)
	if ok {
		return success, nil
	}
	// unexpected success response
	// safeguard: normally, absent a default response, unknown success responses return an error above: so this is a codegen issue
	msg := fmt.Sprintf("unexpected success response for intakeAdd: API contract not enforced by server. Client expected to get an error, but got: %T", result)
	panic(msg)
}

/*
  IntakeFindByCedarID retrieves an intake based on a c e d a r ID

  Retrieve an intake based on a CEDAR ID
*/
func (a *Client) IntakeFindByCedarID(params *IntakeFindByCedarIDParams, authInfo runtime.ClientAuthInfoWriter, opts ...ClientOption) (*IntakeFindByCedarIDOK, error) {
	// TODO: Validate the params before sending
	if params == nil {
		params = NewIntakeFindByCedarIDParams()
	}
	op := &runtime.ClientOperation{
		ID:                 "intakeFindByCedarId",
		Method:             "GET",
		PathPattern:        "/intake/cedar/{id}",
		ProducesMediaTypes: []string{"application/json"},
		ConsumesMediaTypes: []string{"application/json"},
		Schemes:            []string{"https"},
		Params:             params,
		Reader:             &IntakeFindByCedarIDReader{formats: a.formats},
		AuthInfo:           authInfo,
		Context:            params.Context,
		Client:             params.HTTPClient,
	}
	for _, opt := range opts {
		opt(op)
	}

	result, err := a.transport.Submit(op)
	if err != nil {
		return nil, err
	}
	success, ok := result.(*IntakeFindByCedarIDOK)
	if ok {
		return success, nil
	}
	// unexpected success response
	// safeguard: normally, absent a default response, unknown success responses return an error above: so this is a codegen issue
	msg := fmt.Sprintf("unexpected success response for intakeFindByCedarId: API contract not enforced by server. Client expected to get an error, but got: %T", result)
	panic(msg)
}

/*
  IntakeFindByClientID retrieves an intake based on a client ID

  Retrieve an intake based on a client ID
*/
func (a *Client) IntakeFindByClientID(params *IntakeFindByClientIDParams, authInfo runtime.ClientAuthInfoWriter, opts ...ClientOption) (*IntakeFindByClientIDOK, error) {
	// TODO: Validate the params before sending
	if params == nil {
		params = NewIntakeFindByClientIDParams()
	}
	op := &runtime.ClientOperation{
		ID:                 "intakeFindByClientId",
		Method:             "GET",
		PathPattern:        "/intake/client/{id}",
		ProducesMediaTypes: []string{"application/json"},
		ConsumesMediaTypes: []string{"application/json"},
		Schemes:            []string{"https"},
		Params:             params,
		Reader:             &IntakeFindByClientIDReader{formats: a.formats},
		AuthInfo:           authInfo,
		Context:            params.Context,
		Client:             params.HTTPClient,
	}
	for _, opt := range opts {
		opt(op)
	}

	result, err := a.transport.Submit(op)
	if err != nil {
		return nil, err
	}
	success, ok := result.(*IntakeFindByClientIDOK)
	if ok {
		return success, nil
	}
	// unexpected success response
	// safeguard: normally, absent a default response, unknown success responses return an error above: so this is a codegen issue
	msg := fmt.Sprintf("unexpected success response for intakeFindByClientId: API contract not enforced by server. Client expected to get an error, but got: %T", result)
	panic(msg)
}

/*
  IntakeStatusByCedarID retrieves an intake status based on a c e d a r ID

  Retrieve an intake status based on a CEDAR ID
*/
func (a *Client) IntakeStatusByCedarID(params *IntakeStatusByCedarIDParams, authInfo runtime.ClientAuthInfoWriter, opts ...ClientOption) (*IntakeStatusByCedarIDOK, error) {
	// TODO: Validate the params before sending
	if params == nil {
		params = NewIntakeStatusByCedarIDParams()
	}
	op := &runtime.ClientOperation{
		ID:                 "intakeStatusByCedarId",
		Method:             "GET",
		PathPattern:        "/intake/status/cedar/{id}",
		ProducesMediaTypes: []string{"application/json"},
		ConsumesMediaTypes: []string{"application/json"},
		Schemes:            []string{"https"},
		Params:             params,
		Reader:             &IntakeStatusByCedarIDReader{formats: a.formats},
		AuthInfo:           authInfo,
		Context:            params.Context,
		Client:             params.HTTPClient,
	}
	for _, opt := range opts {
		opt(op)
	}

	result, err := a.transport.Submit(op)
	if err != nil {
		return nil, err
	}
	success, ok := result.(*IntakeStatusByCedarIDOK)
	if ok {
		return success, nil
	}
	// unexpected success response
	// safeguard: normally, absent a default response, unknown success responses return an error above: so this is a codegen issue
	msg := fmt.Sprintf("unexpected success response for intakeStatusByCedarId: API contract not enforced by server. Client expected to get an error, but got: %T", result)
	panic(msg)
}

/*
  IntakeStatusByClientID retrieves an intake status based on a client ID

  Retrieve an intake status based on a client ID
*/
func (a *Client) IntakeStatusByClientID(params *IntakeStatusByClientIDParams, authInfo runtime.ClientAuthInfoWriter, opts ...ClientOption) (*IntakeStatusByClientIDOK, error) {
	// TODO: Validate the params before sending
	if params == nil {
		params = NewIntakeStatusByClientIDParams()
	}
	op := &runtime.ClientOperation{
		ID:                 "intakeStatusByClientId",
		Method:             "GET",
		PathPattern:        "/intake/status/client/{id}",
		ProducesMediaTypes: []string{"application/json"},
		ConsumesMediaTypes: []string{"application/json"},
		Schemes:            []string{"https"},
		Params:             params,
		Reader:             &IntakeStatusByClientIDReader{formats: a.formats},
		AuthInfo:           authInfo,
		Context:            params.Context,
		Client:             params.HTTPClient,
	}
	for _, opt := range opts {
		opt(op)
	}

	result, err := a.transport.Submit(op)
	if err != nil {
		return nil, err
	}
	success, ok := result.(*IntakeStatusByClientIDOK)
	if ok {
		return success, nil
	}
	// unexpected success response
	// safeguard: normally, absent a default response, unknown success responses return an error above: so this is a codegen issue
	msg := fmt.Sprintf("unexpected success response for intakeStatusByClientId: API contract not enforced by server. Client expected to get an error, but got: %T", result)
	panic(msg)
}

/*
  IntakeStatusFindList retrieves an array of intake statuses based on search criteria

  Retrieve a list of intake statuses based on search criteria
*/
func (a *Client) IntakeStatusFindList(params *IntakeStatusFindListParams, authInfo runtime.ClientAuthInfoWriter, opts ...ClientOption) (*IntakeStatusFindListOK, error) {
	// TODO: Validate the params before sending
	if params == nil {
		params = NewIntakeStatusFindListParams()
	}
	op := &runtime.ClientOperation{
		ID:                 "intakeStatusFindList",
		Method:             "GET",
		PathPattern:        "/intake/status",
		ProducesMediaTypes: []string{"application/json"},
		ConsumesMediaTypes: []string{"application/json"},
		Schemes:            []string{"https"},
		Params:             params,
		Reader:             &IntakeStatusFindListReader{formats: a.formats},
		AuthInfo:           authInfo,
		Context:            params.Context,
		Client:             params.HTTPClient,
	}
	for _, opt := range opts {
		opt(op)
	}

	result, err := a.transport.Submit(op)
	if err != nil {
		return nil, err
	}
	success, ok := result.(*IntakeStatusFindListOK)
	if ok {
		return success, nil
	}
	// unexpected success response
	// safeguard: normally, absent a default response, unknown success responses return an error above: so this is a codegen issue
	msg := fmt.Sprintf("unexpected success response for intakeStatusFindList: API contract not enforced by server. Client expected to get an error, but got: %T", result)
	panic(msg)
}

// SetTransport changes the transport on the client
func (a *Client) SetTransport(transport runtime.ClientTransport) {
	a.transport = transport
}
