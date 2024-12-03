# CMS EASi Application

This repository contains the application code for CMS EASi (Easy Access to System Information).

This application has the following main components:
- A React frontend, using [Apollo](https://www.apollographql.com/docs/react/).
- A Go backend that provides REST and GraphQL APIs.
- A Postgres database.
- A few lambda functions for PDF generation and file upload virus scanning.

## Documentation

- [Program Background](./docs/background_how_we_work_composition.md)
- [Development environment setup](./docs/dev_environment_setup.md)
- [Contributing](./CONTRIBUTING.md)
- [Architecture Decision Records (ADRs)](./docs/adr)
- [Frontend docs](./src/README.md)
- [Backend docs](./pkg/README.md)
- [Running development tasks with `scripts/dev`](./docs/dev_script_usage.md) - includes instructions on running the application locally
- GraphQL development
  - [Playground usage](./docs/graphql_playground.md)
  - [Schema modification and backend code](./pkg/README.md#graphql-graph)
  - [Frontend code](./src/README.md#graphql)
- [Working with the database](./docs/database.md) - includes instructions on modifying the database schema
- [Testing locally](./docs/local_testing.md)
- [Docker Compose files and usage](./docs/docker_compose.md)
- [Deployment Process](./docs/operations/deployment_process.md)
- [Interacting with CEDAR](./docs/cedar.md) - CEDAR is a CMS system whose API we interact with; this includes instructions on how to connect to it


## Repository Structure

This repository has several major subfolders:

- `.github` contains GitHub-related configuration; notably, `.github/workflows` contains the workflow definitions for CI/CD through GitHub Actions.
- `.storybook` contains configuration for [Storybook](https://storybook.js.org/), which can be used for viewing and designing React components in isolation.
- `.vscode` contains settings and suggested extensions for developing in VS Code.
- `cmd` contains Go CLI scripts for various utilities.
- `config/tls` contains certificates that need to be trusted by the EASi backend.
- `cypress` contains end-to-end/functional tests using [Cypress][https://www.cypress.io/], as well as necessary configuration.
- `docs` contains general documentation for the EASi application; the `docs/adr` subfolder contains records of architectural decisions, while `docs/operations` contains information on operational procedures such as deploying the application.
- `migrations` contains SQL files that together define the database schema; these are deployed using [Flyway](https://flywaydb.org/).
- `pkg` contains the Go source code for the application's backend.
- `public` contains static assets for the frontend.
- `scripts` contains Bash and Ruby scripts used for various development and operational tasks.
- `src` contains the TypeScript source code for the application's React frontend.

## Optional Setup

### LaunchDarkly

The app uses LaunchDarkly to control feature flags in deployed environments. By default the application run in offline mode and uses default values for all flags. To enable loading the flags from LaunchDarkly, add the following to `.envrc.local`:

```bash
export LD_SDK_KEY=sdk-0123456789
export FLAG_SOURCE=LAUNCH_DARKLY
```

These values can be obtained from the LaunchDarkly settings page or from 1Password.

To modify the default flags being used, edit [`src/views/FlagsWrapper/index.tsx`](./src/views/FlagsWrapper/index.tsx). In the call to `asyncWithLDProvider()` inside `useEffect()`, modify the values being passed as the `flags` option.

### 1Password

_See also:
[ADR on how we share secrets](./docs/adr/0019-use-1password-for-sharing-secrets.md)_

Truss have set up a [1Password vault](https://cmseasi.1password.com) for EASi
engineers to securely share secrets, such as API keys. You will need to be
invited to generate login credentials.

If you need access to a secret that is not in the EASi vault, please ask for
someone to add it to the vault.

### Cloud Services

You may need to access cloud service to develop the application. This allows
access to AWS resources (ex. SES Email).

Follow the instructions in the infra repo
[here](https://github.com/CMSgov/easi-infra#ctkey-wrapper). You'll need to add
the infra account environment variables to your `.envrc.local`. You can then run
the `ctkey` command to get/set AWS environment variables.

```bash
https_proxy=localhost:8888 \\
ctkey --username=$CTKEY_USERNAME \\
--password=$CTKEY_PASSWORD \\
--account=$AWS_ACCOUNT_ID \\
--url=$CTKEY_URL \\
--idms=$CT_IDMS \\
--iam-role=$CT_AWS_ROLE setenv
```

Eventually, we will move this over to wrapper so developers do not need to
manually run these commands.

## Development and Debugging

(#authentication)
### Authentication

The application has two authentication modes. The main mode is to use Okta to
authenticate using hosted services. The second is to use a local-only login mode
that avoids this network dependency.

To sign in using local mode, Click the **Use Local Auth** button on the sign in
page. This is only provided when running the app locally.

To enable Okta authentication locally, add the following values to
`.envrc.local`:

```bash
export OKTA_TEST_USERNAME=
export OKTA_TEST_PASSWORD=
export OKTA_TEST_SECRET=
```

These values can be found in 1Password under "CMS IDM Test Account".

### Routes Debugging

Setting the `DEBUG_ROUTES` environment variable, and upon startup, this will log
out a representation of all routes that have been registered.

```shell
$ DEBUG_ROUTES=1 ./bin/easi serve
...
ROUTE: /api/v1/healthcheck
Path regexp: ^/api/v1/healthcheck$
Queries templates:
Queries regexps:

ROUTE: /api/graph/playground
Path regexp: ^/api/graph/playground$
Queries templates:
Queries regexps:
...
```

### Minio

[MinIO](https://min.io/) is an S3 compatible object store. It ships as a Docker
container and accepts normal AWS S3 API requests. This allows us to test file
uploading functionality in our local development environments without needing to
interact with CMS AWS accounts.

The container is configured as part of our `docker-compose.yml` and should be
running when you `scripts/dev up`.

The container is accessed from the browser using the hostname `minio`. To make
this work, run `scripts/dev hosts:check` and press enter to setup this hostname
on your machine.

You can use `scripts/dev minio:clean`, `scripts/dev minio:infected`, or
`scripts/dev minio:pending` to modify the virus scanning status of files in
minio during development.
