package models

// CedarSystem is the model for a single system that comes back from the CEDAR Core API
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
