// Code generated by go-swagger; DO NOT EDIT.

package system

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"fmt"
	"io"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/strfmt"

	"github.com/cmsgov/easi-app/pkg/cedar/core/gen/models"
)

// SystemDetailAddReader is a Reader for the SystemDetailAdd structure.
type SystemDetailAddReader struct {
	formats strfmt.Registry
}

// ReadResponse reads a server response into the received o.
func (o *SystemDetailAddReader) ReadResponse(response runtime.ClientResponse, consumer runtime.Consumer) (interface{}, error) {
	switch response.Code() {
	case 200:
		result := NewSystemDetailAddOK()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return result, nil
	case 400:
		result := NewSystemDetailAddBadRequest()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return nil, result
	case 401:
		result := NewSystemDetailAddUnauthorized()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return nil, result
	case 500:
		result := NewSystemDetailAddInternalServerError()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return nil, result
	default:
		return nil, runtime.NewAPIError("response status code does not match any response statuses defined for this endpoint in the swagger spec", response, response.Code())
	}
}

// NewSystemDetailAddOK creates a SystemDetailAddOK with default headers values
func NewSystemDetailAddOK() *SystemDetailAddOK {
	return &SystemDetailAddOK{}
}

/*
	SystemDetailAddOK describes a response with status code 200, with default header values.

OK
*/
type SystemDetailAddOK struct {
	Payload *models.Response
}

func (o *SystemDetailAddOK) Error() string {
	return fmt.Sprintf("[POST /system/detail][%d] systemDetailAddOK  %+v", 200, o.Payload)
}
func (o *SystemDetailAddOK) GetPayload() *models.Response {
	return o.Payload
}

func (o *SystemDetailAddOK) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.Response)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

// NewSystemDetailAddBadRequest creates a SystemDetailAddBadRequest with default headers values
func NewSystemDetailAddBadRequest() *SystemDetailAddBadRequest {
	return &SystemDetailAddBadRequest{}
}

/*
	SystemDetailAddBadRequest describes a response with status code 400, with default header values.

Bad Request
*/
type SystemDetailAddBadRequest struct {
	Payload *models.Response
}

func (o *SystemDetailAddBadRequest) Error() string {
	return fmt.Sprintf("[POST /system/detail][%d] systemDetailAddBadRequest  %+v", 400, o.Payload)
}
func (o *SystemDetailAddBadRequest) GetPayload() *models.Response {
	return o.Payload
}

func (o *SystemDetailAddBadRequest) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.Response)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

// NewSystemDetailAddUnauthorized creates a SystemDetailAddUnauthorized with default headers values
func NewSystemDetailAddUnauthorized() *SystemDetailAddUnauthorized {
	return &SystemDetailAddUnauthorized{}
}

/*
	SystemDetailAddUnauthorized describes a response with status code 401, with default header values.

Access Denied
*/
type SystemDetailAddUnauthorized struct {
	Payload *models.Response
}

func (o *SystemDetailAddUnauthorized) Error() string {
	return fmt.Sprintf("[POST /system/detail][%d] systemDetailAddUnauthorized  %+v", 401, o.Payload)
}
func (o *SystemDetailAddUnauthorized) GetPayload() *models.Response {
	return o.Payload
}

func (o *SystemDetailAddUnauthorized) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.Response)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

// NewSystemDetailAddInternalServerError creates a SystemDetailAddInternalServerError with default headers values
func NewSystemDetailAddInternalServerError() *SystemDetailAddInternalServerError {
	return &SystemDetailAddInternalServerError{}
}

/*
	SystemDetailAddInternalServerError describes a response with status code 500, with default header values.

Internal Server Error
*/
type SystemDetailAddInternalServerError struct {
	Payload *models.Response
}

func (o *SystemDetailAddInternalServerError) Error() string {
	return fmt.Sprintf("[POST /system/detail][%d] systemDetailAddInternalServerError  %+v", 500, o.Payload)
}
func (o *SystemDetailAddInternalServerError) GetPayload() *models.Response {
	return o.Payload
}

func (o *SystemDetailAddInternalServerError) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.Response)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}
