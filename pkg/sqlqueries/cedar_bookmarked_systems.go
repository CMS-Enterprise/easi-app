package sqlqueries

import _ "embed"

//go:embed SQL/cedar_bookmarked_systems/select_LOADER.sql
var selectCedarBookmarkedSCEDARystemsLOADERSQL string

var CedarBookmarkSystemsForm = cedarBookmarkSystemScripts{
	SelectLOADER: selectCedarBookmarkedSCEDARystemsLOADERSQL,
}

type cedarBookmarkSystemScripts struct {
	SelectLOADER string
}
