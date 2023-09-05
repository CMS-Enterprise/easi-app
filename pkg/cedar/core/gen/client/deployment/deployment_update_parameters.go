// Code generated by go-swagger; DO NOT EDIT.

package deployment

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

// NewDeploymentUpdateParams creates a new DeploymentUpdateParams object,
// with the default timeout for this client.
//
// Default values are not hydrated, since defaults are normally applied by the API server side.
//
// To enforce default values in parameter, use SetDefaults or WithDefaults.
func NewDeploymentUpdateParams() *DeploymentUpdateParams {
	return &DeploymentUpdateParams{
		timeout: cr.DefaultTimeout,
	}
}

// NewDeploymentUpdateParamsWithTimeout creates a new DeploymentUpdateParams object
// with the ability to set a timeout on a request.
func NewDeploymentUpdateParamsWithTimeout(timeout time.Duration) *DeploymentUpdateParams {
	return &DeploymentUpdateParams{
		timeout: timeout,
	}
}

// NewDeploymentUpdateParamsWithContext creates a new DeploymentUpdateParams object
// with the ability to set a context for a request.
func NewDeploymentUpdateParamsWithContext(ctx context.Context) *DeploymentUpdateParams {
	return &DeploymentUpdateParams{
		Context: ctx,
	}
}

// NewDeploymentUpdateParamsWithHTTPClient creates a new DeploymentUpdateParams object
// with the ability to set a custom HTTPClient for a request.
func NewDeploymentUpdateParamsWithHTTPClient(client *http.Client) *DeploymentUpdateParams {
	return &DeploymentUpdateParams{
		HTTPClient: client,
	}
}

/*
DeploymentUpdateParams contains all the parameters to send to the API endpoint

	for the deployment update operation.

	Typically these are written to a http.Request.
*/
type DeploymentUpdateParams struct {

	// Body.
	Body *models.DeploymentUpdateRequest

	timeout    time.Duration
	Context    context.Context
	HTTPClient *http.Client
}

// WithDefaults hydrates default values in the deployment update params (not the query body).
//
// All values with no default are reset to their zero value.
func (o *DeploymentUpdateParams) WithDefaults() *DeploymentUpdateParams {
	o.SetDefaults()
	return o
}

// SetDefaults hydrates default values in the deployment update params (not the query body).
//
// All values with no default are reset to their zero value.
func (o *DeploymentUpdateParams) SetDefaults() {
	// no default values defined for this parameter
}

// WithTimeout adds the timeout to the deployment update params
func (o *DeploymentUpdateParams) WithTimeout(timeout time.Duration) *DeploymentUpdateParams {
	o.SetTimeout(timeout)
	return o
}

// SetTimeout adds the timeout to the deployment update params
func (o *DeploymentUpdateParams) SetTimeout(timeout time.Duration) {
	o.timeout = timeout
}

// WithContext adds the context to the deployment update params
func (o *DeploymentUpdateParams) WithContext(ctx context.Context) *DeploymentUpdateParams {
	o.SetContext(ctx)
	return o
}

// SetContext adds the context to the deployment update params
func (o *DeploymentUpdateParams) SetContext(ctx context.Context) {
	o.Context = ctx
}

// WithHTTPClient adds the HTTPClient to the deployment update params
func (o *DeploymentUpdateParams) WithHTTPClient(client *http.Client) *DeploymentUpdateParams {
	o.SetHTTPClient(client)
	return o
}

// SetHTTPClient adds the HTTPClient to the deployment update params
func (o *DeploymentUpdateParams) SetHTTPClient(client *http.Client) {
	o.HTTPClient = client
}

// WithBody adds the body to the deployment update params
func (o *DeploymentUpdateParams) WithBody(body *models.DeploymentUpdateRequest) *DeploymentUpdateParams {
	o.SetBody(body)
	return o
}

// SetBody adds the body to the deployment update params
func (o *DeploymentUpdateParams) SetBody(body *models.DeploymentUpdateRequest) {
	o.Body = body
}

// WriteToRequest writes these params to a swagger request
func (o *DeploymentUpdateParams) WriteToRequest(r runtime.ClientRequest, reg strfmt.Registry) error {

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
