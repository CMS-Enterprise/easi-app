# *What language should we use for the client-side application?*

* Status: Proposed [Proposed, Accepted, Rejected, Deprecated, Superseded, etc.]
* Deciders: Mikena, Eady, Chris
* Date: 2019-10-17

Traditionally, Javascript has been the preferred language for client-side
development. However, recently Typescript, a superset of Javascript, has
gained popularity and this is a language we wanted to learn how it could
benefit us.

## Considered Options

* Javascript
* Javascript w/ [Flow](https://flow.org)
* [Typescript](https://flow.org)

## Decision Outcome

 Typescript

* `+` Strong static typing system will help reduce possibility of bugs at
runtime
* `+` Errors will be captured at compile time
* `+` Code is self-documented with static typing
* `+` Does not require any additional setup (assuming we use [Create React App](https://github.com/facebook/create-react-app))
* `+` Well established community support (e.g. community, tools, documentation, etc.)
* `-` Adds a layer of complexity which will initially decrease productivity
to get on-boarded

## Pros and Cons of the Alternatives

Javascript

* `+` No additional on-boarding or learning required. Javascript is more
widely used compared to Typescript
* `-` No static typing

Javascript w/Flow

* `+` Very similar to Javascript with special sauce
* `-` Have had negative experience with unclear error messages and limited support
* `-` Reported issues of sluggish activity across IDE/editors hogging
bandwidth on machine's (YMMV)
* `-` Requires a flow declaration (`// @flow`) at the top of every file
