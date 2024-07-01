// Code generated by go-swagger; DO NOT EDIT.

package intake

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"fmt"
	"io"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/strfmt"

	"github.com/cms-enterprise/easi-app/pkg/cedar/intake/gen/models"
)

// IntakeStatusByCedarIDReader is a Reader for the IntakeStatusByCedarID structure.
type IntakeStatusByCedarIDReader struct {
	formats strfmt.Registry
}

// ReadResponse reads a server response into the received o.
func (o *IntakeStatusByCedarIDReader) ReadResponse(response runtime.ClientResponse, consumer runtime.Consumer) (interface{}, error) {
	switch response.Code() {
	case 200:
		result := NewIntakeStatusByCedarIDOK()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return result, nil
	case 400:
		result := NewIntakeStatusByCedarIDBadRequest()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return nil, result
	case 401:
		result := NewIntakeStatusByCedarIDUnauthorized()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return nil, result
	case 500:
		result := NewIntakeStatusByCedarIDInternalServerError()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return nil, result
	default:
		return nil, runtime.NewAPIError("[GET /intake/status/cedar/{id}] intakeStatusByCedarId", response, response.Code())
	}
}

// NewIntakeStatusByCedarIDOK creates a IntakeStatusByCedarIDOK with default headers values
func NewIntakeStatusByCedarIDOK() *IntakeStatusByCedarIDOK {
	return &IntakeStatusByCedarIDOK{}
}

/*
IntakeStatusByCedarIDOK describes a response with status code 200, with default header values.

OK
*/
type IntakeStatusByCedarIDOK struct {
	Payload *models.IntakeStatus
}

// IsSuccess returns true when this intake status by cedar Id o k response has a 2xx status code
func (o *IntakeStatusByCedarIDOK) IsSuccess() bool {
	return true
}

// IsRedirect returns true when this intake status by cedar Id o k response has a 3xx status code
func (o *IntakeStatusByCedarIDOK) IsRedirect() bool {
	return false
}

// IsClientError returns true when this intake status by cedar Id o k response has a 4xx status code
func (o *IntakeStatusByCedarIDOK) IsClientError() bool {
	return false
}

// IsServerError returns true when this intake status by cedar Id o k response has a 5xx status code
func (o *IntakeStatusByCedarIDOK) IsServerError() bool {
	return false
}

// IsCode returns true when this intake status by cedar Id o k response a status code equal to that given
func (o *IntakeStatusByCedarIDOK) IsCode(code int) bool {
	return code == 200
}

// Code gets the status code for the intake status by cedar Id o k response
func (o *IntakeStatusByCedarIDOK) Code() int {
	return 200
}

func (o *IntakeStatusByCedarIDOK) Error() string {
	return fmt.Sprintf("[GET /intake/status/cedar/{id}][%d] intakeStatusByCedarIdOK  %+v", 200, o.Payload)
}

func (o *IntakeStatusByCedarIDOK) String() string {
	return fmt.Sprintf("[GET /intake/status/cedar/{id}][%d] intakeStatusByCedarIdOK  %+v", 200, o.Payload)
}

func (o *IntakeStatusByCedarIDOK) GetPayload() *models.IntakeStatus {
	return o.Payload
}

func (o *IntakeStatusByCedarIDOK) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.IntakeStatus)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

// NewIntakeStatusByCedarIDBadRequest creates a IntakeStatusByCedarIDBadRequest with default headers values
func NewIntakeStatusByCedarIDBadRequest() *IntakeStatusByCedarIDBadRequest {
	return &IntakeStatusByCedarIDBadRequest{}
}

/*
IntakeStatusByCedarIDBadRequest describes a response with status code 400, with default header values.

Bad Request
*/
type IntakeStatusByCedarIDBadRequest struct {
	Payload *models.Response
}

// IsSuccess returns true when this intake status by cedar Id bad request response has a 2xx status code
func (o *IntakeStatusByCedarIDBadRequest) IsSuccess() bool {
	return false
}

// IsRedirect returns true when this intake status by cedar Id bad request response has a 3xx status code
func (o *IntakeStatusByCedarIDBadRequest) IsRedirect() bool {
	return false
}

// IsClientError returns true when this intake status by cedar Id bad request response has a 4xx status code
func (o *IntakeStatusByCedarIDBadRequest) IsClientError() bool {
	return true
}

// IsServerError returns true when this intake status by cedar Id bad request response has a 5xx status code
func (o *IntakeStatusByCedarIDBadRequest) IsServerError() bool {
	return false
}

// IsCode returns true when this intake status by cedar Id bad request response a status code equal to that given
func (o *IntakeStatusByCedarIDBadRequest) IsCode(code int) bool {
	return code == 400
}

// Code gets the status code for the intake status by cedar Id bad request response
func (o *IntakeStatusByCedarIDBadRequest) Code() int {
	return 400
}

func (o *IntakeStatusByCedarIDBadRequest) Error() string {
	return fmt.Sprintf("[GET /intake/status/cedar/{id}][%d] intakeStatusByCedarIdBadRequest  %+v", 400, o.Payload)
}

