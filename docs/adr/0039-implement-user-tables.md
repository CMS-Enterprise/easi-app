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

### Insert place holder records

* `+` This can be done during the migration
* `+` This doesn't rely on external data source
* `-` Extra complexity incurred when querying user accounts (how can we be sure the data is up to date?)

### Write a helper script or program that inserts user account records for all places in the DB that reference an EUAID

* `+` Data is accurate
* `+` Edge cases can be handled easily
* `-` Relies on data to stay in an up to date state
* `-` Extra complexity incurred by creating a separate app / script

### A combination of approaches. Using an auxiliary script, and rely on temp records for any unforeseen edge cases

* `+` We have a higher level of confidence in the data than either other approach
* `+` Data should be up to date
* `+` Any data that is not able to be updated by the script can use the temporary data
* `-` We incur the complexity of both approaches
