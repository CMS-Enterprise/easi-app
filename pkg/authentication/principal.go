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

	// AllowTRBAdmin says whether this principal
	// is authorized to operate as an admin of the TRB process within EASi
	AllowTRBAdmin() bool

	Account() *UserAccount
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

// AllowTRBAdmin says Anonymous users are not explicitly ruled in as TRB admins
func (*anonymous) AllowTRBAdmin() bool {
	return false
}

// Account returns an empty UserAccount for an Anonymous user
func (*anonymous) Account() *UserAccount {
	return &UserAccount{}
}

// EUAPrincipal represents information
// gleaned from the Okta JWT
type EUAPrincipal struct {
	EUAID           string
	JobCodeEASi     bool
	JobCodeGRT      bool
	JobCodeTRBAdmin bool
	UserAccount     *UserAccount
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

// AllowTRBAdmin says whether this principal
// is authorized to operate as an admin of the TRB process within EASi
func (p *EUAPrincipal) AllowTRBAdmin() bool {
	return p.JobCodeTRBAdmin
}

// Account returns the UserAccount of an EUAPrincipal
func (p *EUAPrincipal) Account() *UserAccount {
	return p.UserAccount
}
