package sqlqueries

import _ "embed"

//go:embed SQL/cedar_linked_requests/select.sql
var selectLinkedRequestsSQL string

var CedarLinkedRequestsForm = cedarLinkedRequestsScripts{
	Select: selectLinkedRequestsSQL,
}

type cedarLinkedRequestsScripts struct {
	Select string
}
