// Code generated by go-swagger; DO NOT EDIT.

package exchange

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

// NewExchangeAddParams creates a new ExchangeAddParams object,
// with the default timeout for this client.
//
// Default values are not hydrated, since defaults are normally applied by the API server side.
//
// To enforce default values in parameter, use SetDefaults or WithDefaults.
func NewExchangeAddParams() *ExchangeAddParams {
	return &ExchangeAddParams{
		timeout: cr.DefaultTimeout,
	}
}

// NewExchangeAddParamsWithTimeout creates a new ExchangeAddParams object
// with the ability to set a timeout on a request.
func NewExchangeAddParamsWithTimeout(timeout time.Duration) *ExchangeAddParams {
	return &ExchangeAddParams{
		timeout: timeout,
	}
}

// NewExchangeAddParamsWithContext creates a new ExchangeAddParams object
// with the ability to set a context for a request.
func NewExchangeAddParamsWithContext(ctx context.Context) *ExchangeAddParams {
	return &ExchangeAddParams{
		Context: ctx,
	}
}

// NewExchangeAddParamsWithHTTPClient creates a new ExchangeAddParams object
// with the ability to set a custom HTTPClient for a request.
func NewExchangeAddParamsWithHTTPClient(client *http.Client) *ExchangeAddParams {
	return &ExchangeAddParams{
		HTTPClient: client,
	}
}

/* ExchangeAddParams contains all the parameters to send to the API endpoint
   for the exchange add operation.

   Typically these are written to a http.Request.
*/
type ExchangeAddParams struct {

	/* Body.

	   Data exchange array to be added to Alfabet.
	*/
	Body *models.ExchangeAddRequest

	timeout    time.Duration
	Context    context.Context
	HTTPClient *http.Client
}

// WithDefaults hydrates default values in the exchange add params (not the query body).
//
// All values with no default are reset to their zero value.
func (o *ExchangeAddParams) WithDefaults() *ExchangeAddParams {
	o.SetDefaults()
	return o
}

// SetDefaults hydrates default values in the exchange add params (not the query body).
//
// All values with no default are reset to their zero value.
func (o *ExchangeAddParams) SetDefaults() {
	// no default values defined for this parameter
}

// WithTimeout adds the timeout to the exchange add params
func (o *ExchangeAddParams) WithTimeout(timeout time.Duration) *ExchangeAddParams {
	o.SetTimeout(timeout)
	return o
}

// SetTimeout adds the timeout to the exchange add params
func (o *ExchangeAddParams) SetTimeout(timeout time.Duration) {
	o.timeout = timeout
}

// WithContext adds the context to the exchange add params
func (o *ExchangeAddParams) WithContext(ctx context.Context) *ExchangeAddParams {
	o.SetContext(ctx)
	return o
}

// SetContext adds the context to the exchange add params
func (o *ExchangeAddParams) SetContext(ctx context.Context) {
	o.Context = ctx
}

// WithHTTPClient adds the HTTPClient to the exchange add params
func (o *ExchangeAddParams) WithHTTPClient(client *http.Client) *ExchangeAddParams {
	o.SetHTTPClient(client)
	return o
}

// SetHTTPClient adds the HTTPClient to the exchange add params
func (o *ExchangeAddParams) SetHTTPClient(client *http.Client) {
	o.HTTPClient = client
}

// WithBody adds the body to the exchange add params
func (o *ExchangeAddParams) WithBody(body *models.ExchangeAddRequest) *ExchangeAddParams {
	o.SetBody(body)
	return o
}

// SetBody adds the body to the exchange add params
func (o *ExchangeAddParams) SetBody(body *models.ExchangeAddRequest) {
	o.Body = body
}

// WriteToRequest writes these params to a swagger request
func (o *ExchangeAddParams) WriteToRequest(r runtime.ClientRequest, reg strfmt.Registry) error {

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