func (o *IntakeStatusByCedarIDBadRequest) String() string {
	return fmt.Sprintf("[GET /intake/status/cedar/{id}][%d] intakeStatusByCedarIdBadRequest  %+v", 400, o.Payload)
}

func (o *IntakeStatusByCedarIDBadRequest) GetPayload() *models.Response {
	return o.Payload
}

func (o *IntakeStatusByCedarIDBadRequest) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.Response)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

// NewIntakeStatusByCedarIDUnauthorized creates a IntakeStatusByCedarIDUnauthorized with default headers values
func NewIntakeStatusByCedarIDUnauthorized() *IntakeStatusByCedarIDUnauthorized {
	return &IntakeStatusByCedarIDUnauthorized{}
}

/*
IntakeStatusByCedarIDUnauthorized describes a response with status code 401, with default header values.

Access Denied
*/
type IntakeStatusByCedarIDUnauthorized struct {
	Payload *models.Response
}

// IsSuccess returns true when this intake status by cedar Id unauthorized response has a 2xx status code
func (o *IntakeStatusByCedarIDUnauthorized) IsSuccess() bool {
	return false
}

// IsRedirect returns true when this intake status by cedar Id unauthorized response has a 3xx status code
func (o *IntakeStatusByCedarIDUnauthorized) IsRedirect() bool {
	return false
}

// IsClientError returns true when this intake status by cedar Id unauthorized response has a 4xx status code
func (o *IntakeStatusByCedarIDUnauthorized) IsClientError() bool {
	return true
}

// IsServerError returns true when this intake status by cedar Id unauthorized response has a 5xx status code
func (o *IntakeStatusByCedarIDUnauthorized) IsServerError() bool {
	return false
}

// IsCode returns true when this intake status by cedar Id unauthorized response a status code equal to that given
func (o *IntakeStatusByCedarIDUnauthorized) IsCode(code int) bool {
	return code == 401
}

// Code gets the status code for the intake status by cedar Id unauthorized response
func (o *IntakeStatusByCedarIDUnauthorized) Code() int {
	return 401
}

func (o *IntakeStatusByCedarIDUnauthorized) Error() string {
	return fmt.Sprintf("[GET /intake/status/cedar/{id}][%d] intakeStatusByCedarIdUnauthorized  %+v", 401, o.Payload)
}

func (o *IntakeStatusByCedarIDUnauthorized) String() string {
	return fmt.Sprintf("[GET /intake/status/cedar/{id}][%d] intakeStatusByCedarIdUnauthorized  %+v", 401, o.Payload)
}

func (o *IntakeStatusByCedarIDUnauthorized) GetPayload() *models.Response {
	return o.Payload
}

func (o *IntakeStatusByCedarIDUnauthorized) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.Response)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

// NewIntakeStatusByCedarIDInternalServerError creates a IntakeStatusByCedarIDInternalServerError with default headers values
func NewIntakeStatusByCedarIDInternalServerError() *IntakeStatusByCedarIDInternalServerError {
	return &IntakeStatusByCedarIDInternalServerError{}
}

/*
IntakeStatusByCedarIDInternalServerError describes a response with status code 500, with default header values.

Internal Server Error
*/
type IntakeStatusByCedarIDInternalServerError struct {
	Payload *models.Response
}

// IsSuccess returns true when this intake status by cedar Id internal server error response has a 2xx status code
func (o *IntakeStatusByCedarIDInternalServerError) IsSuccess() bool {
	return false
}

// IsRedirect returns true when this intake status by cedar Id internal server error response has a 3xx status code
func (o *IntakeStatusByCedarIDInternalServerError) IsRedirect() bool {
	return false
}

// IsClientError returns true when this intake status by cedar Id internal server error response has a 4xx status code
func (o *IntakeStatusByCedarIDInternalServerError) IsClientError() bool {
	return false
}

// IsServerError returns true when this intake status by cedar Id internal server error response has a 5xx status code
func (o *IntakeStatusByCedarIDInternalServerError) IsServerError() bool {
	return true
}

// IsCode returns true when this intake status by cedar Id internal server error response a status code equal to that given
func (o *IntakeStatusByCedarIDInternalServerError) IsCode(code int) bool {
	return code == 500
}

// Code gets the status code for the intake status by cedar Id internal server error response
func (o *IntakeStatusByCedarIDInternalServerError) Code() int {
	return 500
}

func (o *IntakeStatusByCedarIDInternalServerError) Error() string {
	return fmt.Sprintf("[GET /intake/status/cedar/{id}][%d] intakeStatusByCedarIdInternalServerError  %+v", 500, o.Payload)
}

func (o *IntakeStatusByCedarIDInternalServerError) String() string {
	return fmt.Sprintf("[GET /intake/status/cedar/{id}][%d] intakeStatusByCedarIdInternalServerError  %+v", 500, o.Payload)
}

func (o *IntakeStatusByCedarIDInternalServerError) GetPayload() *models.Response {
	return o.Payload
}

func (o *IntakeStatusByCedarIDInternalServerError) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.Response)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}
