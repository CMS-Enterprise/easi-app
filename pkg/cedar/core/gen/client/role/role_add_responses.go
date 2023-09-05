// Code generated by go-swagger; DO NOT EDIT.

package role

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"fmt"
	"io"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/strfmt"

	"github.com/cmsgov/easi-app/pkg/cedar/core/gen/models"
)

// RoleAddReader is a Reader for the RoleAdd structure.
type RoleAddReader struct {
	formats strfmt.Registry
}

// ReadResponse reads a server response into the received o.
func (o *RoleAddReader) ReadResponse(response runtime.ClientResponse, consumer runtime.Consumer) (interface{}, error) {
	switch response.Code() {
	case 200:
		result := NewRoleAddOK()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return result, nil
	case 400:
		result := NewRoleAddBadRequest()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return nil, result
	case 401:
		result := NewRoleAddUnauthorized()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return nil, result
	case 500:
		result := NewRoleAddInternalServerError()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return nil, result
	default:
		return nil, runtime.NewAPIError("[POST /role] roleAdd", response, response.Code())
	}
}

// NewRoleAddOK creates a RoleAddOK with default headers values
func NewRoleAddOK() *RoleAddOK {
	return &RoleAddOK{}
}

/*
RoleAddOK describes a response with status code 200, with default header values.

OK
*/
type RoleAddOK struct {
	Payload *models.Response
}

// IsSuccess returns true when this role add o k response has a 2xx status code
func (o *RoleAddOK) IsSuccess() bool {
	return true
}

// IsRedirect returns true when this role add o k response has a 3xx status code
func (o *RoleAddOK) IsRedirect() bool {
	return false
}

// IsClientError returns true when this role add o k response has a 4xx status code
func (o *RoleAddOK) IsClientError() bool {
	return false
}

// IsServerError returns true when this role add o k response has a 5xx status code
func (o *RoleAddOK) IsServerError() bool {
	return false
}

// IsCode returns true when this role add o k response a status code equal to that given
func (o *RoleAddOK) IsCode(code int) bool {
	return code == 200
}

// Code gets the status code for the role add o k response
func (o *RoleAddOK) Code() int {
	return 200
}

func (o *RoleAddOK) Error() string {
	return fmt.Sprintf("[POST /role][%d] roleAddOK  %+v", 200, o.Payload)
}

func (o *RoleAddOK) String() string {
	return fmt.Sprintf("[POST /role][%d] roleAddOK  %+v", 200, o.Payload)
}

func (o *RoleAddOK) GetPayload() *models.Response {
	return o.Payload
}

func (o *RoleAddOK) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.Response)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

// NewRoleAddBadRequest creates a RoleAddBadRequest with default headers values
func NewRoleAddBadRequest() *RoleAddBadRequest {
	return &RoleAddBadRequest{}
}

/*
RoleAddBadRequest describes a response with status code 400, with default header values.

Bad Request
*/
type RoleAddBadRequest struct {
	Payload *models.Response
}

// IsSuccess returns true when this role add bad request response has a 2xx status code
func (o *RoleAddBadRequest) IsSuccess() bool {
	return false
}

// IsRedirect returns true when this role add bad request response has a 3xx status code
func (o *RoleAddBadRequest) IsRedirect() bool {
	return false
}

// IsClientError returns true when this role add bad request response has a 4xx status code
func (o *RoleAddBadRequest) IsClientError() bool {
	return true
}

// IsServerError returns true when this role add bad request response has a 5xx status code
func (o *RoleAddBadRequest) IsServerError() bool {
	return false
}

// IsCode returns true when this role add bad request response a status code equal to that given
func (o *RoleAddBadRequest) IsCode(code int) bool {
	return code == 400
}

// Code gets the status code for the role add bad request response
func (o *RoleAddBadRequest) Code() int {
	return 400
}

func (o *RoleAddBadRequest) Error() string {
	return fmt.Sprintf("[POST /role][%d] roleAddBadRequest  %+v", 400, o.Payload)
}

