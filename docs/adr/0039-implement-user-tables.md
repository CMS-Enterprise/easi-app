# User Table implementation and Rollout Plan

**User Story:** [EASI-3341](https://jiraent.cms.gov/browse/EASI-3341)

As we look forward to future feature improvements for the EASi application, there is a need to implement User Tables. These tables will allow for per user configuration, as well as more simply storing information about each user.

As this is an existing application we need to have a mechanism in place to migrate existing data that is only a username (EUAID) to reference an entity in the user table. There are also spots in the data where a user is referenced only by name, and not by username.

To implement this, we need to be able to 
1. Get information about users
2. Store that information in the User Table
3. Migrate existing data to use the new account reference

Database migrations only happen in the DB context, so we can't query an external API when they are being run. As such, we need to come up with an approach that can update the user information at another time.

## Initial Account Implementation

### Considered Alternatives

* Write a helper script or program that inserts user account records for all places in the DB that reference an EUAID
* Insert place holder records
* A combination of approaches. Using an auxiliary script, and rely on temp records for any unforeseen edge cases


### Decision Outcome

* A combination of approaches. Using an auxiliary script, and rely on temp records for any unforeseen edge cases

An auxiliary script serves our current need the best. It will ensure that most users are have a record already in place before we attempt a migration. As a result, the migration should be smooth. 

For cases where we cannot create a user account for an existing record, we can add placeholder account information. That will allow us to create a reference to the user table for an EUAID, and handle this edge case where user information is missing.

### Pros and Cons of the Alternatives <!-- optional -->

#### Insert place holder records

* `+` This can be done during the migration
* `+` This doesn't rely on external data source
* `-` Extra complexity incurred when querying user accounts (how can we be sure the data is up to date?)

#### Write a helper script or program that inserts user account records for all places in the DB that reference an EUAID

* `+` Data is accurate
* `+` Edge cases can be handled easily
* `-` Relies on data to stay in an up to date state
* `-` Extra complexity incurred by creating a separate app / script

#### A combination of approaches. Using an auxiliary script, and rely on temp records for any unforeseen edge cases

* `+` We have a higher level of confidence in the data than either other approach
* `+` Data should be up to date
* `+` Any data that is not able to be updated by the script can use the temporary data
* `-` We incur the complexity of both approaches

## Implementation Plan

### Context

EUAIDs and full names of users are present throughout the application. As such, we need to consider a phased approach to implement this.
Special attention should be given to places in the app that reference a user different than the currently logged in user. The currently logged in user is the simplest user to reference, as they automatically can have an account reference added in the database. When another user is referenced, they don't automatically have a user account created. 

### Plan

With the above decision, we should first implement user accounts, and create accounts for all historical references.

We should implement user account references for all the places that a user besides the currently logged in user account is referenced. By doing so, we will ensure that we have a user account referenced in the database for all referenced users. This should give us confidence that every user referenced in the application has a user account.
