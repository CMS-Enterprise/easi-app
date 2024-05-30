package sqlqueries

import _ "embed"

//go:embed SQL/cedar_bookmarked_systems/select_LOADER.sql
var selectCedarBookmarkedSCEDARSystemsLOADERSQL string

var CedarBookmarkSystemsForm = cedarBookmarkSystemScripts{
	SelectLOADER: selectCedarBookmarkedSCEDARSystemsLOADERSQL,
}

type cedarBookmarkSystemScripts struct {
	SelectLOADER string
}
