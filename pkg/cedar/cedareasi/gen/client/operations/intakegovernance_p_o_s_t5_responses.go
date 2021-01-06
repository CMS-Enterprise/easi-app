// Code generated by go-swagger; DO NOT EDIT.

package operations

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"fmt"
	"io"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/strfmt"

	"github.com/cmsgov/easi-app/pkg/cedar/cedareasi/gen/models"
)

// IntakegovernancePOST5Reader is a Reader for the IntakegovernancePOST5 structure.
type IntakegovernancePOST5Reader struct {
	formats strfmt.Registry
}

// ReadResponse reads a server response into the received o.
func (o *IntakegovernancePOST5Reader) ReadResponse(response runtime.ClientResponse, consumer runtime.Consumer) (interface{}, error) {
	switch response.Code() {
	case 200:
		result := NewIntakegovernancePOST5OK()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return result, nil
	case 400:
		result := NewIntakegovernancePOST5BadRequest()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return nil, result
	case 401:
		result := NewIntakegovernancePOST5Unauthorized()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return nil, result
	case 500:
		result := NewIntakegovernancePOST5InternalServerError()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return nil, result

	default:
		return nil, runtime.NewAPIError("response status code does not match any response statuses defined for this endpoint in the swagger spec", response, response.Code())
	}
}

// NewIntakegovernancePOST5OK creates a IntakegovernancePOST5OK with default headers values
func NewIntakegovernancePOST5OK() *IntakegovernancePOST5OK {
	return &IntakegovernancePOST5OK{}
}

/*IntakegovernancePOST5OK handles this case with default header values.

OK
*/
type IntakegovernancePOST5OK struct {
	Payload *models.IntakegovernancePOSTResponse
}

func (o *IntakegovernancePOST5OK) Error() string {
	return fmt.Sprintf("[POST /intake/governance][%d] intakegovernancePOST5OK  %+v", 200, o.Payload)
}

func (o *IntakegovernancePOST5OK) GetPayload() *models.IntakegovernancePOSTResponse {
	return o.Payload
}

func (o *IntakegovernancePOST5OK) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.IntakegovernancePOSTResponse)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

// NewIntakegovernancePOST5BadRequest creates a IntakegovernancePOST5BadRequest with default headers values
func NewIntakegovernancePOST5BadRequest() *IntakegovernancePOST5BadRequest {
	return &IntakegovernancePOST5BadRequest{}
}

/*IntakegovernancePOST5BadRequest handles this case with default header values.

Bad Request
*/
type IntakegovernancePOST5BadRequest struct {
	Payload *models.IntakegovernancePOSTResponse
}

func (o *IntakegovernancePOST5BadRequest) Error() string {
	return fmt.Sprintf("[POST /intake/governance][%d] intakegovernancePOST5BadRequest  %+v", 400, o.Payload)
}

func (o *IntakegovernancePOST5BadRequest) GetPayload() *models.IntakegovernancePOSTResponse {
	return o.Payload
}

func (o *IntakegovernancePOST5BadRequest) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.IntakegovernancePOSTResponse)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

// NewIntakegovernancePOST5Unauthorized creates a IntakegovernancePOST5Unauthorized with default headers values
func NewIntakegovernancePOST5Unauthorized() *IntakegovernancePOST5Unauthorized {
	return &IntakegovernancePOST5Unauthorized{}
}

/*IntakegovernancePOST5Unauthorized handles this case with default header values.

Access Denied
*/
type IntakegovernancePOST5Unauthorized struct {
	Payload *models.IntakegovernancePOSTResponse
}

func (o *IntakegovernancePOST5Unauthorized) Error() string {
	return fmt.Sprintf("[POST /intake/governance][%d] intakegovernancePOST5Unauthorized  %+v", 401, o.Payload)
}

func (o *IntakegovernancePOST5Unauthorized) GetPayload() *models.IntakegovernancePOSTResponse {
	return o.Payload
}

func (o *IntakegovernancePOST5Unauthorized) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.IntakegovernancePOSTResponse)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

// NewIntakegovernancePOST5InternalServerError creates a IntakegovernancePOST5InternalServerError with default headers values
func NewIntakegovernancePOST5InternalServerError() *IntakegovernancePOST5InternalServerError {
	return &IntakegovernancePOST5InternalServerError{}
}

/*IntakegovernancePOST5InternalServerError handles this case with default header values.

Internal Server Error
*/
type IntakegovernancePOST5InternalServerError struct {
	Payload *models.IntakegovernancePOSTResponse
}

func (o *IntakegovernancePOST5InternalServerError) Error() string {
	return fmt.Sprintf("[POST /intake/governance][%d] intakegovernancePOST5InternalServerError  %+v", 500, o.Payload)
}

func (o *IntakegovernancePOST5InternalServerError) GetPayload() *models.IntakegovernancePOSTResponse {
	return o.Payload
}

func (o *IntakegovernancePOST5InternalServerError) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.IntakegovernancePOSTResponse)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}
