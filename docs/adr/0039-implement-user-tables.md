# User Table implementation and Rollout Plan

**User Story:** [EASI-3341](https://jiraent.cms.gov/browse/EASI-3341)

As we look forward to future feature improvements for the EASi application, there is a need to implement User Tables. These tables will allow for per user configuration, as well as more simply storing information about each user.

As this is an existing application we need to have a mechanism in place to migrate existing data that is only a username (EUAID) to reference an entity in the user table. There are also spots in the data where a user is referenced only by name, and not by username.

To implement this, we need to be able to 
1. Get information about users
2. Store that information in the User Table
3. Migrate existing data to use the new account reference

Database migrations only happen in the DB context, so we can't query an external API when they are being run. As such, we need to come up with an approach that can update the user information at another time.

## Considered Alternatives

* *[alternative 1]*
* *[alternative 2]*
* *[alternative 3]*
* *[...]* <!-- numbers of alternatives can vary -->

## Decision Outcome

* Chosen Alternative: *[alternative 1]*
* *[justification.
  e.g., only alternative,
  which meets KO criterion decision driver
  | which resolves force force
  | ...
  | comes out best (see below)]*
* *[consequences. e.g.,
  negative impact on quality attribute,
  follow-up decisions required,
  ...]* <!-- optional -->

## Pros and Cons of the Alternatives <!-- optional -->

### *[alternative 1]*

* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->

### *[alternative 2]*

* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->

### *[alternative 3]*

* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->
