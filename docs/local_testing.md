# Testing EASi Locally

Run all tests other than Cypress in the project using `scripts/dev test`.

## Server tests

- Run `scripts/dev test:go` to run all local-only server-side tests. This requires the database to be running first. Use `scripts/dev up:backend` to start it.
- Run `scripts/dev test:go:only [path to package folder]` (e.g. `scripts/dev test:go:only "./pkg/cedar/intake`) to run server-side tests for a specific folder. Depending on the tests being run, this may require the database to be running, as above.
- Run `scripts/dev test:go:long` to run all server-side tests, including ones that contact external services.

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
  - The `APP_ENV` environment variable should be set to `test` in `.envrc.local`. After creating `.envrc.local` if necessary and adding `APP_ENV=test` to it, run `direnv allow` to enable it. (See [instructions above](#direnv) on `direnv` usage)
  - Running `login.spec.js` requires the environment variables `OKTA_TEST_USERNAME`, `OKTA_TEST_PASSWORD`, and `OKTA_TEST_SECRET` to be set in `.envrc.local`. The values can be found in 1Password, as mentioned in the [Authentication section](#authentication).
- `APP_ENV=test ./scripts/run-cypress-test-docker` : Run the Cypress tests,
  database, migrations, backend, and frontend locally in Docker, similar to how
  they run in CI. Running the tests in this way takes time, but is useful
  for troubleshooting integration test failures in CI.
