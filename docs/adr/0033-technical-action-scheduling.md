# Technical Action Scheduling

**User Story:** [EASI - 1603](https://jiraent.cms.gov/browse/EASI-1603)

Users would like to be notified 60 days before an LCID is expiring so that they can take actions to extend it. 

As the application grows, it would be beneficial to have standard functionality for scheduled action implementation.

*[decision drivers | forces]* 
- priority to simplicity and  extensibility
<!-- 
optional -->

## Considered Alternatives

* *[alternative 1]*
* AWS ECS Scheduled Task
* Bespoke Publication Subscription Queue
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

### AWS ECS Scheduled Tasks

* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->

### Bespoke Publication Subscription Service, and Endpoint Queue

* `+` Tailored specifically to applications needs
* `+` Doesn't require the addition of a lot of additional dependencies to be added. 
* `+` Extensible if further actions should be taken on an action
* `-` Will require extra boilerplate work that might be handled in a package
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->  
 
