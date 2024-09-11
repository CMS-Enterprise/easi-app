// Code generated by go-swagger; DO NOT EDIT.

package system

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"fmt"
	"io"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/strfmt"

	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/models"
)

// SystemSummaryFindByIDReader is a Reader for the SystemSummaryFindByID structure.
type SystemSummaryFindByIDReader struct {
	formats strfmt.Registry
}

// ReadResponse reads a server response into the received o.
func (o *SystemSummaryFindByIDReader) ReadResponse(response runtime.ClientResponse, consumer runtime.Consumer) (interface{}, error) {
	switch response.Code() {
	case 200:
		result := NewSystemSummaryFindByIDOK()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return result, nil
	case 400:
		result := NewSystemSummaryFindByIDBadRequest()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return nil, result
	case 401:
		result := NewSystemSummaryFindByIDUnauthorized()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return nil, result
	case 404:
		result := NewSystemSummaryFindByIDNotFound()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return nil, result
	case 500:
		result := NewSystemSummaryFindByIDInternalServerError()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return nil, result
	default:
		return nil, runtime.NewAPIError("[GET /system/summary/{id}] systemSummaryFindById", response, response.Code())
	}
}

// NewSystemSummaryFindByIDOK creates a SystemSummaryFindByIDOK with default headers values
func NewSystemSummaryFindByIDOK() *SystemSummaryFindByIDOK {
	return &SystemSummaryFindByIDOK{}
}

/*
SystemSummaryFindByIDOK describes a response with status code 200, with default header values.

OK
*/
type SystemSummaryFindByIDOK struct {
	Payload *models.SystemSummaryResponse
}

// IsSuccess returns true when this system summary find by Id o k response has a 2xx status code
func (o *SystemSummaryFindByIDOK) IsSuccess() bool {
	return true
}

// IsRedirect returns true when this system summary find by Id o k response has a 3xx status code
func (o *SystemSummaryFindByIDOK) IsRedirect() bool {
	return false
}

// IsClientError returns true when this system summary find by Id o k response has a 4xx status code
func (o *SystemSummaryFindByIDOK) IsClientError() bool {
	return false
}

// IsServerError returns true when this system summary find by Id o k response has a 5xx status code
func (o *SystemSummaryFindByIDOK) IsServerError() bool {
	return false
}

// IsCode returns true when this system summary find by Id o k response a status code equal to that given
func (o *SystemSummaryFindByIDOK) IsCode(code int) bool {
	return code == 200
}

// Code gets the status code for the system summary find by Id o k response
func (o *SystemSummaryFindByIDOK) Code() int {
	return 200
}

func (o *SystemSummaryFindByIDOK) Error() string {
	return fmt.Sprintf("[GET /system/summary/{id}][%d] systemSummaryFindByIdOK  %+v", 200, o.Payload)
}

func (o *SystemSummaryFindByIDOK) String() string {
	return fmt.Sprintf("[GET /system/summary/{id}][%d] systemSummaryFindByIdOK  %+v", 200, o.Payload)
}

func (o *SystemSummaryFindByIDOK) GetPayload() *models.SystemSummaryResponse {
	return o.Payload
}

func (o *SystemSummaryFindByIDOK) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.SystemSummaryResponse)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

// NewSystemSummaryFindByIDBadRequest creates a SystemSummaryFindByIDBadRequest with default headers values
func NewSystemSummaryFindByIDBadRequest() *SystemSummaryFindByIDBadRequest {
	return &SystemSummaryFindByIDBadRequest{}
}

/*
SystemSummaryFindByIDBadRequest describes a response with status code 400, with default header values.

Bad Request
*/
type SystemSummaryFindByIDBadRequest struct {
	Payload *models.Response
}

// IsSuccess returns true when this system summary find by Id bad request response has a 2xx status code
func (o *SystemSummaryFindByIDBadRequest) IsSuccess() bool {
	return false
}

