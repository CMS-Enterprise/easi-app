// Code generated by go-swagger; DO NOT EDIT.

package software_products

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

// NewSoftwareProductsFindListParams creates a new SoftwareProductsFindListParams object,
// with the default timeout for this client.
//
// Default values are not hydrated, since defaults are normally applied by the API server side.
//
// To enforce default values in parameter, use SetDefaults or WithDefaults.
func NewSoftwareProductsFindListParams() *SoftwareProductsFindListParams {
	return &SoftwareProductsFindListParams{
		timeout: cr.DefaultTimeout,
	}
}

// NewSoftwareProductsFindListParamsWithTimeout creates a new SoftwareProductsFindListParams object
// with the ability to set a timeout on a request.
func NewSoftwareProductsFindListParamsWithTimeout(timeout time.Duration) *SoftwareProductsFindListParams {
	return &SoftwareProductsFindListParams{
		timeout: timeout,
	}
}

// NewSoftwareProductsFindListParamsWithContext creates a new SoftwareProductsFindListParams object
// with the ability to set a context for a request.
func NewSoftwareProductsFindListParamsWithContext(ctx context.Context) *SoftwareProductsFindListParams {
	return &SoftwareProductsFindListParams{
		Context: ctx,
	}
}

// NewSoftwareProductsFindListParamsWithHTTPClient creates a new SoftwareProductsFindListParams object
// with the ability to set a custom HTTPClient for a request.
func NewSoftwareProductsFindListParamsWithHTTPClient(client *http.Client) *SoftwareProductsFindListParams {
	return &SoftwareProductsFindListParams{
		HTTPClient: client,
	}
}

/* SoftwareProductsFindListParams contains all the parameters to send to the API endpoint
   for the software products find list operation.

   Typically these are written to a http.Request.
*/
type SoftwareProductsFindListParams struct {

	/* ID.

	   Application ID.
	*/
	ID string

	/* Version.

	   Stakeholder version.
	*/
	Version *string

	timeout    time.Duration
	Context    context.Context
	HTTPClient *http.Client
}

// WithDefaults hydrates default values in the software products find list params (not the query body).
//
// All values with no default are reset to their zero value.
func (o *SoftwareProductsFindListParams) WithDefaults() *SoftwareProductsFindListParams {
	o.SetDefaults()
	return o
}

// SetDefaults hydrates default values in the software products find list params (not the query body).
//
// All values with no default are reset to their zero value.
func (o *SoftwareProductsFindListParams) SetDefaults() {
	// no default values defined for this parameter
}

// WithTimeout adds the timeout to the software products find list params
func (o *SoftwareProductsFindListParams) WithTimeout(timeout time.Duration) *SoftwareProductsFindListParams {
	o.SetTimeout(timeout)
	return o
}

// SetTimeout adds the timeout to the software products find list params
func (o *SoftwareProductsFindListParams) SetTimeout(timeout time.Duration) {
	o.timeout = timeout
}

// WithContext adds the context to the software products find list params
func (o *SoftwareProductsFindListParams) WithContext(ctx context.Context) *SoftwareProductsFindListParams {
	o.SetContext(ctx)
	return o
}

// SetContext adds the context to the software products find list params
func (o *SoftwareProductsFindListParams) SetContext(ctx context.Context) {
	o.Context = ctx
}

// WithHTTPClient adds the HTTPClient to the software products find list params
func (o *SoftwareProductsFindListParams) WithHTTPClient(client *http.Client) *SoftwareProductsFindListParams {
	o.SetHTTPClient(client)
	return o
}

// SetHTTPClient adds the HTTPClient to the software products find list params
func (o *SoftwareProductsFindListParams) SetHTTPClient(client *http.Client) {
	o.HTTPClient = client
}

// WithID adds the id to the software products find list params
func (o *SoftwareProductsFindListParams) WithID(id string) *SoftwareProductsFindListParams {
	o.SetID(id)
	return o
}

// SetID adds the id to the software products find list params
func (o *SoftwareProductsFindListParams) SetID(id string) {
	o.ID = id
}

// WithVersion adds the version to the software products find list params
func (o *SoftwareProductsFindListParams) WithVersion(version *string) *SoftwareProductsFindListParams {
	o.SetVersion(version)
	return o
}

// SetVersion adds the version to the software products find list params
func (o *SoftwareProductsFindListParams) SetVersion(version *string) {
	o.Version = version
}

// WriteToRequest writes these params to a swagger request
func (o *SoftwareProductsFindListParams) WriteToRequest(r runtime.ClientRequest, reg strfmt.Registry) error {

	if err := r.SetTimeout(o.timeout); err != nil {
		return err
	}
	var res []error

	// query param id
	qrID := o.ID
	qID := qrID
	if qID != "" {

		if err := r.SetQueryParam("id", qID); err != nil {
			return err
		}
	}

	if o.Version != nil {

		// query param version
		var qrVersion string

		if o.Version != nil {
			qrVersion = *o.Version
		}
		qVersion := qrVersion
		if qVersion != "" {

			if err := r.SetQueryParam("version", qVersion); err != nil {
				return err
			}
		}
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}
