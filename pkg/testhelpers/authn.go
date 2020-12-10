package testhelpers

import (
	"github.com/cmsgov/easi-app/pkg/authn"
)

// NewRequesterPrincipal returns what represents an EASi user
// that is NOT empowered as a Reviewer
func NewRequesterPrincipal() authn.Principal {
	return &authn.EUAPrincipal{EUAID: "REQ", JobCodeEASi: true, JobCodeGRT: false}
}

// NewReviewerPrincipal returns what represents an EASi user
// that is empowered as a member of the GRT.
func NewReviewerPrincipal() authn.Principal {
	return &authn.EUAPrincipal{EUAID: "REV", JobCodeEASi: true, JobCodeGRT: true}
}