// IsRedirect returns true when this system summary find by Id bad request response has a 3xx status code
func (o *SystemSummaryFindByIDBadRequest) IsRedirect() bool {
	return false
}

// IsClientError returns true when this system summary find by Id bad request response has a 4xx status code
func (o *SystemSummaryFindByIDBadRequest) IsClientError() bool {
	return true
}

// IsServerError returns true when this system summary find by Id bad request response has a 5xx status code
func (o *SystemSummaryFindByIDBadRequest) IsServerError() bool {
	return false
}

// IsCode returns true when this system summary find by Id bad request response a status code equal to that given
func (o *SystemSummaryFindByIDBadRequest) IsCode(code int) bool {
	return code == 400
}

// Code gets the status code for the system summary find by Id bad request response
func (o *SystemSummaryFindByIDBadRequest) Code() int {
	return 400
}

func (o *SystemSummaryFindByIDBadRequest) Error() string {
	return fmt.Sprintf("[GET /system/summary/{id}][%d] systemSummaryFindByIdBadRequest  %+v", 400, o.Payload)
}

func (o *SystemSummaryFindByIDBadRequest) String() string {
	return fmt.Sprintf("[GET /system/summary/{id}][%d] systemSummaryFindByIdBadRequest  %+v", 400, o.Payload)
}

func (o *SystemSummaryFindByIDBadRequest) GetPayload() *models.Response {
	return o.Payload
}

func (o *SystemSummaryFindByIDBadRequest) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.Response)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

// NewSystemSummaryFindByIDUnauthorized creates a SystemSummaryFindByIDUnauthorized with default headers values
func NewSystemSummaryFindByIDUnauthorized() *SystemSummaryFindByIDUnauthorized {
	return &SystemSummaryFindByIDUnauthorized{}
}

/*
SystemSummaryFindByIDUnauthorized describes a response with status code 401, with default header values.

Access Denied
*/
type SystemSummaryFindByIDUnauthorized struct {
	Payload *models.Response
}

// IsSuccess returns true when this system summary find by Id unauthorized response has a 2xx status code
func (o *SystemSummaryFindByIDUnauthorized) IsSuccess() bool {
	return false
}

// IsRedirect returns true when this system summary find by Id unauthorized response has a 3xx status code
func (o *SystemSummaryFindByIDUnauthorized) IsRedirect() bool {
	return false
}

// IsClientError returns true when this system summary find by Id unauthorized response has a 4xx status code
func (o *SystemSummaryFindByIDUnauthorized) IsClientError() bool {
	return true
}

// IsServerError returns true when this system summary find by Id unauthorized response has a 5xx status code
func (o *SystemSummaryFindByIDUnauthorized) IsServerError() bool {
	return false
}

// IsCode returns true when this system summary find by Id unauthorized response a status code equal to that given
func (o *SystemSummaryFindByIDUnauthorized) IsCode(code int) bool {
	return code == 401
}

// Code gets the status code for the system summary find by Id unauthorized response
func (o *SystemSummaryFindByIDUnauthorized) Code() int {
	return 401
}

func (o *SystemSummaryFindByIDUnauthorized) Error() string {
	return fmt.Sprintf("[GET /system/summary/{id}][%d] systemSummaryFindByIdUnauthorized  %+v", 401, o.Payload)
}

func (o *SystemSummaryFindByIDUnauthorized) String() string {
	return fmt.Sprintf("[GET /system/summary/{id}][%d] systemSummaryFindByIdUnauthorized  %+v", 401, o.Payload)
}

func (o *SystemSummaryFindByIDUnauthorized) GetPayload() *models.Response {
	return o.Payload
}

func (o *SystemSummaryFindByIDUnauthorized) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.Response)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

// NewSystemSummaryFindByIDNotFound creates a SystemSummaryFindByIDNotFound with default headers values
func NewSystemSummaryFindByIDNotFound() *SystemSummaryFindByIDNotFound {
	return &SystemSummaryFindByIDNotFound{}
}

