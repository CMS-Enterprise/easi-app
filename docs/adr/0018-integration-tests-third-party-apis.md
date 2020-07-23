# Mock third-party APIs in CI/CD integration tests

**User Story:** [EASi 688](https://jiraent.cms.gov/browse/EASI-688)

When running integration tests in our CI environment, how will EASi test the
calls to third-party APIs? Will those API calls be mocked or will they hit the
live APIs? The main driver behind this ADR is CEDAR integration tests, and a
desire to sufficiently test EASI-CEDAR integration while providing fast feedback
in CI. Okta tests are out of scope.

## Considered Alternatives

* Do not mock the API calls
* Mock the API calls

## Decision Outcome

* Chosen Alternative: Mock the API calls, as this will speed up the tests and
  reduce operational and networking overhead from the CI environment.
Additionally, the health check tests that run on server startup already provide a
base level of integration test for the deployed environments.

## Pros and Cons of the Alternatives <!-- optional -->

### Do not mock the API calls

* `+` Tests the code as it will run in deployed environments
* `+` Eliminates need to write additional mock code
* `-` Tests take longer to run
* `-` Sending and storing the same test data to the third-party API in each
  test run would likely require a solution to clear out or reset the test data
before each test run
* `-` Adds traffic load on the third-party API
* `-` Adds networking dependencies to the CI test environment

### Mock the API calls

* `+` Health check tests that run on server startup in deployed environments
  already test that the deployed environment is successfully integrated
with the external API
* `+` Tests run faster
* `+` Tests would run in a clean environment on each run; no extra steps needed
  to delete previous test data
* `+` Tests are focused on code that we control
* `+` Follows a design-by-contract methodology
* `+` Removes networking dependencies from the CI test environment
* `+` Reduces traffic load on the third-party API
* `-` Tests do not fully match the code as it will run in deployed environments
* `-` Requires writing additional mock code
