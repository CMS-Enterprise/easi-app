package testhelpers

import (
	"github.com/cmsgov/easi-app/pkg/authentication"
)

// NewRequesterPrincipal returns what represents an EASi user
// that is NOT empowered as a Reviewer
func NewRequesterPrincipal() authentication.Principal {
	return &authentication.EUAPrincipal{EUAID: "REQ", JobCodeEASi: true, JobCodeGRT: false}
}

// NewReviewerPrincipal returns what represents an EASi user
// that is empowered as a member of the GRT.
func NewReviewerPrincipal() authentication.Principal {
	return &authentication.EUAPrincipal{EUAID: "REV", JobCodeEASi: true, JobCodeGRT: true}
}