func (o *RoleAddBadRequest) String() string {
	return fmt.Sprintf("[POST /role][%d] roleAddBadRequest  %+v", 400, o.Payload)
}

func (o *RoleAddBadRequest) GetPayload() *models.Response {
	return o.Payload
}

func (o *RoleAddBadRequest) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.Response)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

// NewRoleAddUnauthorized creates a RoleAddUnauthorized with default headers values
func NewRoleAddUnauthorized() *RoleAddUnauthorized {
	return &RoleAddUnauthorized{}
}

/*
RoleAddUnauthorized describes a response with status code 401, with default header values.

Access Denied
*/
type RoleAddUnauthorized struct {
	Payload *models.Response
}

// IsSuccess returns true when this role add unauthorized response has a 2xx status code
func (o *RoleAddUnauthorized) IsSuccess() bool {
	return false
}

// IsRedirect returns true when this role add unauthorized response has a 3xx status code
func (o *RoleAddUnauthorized) IsRedirect() bool {
	return false
}

// IsClientError returns true when this role add unauthorized response has a 4xx status code
func (o *RoleAddUnauthorized) IsClientError() bool {
	return true
}

// IsServerError returns true when this role add unauthorized response has a 5xx status code
func (o *RoleAddUnauthorized) IsServerError() bool {
	return false
}

// IsCode returns true when this role add unauthorized response a status code equal to that given
func (o *RoleAddUnauthorized) IsCode(code int) bool {
	return code == 401
}

// Code gets the status code for the role add unauthorized response
func (o *RoleAddUnauthorized) Code() int {
	return 401
}

func (o *RoleAddUnauthorized) Error() string {
	return fmt.Sprintf("[POST /role][%d] roleAddUnauthorized  %+v", 401, o.Payload)
}

func (o *RoleAddUnauthorized) String() string {
	return fmt.Sprintf("[POST /role][%d] roleAddUnauthorized  %+v", 401, o.Payload)
}

func (o *RoleAddUnauthorized) GetPayload() *models.Response {
	return o.Payload
}

func (o *RoleAddUnauthorized) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.Response)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

// NewRoleAddInternalServerError creates a RoleAddInternalServerError with default headers values
func NewRoleAddInternalServerError() *RoleAddInternalServerError {
	return &RoleAddInternalServerError{}
}

/*
RoleAddInternalServerError describes a response with status code 500, with default header values.

Internal Server Error
*/
type RoleAddInternalServerError struct {
	Payload *models.Response
}

// IsSuccess returns true when this role add internal server error response has a 2xx status code
func (o *RoleAddInternalServerError) IsSuccess() bool {
	return false
}

// IsRedirect returns true when this role add internal server error response has a 3xx status code
func (o *RoleAddInternalServerError) IsRedirect() bool {
	return false
}

// IsClientError returns true when this role add internal server error response has a 4xx status code
func (o *RoleAddInternalServerError) IsClientError() bool {
	return false
}

// IsServerError returns true when this role add internal server error response has a 5xx status code
func (o *RoleAddInternalServerError) IsServerError() bool {
	return true
}

// IsCode returns true when this role add internal server error response a status code equal to that given
func (o *RoleAddInternalServerError) IsCode(code int) bool {
	return code == 500
}

// Code gets the status code for the role add internal server error response
func (o *RoleAddInternalServerError) Code() int {
	return 500
}

func (o *RoleAddInternalServerError) Error() string {
	return fmt.Sprintf("[POST /role][%d] roleAddInternalServerError  %+v", 500, o.Payload)
}

func (o *RoleAddInternalServerError) String() string {
	return fmt.Sprintf("[POST /role][%d] roleAddInternalServerError  %+v", 500, o.Payload)
}

func (o *RoleAddInternalServerError) GetPayload() *models.Response {
	return o.Payload
}

func (o *RoleAddInternalServerError) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.Response)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}
