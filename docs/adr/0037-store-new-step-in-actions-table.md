# Storing the new step for an action in the Actions table

**User Story:** [EASI-3224](https://jiraent.cms.gov/browse/EASI-3224)

While working on the IT Gov v2 workflow, the backend team added a `Step` field/column to the `Action` model/table to track what step an action was associated with. There was some uncertainty about whether this should store the step an intake was in _after_ taking an action, or the step _before_ taking the action.
* `Step` was originally added in [EASI-2888](https://jiraent.cms.gov/browse/EASI-2888) for the Request Edits action and in [EASI-3019](https://jiraent.cms.gov/browse/EASI-3019) for the Progress to New Steps action; for both of these actions, the `Step` field stored the new step of the system intake, after the action was completed.
* When planning for the actions that issue decisions, we talked about using `Step` to store the _previous_ step of the intake, before taking the action, because issuing a decision always sets the intake's step to `DECISION_AND_NEXT_STEPS`.

Given this uncertainty, the backend developers met to discuss the appropriate way to use the `Step` field. We wanted the code to be clear and unambiguous about what it represented. We also kept in mind that the UX requirements for displaying the history of actions on an intake (in the Admin Notes sub-page) were somewhat unclear and in flux for IT Gov v2. We also knew that the current `actions` table doesn't quite meet all our needs for a full audit log/event log, so we're probably going to replace or substantially rework it soon.


## Considered Alternatives

* Always store the new step, after taking the action. Rename the `Step` field/column to clarify this.
* Always store the previous step that the intake was in before taking the action. Rename the `Step` field/column to clarify this.
* Store both the previous step and the new step, splitting the existing `Step` field into two fields/columns.
* Have the meaning of the `Step` field differ depending on the action type; for Request Edits and Progress to New Steps, store the new step; for actions that issue a decision, store the previous step.

## Decision Outcome

* Chosen Alternative: **Always store the new step for all actions.**

This meets our current needs for logging action history on an intake, requires minimal change of existing code, and doesn't add potentially extraneous code that might get removed when we rework the `actions` table in the future.

## Pros and Cons of the Alternatives

### Always store the new step
* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->

### Always store the previous step

* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->

### Store both the previous step and the new step

* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->

### Have the meaning of `Step` differ depending on the action type

*
*
*
