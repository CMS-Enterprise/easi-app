package email

// SendCantFindSomethingEmailInput contains the data submitted by the user to the "can't find find
// what you're looking for" help form
type SendCantFindSomethingEmailInput struct {
	Name  string
	Email string
	Body  string
}
