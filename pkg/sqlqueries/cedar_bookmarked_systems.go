package sqlqueries

import _ "embed"

//go:embed SQL/cedar_bookmarked_systems/get_by_system_ids_LOADER.sql
var selectCedarBookmarkedSystemsByCedarSystemIDsLOADERSQL string

var CedarBookmarkSystemsForm = cedarBookmarkSystemScripts{
	SelectByCedarSystemIDsLOADER: selectCedarBookmarkedSystemsByCedarSystemIDsLOADERSQL,
}

type cedarBookmarkSystemScripts struct {
	SelectByCedarSystemIDsLOADER string
}
