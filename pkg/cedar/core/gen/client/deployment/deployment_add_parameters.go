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

// NewDeploymentAddParams creates a new DeploymentAddParams object,
// with the default timeout for this client.
//
// Default values are not hydrated, since defaults are normally applied by the API server side.
//
// To enforce default values in parameter, use SetDefaults or WithDefaults.
func NewDeploymentAddParams() *DeploymentAddParams {
	return &DeploymentAddParams{
		timeout: cr.DefaultTimeout,
	}
}

// NewDeploymentAddParamsWithTimeout creates a new DeploymentAddParams object
// with the ability to set a timeout on a request.
func NewDeploymentAddParamsWithTimeout(timeout time.Duration) *DeploymentAddParams {
	return &DeploymentAddParams{
		timeout: timeout,
	}
}

// NewDeploymentAddParamsWithContext creates a new DeploymentAddParams object
// with the ability to set a context for a request.
func NewDeploymentAddParamsWithContext(ctx context.Context) *DeploymentAddParams {
	return &DeploymentAddParams{
		Context: ctx,
	}
}

// NewDeploymentAddParamsWithHTTPClient creates a new DeploymentAddParams object
// with the ability to set a custom HTTPClient for a request.
func NewDeploymentAddParamsWithHTTPClient(client *http.Client) *DeploymentAddParams {
	return &DeploymentAddParams{
		HTTPClient: client,
	}
}

/*
DeploymentAddParams contains all the parameters to send to the API endpoint

	for the deployment add operation.

	Typically these are written to a http.Request.
*/
type DeploymentAddParams struct {

	/* Body.

	   Deployment list to be added to CEDAR
	*/
	Body *models.DeploymentAddRequest

	timeout    time.Duration
	Context    context.Context
	HTTPClient *http.Client
}

// WithDefaults hydrates default values in the deployment add params (not the query body).
//
// All values with no default are reset to their zero value.
func (o *DeploymentAddParams) WithDefaults() *DeploymentAddParams {
	o.SetDefaults()
	return o
}

// SetDefaults hydrates default values in the deployment add params (not the query body).
//
// All values with no default are reset to their zero value.
func (o *DeploymentAddParams) SetDefaults() {
	// no default values defined for this parameter
}

// WithTimeout adds the timeout to the deployment add params
func (o *DeploymentAddParams) WithTimeout(timeout time.Duration) *DeploymentAddParams {
	o.SetTimeout(timeout)
	return o
}

// SetTimeout adds the timeout to the deployment add params
func (o *DeploymentAddParams) SetTimeout(timeout time.Duration) {
	o.timeout = timeout
}

// WithContext adds the context to the deployment add params
func (o *DeploymentAddParams) WithContext(ctx context.Context) *DeploymentAddParams {
	o.SetContext(ctx)
	return o
}

// SetContext adds the context to the deployment add params
func (o *DeploymentAddParams) SetContext(ctx context.Context) {
	o.Context = ctx
}

// WithHTTPClient adds the HTTPClient to the deployment add params
func (o *DeploymentAddParams) WithHTTPClient(client *http.Client) *DeploymentAddParams {
	o.SetHTTPClient(client)
	return o
}

// SetHTTPClient adds the HTTPClient to the deployment add params
func (o *DeploymentAddParams) SetHTTPClient(client *http.Client) {
	o.HTTPClient = client
}

// WithBody adds the body to the deployment add params
func (o *DeploymentAddParams) WithBody(body *models.DeploymentAddRequest) *DeploymentAddParams {
	o.SetBody(body)
	return o
}

// SetBody adds the body to the deployment add params
func (o *DeploymentAddParams) SetBody(body *models.DeploymentAddRequest) {
	o.Body = body
}

// WriteToRequest writes these params to a swagger request
func (o *DeploymentAddParams) WriteToRequest(r runtime.ClientRequest, reg strfmt.Registry) error {

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
