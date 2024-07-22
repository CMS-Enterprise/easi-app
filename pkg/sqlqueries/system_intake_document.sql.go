package sqlqueries

import _ "embed"

// getSystemIntakeDocumentByID holds the SQL statement for getting a system intake document by its ID
//
//go:embed SQL/system_intake_document/get_by_id.sql
var getSystemIntakeDocumentByID string

// getSystemIntakeDocumentByS3Key holds the SQL statement for getting a system intake document by its S3 key
//
//go:embed SQL/system_intake_document/get_by_s3_key.sql
var getSystemIntakeDocumentByS3Key string

// selectDocumentsBySystemIntakeID holds the SQL statement for getting all documents by system intake ID
//
//go:embed SQL/system_intake_document/select_by_system_intake_id.sql
var selectDocumentsBySystemIntakeID string

// createSystemIntakeDocument holds the SQL statement for creating a document on a system intake
//
//go:embed SQL/system_intake_document/create.sql
var createSystemIntakeDocument string

// deleteSystemIntakeDocument holds the SQL statement for deleting a document on a system intake
//
//go:embed SQL/system_intake_document/delete.sql
var deleteSystemIntakeDocument string

var SystemIntakeDocument = systemIntakeDocumentScripts{
	Create:                          createSystemIntakeDocument,
	Delete:                          deleteSystemIntakeDocument,
	GetByDocumentID:                 getSystemIntakeDocumentByID,
	GetByS3Key:                      getSystemIntakeDocumentByS3Key,
	SelectDocumentsBySystemIntakeID: selectDocumentsBySystemIntakeID,
}

type systemIntakeDocumentScripts struct {
	Create                          string
	Delete                          string
	GetByDocumentID                 string
	GetByS3Key                      string
	SelectDocumentsBySystemIntakeID string
}
