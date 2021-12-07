package models

// CedarSystemSummary is the model for the list of Sytems from the /system/summary endpoint
// of the CEDAR Core API
type CedarSystemSummary struct {
	Count         int32         `json:"count"`
	SystemSummary []CedarSystem `json:"SystemSummary"`
}

// CedarSystem is the model for a single system
type CedarSystem struct {
	ID                      string `json:"id"`
	Name                    string `json:"name"`
	Description             string `json:"description"`
	Acronym                 string `json:"acronym"`
	Status                  string `json:"status"`
	BusinessOwnerOrg        string `json:"businessOwnerOrg"`
	BusinessOwnerOrgComp    string `json:"businessOwnerOrgComp"`
	SystemMaintainerOrg     string `json:"systemMaintainerOrg"`
	SystemMaintainerOrgComp string `json:"systemMaintainerOrgComp"`
}
