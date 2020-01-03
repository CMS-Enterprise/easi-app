# Use gorilla/mux for Routing

We need a way to serve routes so that we can create an application with functionality
that is useful for the front end.

## Considered Alternatives

* [gorilla/mux](https://github.com/gorilla/mux)
* [gin-gonic/gin](https://github.com/gin-gonic/gin)
* Use the Standard Library Only
* Write our own routing

## Decision Outcome

* Chosen Alternative: [gorilla/mux](https://github.com/gorilla/mux)
* We've decided that gorilla/mux is the right solution
as it is maintained by [Gorilla Tool Kit](https://www.gorillatoolkit.org/).
It handles routing in a way that conforms to golang best
practices and is familiar to Truss and the application developers on this team.
* This also lets us follow more common API patterns in
golang as described in
[this blog post
](https://medium.com/statuscode/how-i-write-go-http-services-after-seven-years-37c208122831)

## Pros and Cons of the Alternatives <!-- optional -->

### [gorilla/mux](https://github.com/gorilla/mux)

* `+` Eng team is already familiar with it
* `+` Allows us to follow well-known golang practices
* `+` Been tested on other projects
* `-` Requires importing a package

### [gin-gonic/gin](https://github.com/gin-gonic/gin)

* `+` Has a lot of structure for many aspects of building out a golang application
* `-` Doesn’t use go standard lib patterns like `HandlerFunc`
* `-` Doesn't follow a lot of well-known golang practices
* `-` Has more features than we need
* `-` Requires importing a package

### Use the Standard Library Only

* `+` No package imports or dependency locking
* `-` It doesn't have enough features

### Write our own routing

* `+` We get exactly what we want and need
* `+` No package imports or dependency locking
* `-` We have to maintain and handle any
security implications (especially since this repo is now public)
* `-` Requires upfront work to build out features we want
