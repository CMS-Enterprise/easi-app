# Testing EASi Locally

Run all tests other than Cypress in the project using `scripts/dev test`.

## Server tests

- Run `scripts/dev test:go` to run all local-only server-side tests. This requires the database to be running first. Use `scripts/dev up:backend` to start it.
- Run `scripts/dev test:go:only [full package name]` (e.g. `scripts/dev test:go:only "github.com/cms-enterprise/easi-app/pkg/cedar/core"`) to run server-side tests for a specific folder. Depending on the tests being run, this may require the database to be running, as above.
- Run `scripts/dev test:go:long` to run all server-side tests, including ones that contact external services.
- A single test method in a [`testify`](https://pkg.go.dev/github.com/stretchr/testify@v1.7.0) test suite can be run from the command line with `go test -race <package name> -testify.m <method name>`. This can be useful in cases where a test suite has many tests or if you just want to run a unit test without running tests that require external dependencies. Example:
```
go test -race "github.com/cms-enterprise/easi-app/pkg/services" -testify.m TestUpdateRejectionFields
```
This will run the `TestUpdateRejectionFields` method in [`pkg/services/system_intakes_test.go`](/pkg/services/system_intakes_test.go), which is part of the test suite for the entire `services` package.
- A single test method using the standard go testing package can be run from the command line with `go test -race <package name> -run <test name>`.  Example:
```
go test -race "github.com/cms-enterprise/easi-app/pkg/graph/resolvers" -run TestCalculateSystemIntakeAdminStatus
```
This will run the `TestCalculateSystemIntakeAdminStatus` method in [`pkg/graph/resolvers/system_intake_status_admin_test.go`](/pkg/graph/resolvers/system_intake_status_admin_test.go), which is part of the test suite for the entire `resolvers` package.


## JS Tests

Run `scripts/dev test:js`.

## Cypress tests (End-to-end integration tests)

There are multiple ways to run the Cypress tests:

- Run `yarn cypress run` to run the tests in the CLI.
- To have a more interactive experience, you can instead run `yarn cypress open`.
  - Windows+WSL users will need some additional setup to run graphical applications from within WSL.
    - Option 1: Use the preview features available in Windows Insiders build. See [Microsoft docs](https://docs.microsoft.com/en-us/windows/wsl/tutorials/gui-apps).
    - Option 2: Set up an X server on Windows and configure WSL to use it. See [this article](https://wilcovanes.ch/articles/setting-up-the-cypress-gui-in-wsl2-ubuntu-for-windows-10/) for details.
  - Note: the database, frontend, and backend must be running prior to starting the Cypress tests. Use `scripts/dev up` to start them.
  - Before each testing run, run `scripts/dev db:clean && scripts/dev db:seed` to reset the database to a pre-seeded state.
  - The `APP_ENV` environment variable should be set to `test` in `.envrc.local`. After creating `.envrc.local` if necessary and adding `APP_ENV=test` to it, run `direnv allow` to enable it. (See [instructions](./dev_environment_setup.md#Direnv) on `direnv` usage)
  - Running `login.spec.js` requires the environment variables `OKTA_TEST_USERNAME`, `OKTA_TEST_PASSWORD`, and `OKTA_TEST_SECRET` to be set in `.envrc.local`. The values can be found in 1Password, as mentioned in the [Authentication section](#authentication).
- `APP_ENV=test scripts/run-cypress-test-docker` : Run the Cypress tests,
  database, migrations, backend, and frontend locally in Docker, similar to how
  they run in CI. Running the tests in this way takes time, but is useful
  for troubleshooting integration test failures in CI.

## Testing email

In order to test sending email, the Docker Compose files for running the application locally include a container running [MailCatcher](https://mailcatcher.me/), which acts as a basic SMTP server. It also provides a web UI at http://127.0.0.1:1080/ for viewing all emails sent via the MailCatcher container. EASi is configured to use this as its email server when running locally; when running tests or using EASi locally, the MailCatcher UI can be used to verify that emails are being sent to/from the correct addresses, with the correct contents.
