// Code generated by go-swagger; DO NOT EDIT.

package contract

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"
	"net/http"
	"time"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime"
	cr "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"

	"github.com/cmsgov/easi-app/pkg/cedar/core/gen/models"
)

// NewContractAddParams creates a new ContractAddParams object,
// with the default timeout for this client.
//
// Default values are not hydrated, since defaults are normally applied by the API server side.
//
// To enforce default values in parameter, use SetDefaults or WithDefaults.
func NewContractAddParams() *ContractAddParams {
	return &ContractAddParams{
		timeout: cr.DefaultTimeout,
	}
}

// NewContractAddParamsWithTimeout creates a new ContractAddParams object
// with the ability to set a timeout on a request.
func NewContractAddParamsWithTimeout(timeout time.Duration) *ContractAddParams {
	return &ContractAddParams{
		timeout: timeout,
	}
}

// NewContractAddParamsWithContext creates a new ContractAddParams object
// with the ability to set a context for a request.
func NewContractAddParamsWithContext(ctx context.Context) *ContractAddParams {
	return &ContractAddParams{
		Context: ctx,
	}
}

// NewContractAddParamsWithHTTPClient creates a new ContractAddParams object
// with the ability to set a custom HTTPClient for a request.
func NewContractAddParamsWithHTTPClient(client *http.Client) *ContractAddParams {
	return &ContractAddParams{
		HTTPClient: client,
	}
}

/* ContractAddParams contains all the parameters to send to the API endpoint
   for the contract add operation.

   Typically these are written to a http.Request.
*/
type ContractAddParams struct {

	/* Body.

	   An array of Contracts to be added to CEDAR Alfabet.
	*/
	Body *models.ContractAddRequest

	timeout    time.Duration
	Context    context.Context
	HTTPClient *http.Client
}

// WithDefaults hydrates default values in the contract add params (not the query body).
//
// All values with no default are reset to their zero value.
func (o *ContractAddParams) WithDefaults() *ContractAddParams {
	o.SetDefaults()
	return o
}

// SetDefaults hydrates default values in the contract add params (not the query body).
//
// All values with no default are reset to their zero value.
func (o *ContractAddParams) SetDefaults() {
	// no default values defined for this parameter
}

// WithTimeout adds the timeout to the contract add params
func (o *ContractAddParams) WithTimeout(timeout time.Duration) *ContractAddParams {
	o.SetTimeout(timeout)
	return o
}

// SetTimeout adds the timeout to the contract add params
func (o *ContractAddParams) SetTimeout(timeout time.Duration) {
	o.timeout = timeout
}

// WithContext adds the context to the contract add params
func (o *ContractAddParams) WithContext(ctx context.Context) *ContractAddParams {
	o.SetContext(ctx)
	return o
}

// SetContext adds the context to the contract add params
func (o *ContractAddParams) SetContext(ctx context.Context) {
	o.Context = ctx
}

// WithHTTPClient adds the HTTPClient to the contract add params
func (o *ContractAddParams) WithHTTPClient(client *http.Client) *ContractAddParams {
	o.SetHTTPClient(client)
	return o
}

// SetHTTPClient adds the HTTPClient to the contract add params
func (o *ContractAddParams) SetHTTPClient(client *http.Client) {
	o.HTTPClient = client
}

// WithBody adds the body to the contract add params
func (o *ContractAddParams) WithBody(body *models.ContractAddRequest) *ContractAddParams {
	o.SetBody(body)
	return o
}

// SetBody adds the body to the contract add params
func (o *ContractAddParams) SetBody(body *models.ContractAddRequest) {
	o.Body = body
}

// WriteToRequest writes these params to a swagger request
func (o *ContractAddParams) WriteToRequest(r runtime.ClientRequest, reg strfmt.Registry) error {

	if err := r.SetTimeout(o.timeout); err != nil {
		return err
	}
	var res []error
	if o.Body != nil {
		if err := r.SetBodyParam(o.Body); err != nil {
			return err
		}
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}
