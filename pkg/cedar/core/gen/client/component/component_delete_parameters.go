// Code generated by go-swagger; DO NOT EDIT.

package component

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
)

// NewComponentDeleteParams creates a new ComponentDeleteParams object,
// with the default timeout for this client.
//
// Default values are not hydrated, since defaults are normally applied by the API server side.
//
// To enforce default values in parameter, use SetDefaults or WithDefaults.
func NewComponentDeleteParams() *ComponentDeleteParams {
	return &ComponentDeleteParams{
		timeout: cr.DefaultTimeout,
	}
}

// NewComponentDeleteParamsWithTimeout creates a new ComponentDeleteParams object
// with the ability to set a timeout on a request.
func NewComponentDeleteParamsWithTimeout(timeout time.Duration) *ComponentDeleteParams {
	return &ComponentDeleteParams{
		timeout: timeout,
	}
}

// NewComponentDeleteParamsWithContext creates a new ComponentDeleteParams object
// with the ability to set a context for a request.
func NewComponentDeleteParamsWithContext(ctx context.Context) *ComponentDeleteParams {
	return &ComponentDeleteParams{
		Context: ctx,
	}
}

// NewComponentDeleteParamsWithHTTPClient creates a new ComponentDeleteParams object
// with the ability to set a custom HTTPClient for a request.
func NewComponentDeleteParamsWithHTTPClient(client *http.Client) *ComponentDeleteParams {
	return &ComponentDeleteParams{
		HTTPClient: client,
	}
}

/* ComponentDeleteParams contains all the parameters to send to the API endpoint
   for the component delete operation.

   Typically these are written to a http.Request.
*/
type ComponentDeleteParams struct {

	/* ComponentID.

	   ID of the component to deleted.
	*/
	ComponentID string

	timeout    time.Duration
	Context    context.Context
	HTTPClient *http.Client
}

// WithDefaults hydrates default values in the component delete params (not the query body).
//
// All values with no default are reset to their zero value.
func (o *ComponentDeleteParams) WithDefaults() *ComponentDeleteParams {
	o.SetDefaults()
	return o
}

// SetDefaults hydrates default values in the component delete params (not the query body).
//
// All values with no default are reset to their zero value.
func (o *ComponentDeleteParams) SetDefaults() {
	// no default values defined for this parameter
}

// WithTimeout adds the timeout to the component delete params
func (o *ComponentDeleteParams) WithTimeout(timeout time.Duration) *ComponentDeleteParams {
	o.SetTimeout(timeout)
	return o
}

// SetTimeout adds the timeout to the component delete params
func (o *ComponentDeleteParams) SetTimeout(timeout time.Duration) {
	o.timeout = timeout
}

// WithContext adds the context to the component delete params
func (o *ComponentDeleteParams) WithContext(ctx context.Context) *ComponentDeleteParams {
	o.SetContext(ctx)
	return o
}

// SetContext adds the context to the component delete params
func (o *ComponentDeleteParams) SetContext(ctx context.Context) {
	o.Context = ctx
}

// WithHTTPClient adds the HTTPClient to the component delete params
func (o *ComponentDeleteParams) WithHTTPClient(client *http.Client) *ComponentDeleteParams {
	o.SetHTTPClient(client)
	return o
}

// SetHTTPClient adds the HTTPClient to the component delete params
func (o *ComponentDeleteParams) SetHTTPClient(client *http.Client) {
	o.HTTPClient = client
}

// WithComponentID adds the componentID to the component delete params
func (o *ComponentDeleteParams) WithComponentID(componentID string) *ComponentDeleteParams {
	o.SetComponentID(componentID)
	return o
}

// SetComponentID adds the componentId to the component delete params
func (o *ComponentDeleteParams) SetComponentID(componentID string) {
	o.ComponentID = componentID
}

// WriteToRequest writes these params to a swagger request
func (o *ComponentDeleteParams) WriteToRequest(r runtime.ClientRequest, reg strfmt.Registry) error {

	if err := r.SetTimeout(o.timeout); err != nil {
		return err
	}
	var res []error

	// query param componentId
	qrComponentID := o.ComponentID
	qComponentID := qrComponentID
	if qComponentID != "" {

		if err := r.SetQueryParam("componentId", qComponentID); err != nil {
			return err
		}
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}
