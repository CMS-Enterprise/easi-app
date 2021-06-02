package authentication

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

	// Allow508User says whether this principal
	// is authorized to operate as a user of the
	// 508 process within EASi
	Allow508User() bool

	// Allow508Tester says whether this principal
	// is authorized to operate as part of the
	// 508 testing team within EASi
	Allow508Tester() bool
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

// Allow508User says Anonymous users are
// not explicitly ruled in as 508 users
func (*anonymous) Allow508User() bool {
	return false
}

// Allow508User says Anonymous users are
// not explicitly ruled in as 508 testing team members
func (*anonymous) Allow508Tester() bool {
	return false
}

// EUAPrincipal represents information
// gleaned from the Okta JWT
type EUAPrincipal struct {
	EUAID            string
	JobCodeEASi      bool
	JobCodeGRT       bool
	JobCode508User   bool
	JobCode508Tester bool
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

// Allow508User says whether this principal
// is authorized to operate as a user of the
// 508 process within EASi
func (p *EUAPrincipal) Allow508User() bool {
	return p.JobCode508User
}

// Allow508Tester says whether this principal
// is authorized to operate as part of the
// 508 testing team within EASi
func (p *EUAPrincipal) Allow508Tester() bool {
	return p.JobCode508Tester
}
