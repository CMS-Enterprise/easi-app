package sqlqueries

import _ "embed"

//go:embed SQL/cedar_bookmarked_systems/select_by_cedar_system_ids.sql
var selectCedarSystemBookmarkedByCedarSystemIDsSQL string

var CedarBookmarkSystemsForm = cedarBookmarkSystemScripts{
	SelectByCedarSystemIDs: selectCedarSystemBookmarkedByCedarSystemIDsSQL,
}

type cedarBookmarkSystemScripts struct {
	SelectByCedarSystemIDs string
}
