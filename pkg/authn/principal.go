// Package authn holds EASi authentication related primitives
package authn

import "fmt"

const anonID = "ANON"

// ANON is functionally a singleton for representing
// a request without an identity
var ANON Principal = (*anonymous)(nil)

// Principal defines the expected behavior for
// an entity that is making requests of the system.
type Principal interface {
	fmt.Stringer

	// ID returns the system identifier
	// for the given Principal
	ID() string

	// AllowEASi says whether this principal
	// is authorized to operate within EASi
	AllowEASi() bool

	// AllowGRT says whether this principal
	// is authorized to operate as part of
	// the Review Team within EASi
	AllowGRT() bool
}

type anonymous struct{}

// String satisfies the fmt.Stringer interface
func (*anonymous) String() string {
	return "AnonymousPrincipal"
}

// ID returns an identifier that is not
// expected to exist in upstream systems
func (*anonymous) ID() string {
	return anonID
}

// AllowEASi says Anonymous users are
// not explicitly allowed to submit
// info to EASi
func (*anonymous) AllowEASi() bool {
	return false
}

// AllowGRT says Anonymous users are
// not explicitly ruled in as GRT
func (*anonymous) AllowGRT() bool {
	return false
}

// EUAPrincipal represents information
// gleaned from the Okta JWT
type EUAPrincipal struct {
	EUAID       string
	JobCodeEASi bool
	JobCodeGRT  bool
}

// String satisfies the fmt.Stringer interface
func (p *EUAPrincipal) String() string {
	return fmt.Sprintf("EUAPrincipal: %s", p.EUAID)
}

// ID returns the EUA ID
// for the given Principal
func (p *EUAPrincipal) ID() string {
	return p.EUAID
}

// AllowEASi says whether this principal
// is authorized to operate within EASi
func (p *EUAPrincipal) AllowEASi() bool {
	return p.JobCodeEASi
}

// AllowGRT says whether this principal
// is authorized to operate as part of
// the Review Team within EASi
func (p *EUAPrincipal) AllowGRT() bool {
	return p.JobCodeGRT
}