/*
SystemSummaryFindByIDNotFound describes a response with status code 404, with default header values.

Not Found
*/
type SystemSummaryFindByIDNotFound struct {
	Payload *models.Response
}

// IsSuccess returns true when this system summary find by Id not found response has a 2xx status code
func (o *SystemSummaryFindByIDNotFound) IsSuccess() bool {
	return false
}

// IsRedirect returns true when this system summary find by Id not found response has a 3xx status code
func (o *SystemSummaryFindByIDNotFound) IsRedirect() bool {
	return false
}

// IsClientError returns true when this system summary find by Id not found response has a 4xx status code
func (o *SystemSummaryFindByIDNotFound) IsClientError() bool {
	return true
}

// IsServerError returns true when this system summary find by Id not found response has a 5xx status code
func (o *SystemSummaryFindByIDNotFound) IsServerError() bool {
	return false
}

// IsCode returns true when this system summary find by Id not found response a status code equal to that given
func (o *SystemSummaryFindByIDNotFound) IsCode(code int) bool {
	return code == 404
}

// Code gets the status code for the system summary find by Id not found response
func (o *SystemSummaryFindByIDNotFound) Code() int {
	return 404
}

func (o *SystemSummaryFindByIDNotFound) Error() string {
	return fmt.Sprintf("[GET /system/summary/{id}][%d] systemSummaryFindByIdNotFound  %+v", 404, o.Payload)
}

func (o *SystemSummaryFindByIDNotFound) String() string {
	return fmt.Sprintf("[GET /system/summary/{id}][%d] systemSummaryFindByIdNotFound  %+v", 404, o.Payload)
}

func (o *SystemSummaryFindByIDNotFound) GetPayload() *models.Response {
	return o.Payload
}

func (o *SystemSummaryFindByIDNotFound) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.Response)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

// NewSystemSummaryFindByIDInternalServerError creates a SystemSummaryFindByIDInternalServerError with default headers values
func NewSystemSummaryFindByIDInternalServerError() *SystemSummaryFindByIDInternalServerError {
	return &SystemSummaryFindByIDInternalServerError{}
}

/*
SystemSummaryFindByIDInternalServerError describes a response with status code 500, with default header values.

Internal Server Error
*/
type SystemSummaryFindByIDInternalServerError struct {
	Payload *models.Response
}

// IsSuccess returns true when this system summary find by Id internal server error response has a 2xx status code
func (o *SystemSummaryFindByIDInternalServerError) IsSuccess() bool {
	return false
}

// IsRedirect returns true when this system summary find by Id internal server error response has a 3xx status code
func (o *SystemSummaryFindByIDInternalServerError) IsRedirect() bool {
	return false
}

// IsClientError returns true when this system summary find by Id internal server error response has a 4xx status code
func (o *SystemSummaryFindByIDInternalServerError) IsClientError() bool {
	return false
}

// IsServerError returns true when this system summary find by Id internal server error response has a 5xx status code
func (o *SystemSummaryFindByIDInternalServerError) IsServerError() bool {
	return true
}

// IsCode returns true when this system summary find by Id internal server error response a status code equal to that given
func (o *SystemSummaryFindByIDInternalServerError) IsCode(code int) bool {
	return code == 500
}

// Code gets the status code for the system summary find by Id internal server error response
func (o *SystemSummaryFindByIDInternalServerError) Code() int {
	return 500
}

func (o *SystemSummaryFindByIDInternalServerError) Error() string {
	return fmt.Sprintf("[GET /system/summary/{id}][%d] systemSummaryFindByIdInternalServerError  %+v", 500, o.Payload)
}

func (o *SystemSummaryFindByIDInternalServerError) String() string {
	return fmt.Sprintf("[GET /system/summary/{id}][%d] systemSummaryFindByIdInternalServerError  %+v", 500, o.Payload)
}

func (o *SystemSummaryFindByIDInternalServerError) GetPayload() *models.Response {
	return o.Payload
}

func (o *SystemSummaryFindByIDInternalServerError) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.Response)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}
