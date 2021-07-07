# CMS EASi Application

This repository contains the application code for the CMS EASi (Easy Access to
System Information).

## Overview

This application is made up of the following main components:

- A Go backend that provides REST and GraphQL APIs. More information on the
  packages within that program can be found in the
  [pkg documentation](./pkg/README.md).
- A React frontend that uses [Apollo](https://www.apollographql.com/docs/react/)
- A few lambda functions for PDF generation and file upload virus scanning

We generally use Docker Compose to orchestrate running these components during
development, and developers usually interact with `scripts/dev` as a frontend to
various development commands instead of invoking them directly. Here are the
commands it currently supports:

```console
$ scripts/dev
Please provide a task to run:

scripts/dev build           # Build the Go application
scripts/dev db:clean        # Deletes all rows from all tables
scripts/dev db:migrate      # Runs database migrations and wait for them to complete
scripts/dev db:recreate     # Destroys the database container and recreates it
scripts/dev db:seed         # Load development dataset
scripts/dev docker:sweep    # Delete all dangling volumes
scripts/dev down            # Stops all services in the project
scripts/dev gql             # Generate code from GraphQL schema
scripts/dev hosts:check     # Verify that hosts for local development are configured
scripts/dev lint            # Run all linters and checks managed by pre-commit
scripts/dev list            # List available tasks
scripts/dev minio:clean     # Mark all files in minio as clean (no viruses found)
scripts/dev minio:infected  # Mark all files in minio as infected (virus found)
scripts/dev minio:pending   # Mark all files in minio as pending (waiting for scan)
scripts/dev prereqs         # Check to see if the app's prerequisites are installed
scripts/dev reset           # Resets application to an empty state
scripts/dev restart         # Restart the specified container
scripts/dev tailscale       # Run app and expose to other machines over Tailscale
scripts/dev test            # Run all tests in parallel
scripts/dev test:go         # Runs Go tests
scripts/dev test:go:long    # Runs Go tests, including long ones
scripts/dev test:go:only    # Run targeted Go tests (pass packages as additional options)
scripts/dev test:js         # Run JS tests (pass path to scope to that location)
scripts/dev test:js:named   # Run JS tests with a matching name (pass needle as additional option)
scripts/dev up              # Starts all services in the project
scripts/dev up:watch        # Starts all services in the project in the foreground
```

Some additional tools are required to work with the application source directly
on the host machine. These operations can theoretically be done within Docker as
well, but we haven't yet had the opportunity to migrate everything into it.

_Note: The `scripts/dev` utility is written in Ruby, which is installed by
default on macOS <= 11.4. The script uses only standard lib dependencies and
should work without installing a Ruby interpreter or other libraries._

### Homebrew

Install [Homebrew](https://brew.sh) using the following command:

`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

### Git

Install git using `brew install git`. If you haven't already, follow the steps
in the
[Engineering Playbook](https://github.com/trussworks/Engineering-Playbook/blob/main/developing/vcs/tools.md#git)
to configure git on your machine.

### Bash

- Ensure you are using the latest version of bash for this project:

  - Install it with Homebrew: `brew install bash`
  - Update list of shells that users can choose from:

    ```bash
    [[ $(cat /etc/shells | grep /usr/local/bin/bash) ]] \
    || echo "/usr/local/bin/bash" | sudo tee -a /etc/shells
    ```

  - If you are using bash as your shell (and not zsh, fish, etc) and want to use
    the latest shell as well, then change it (optional):
    `chsh -s /usr/local/bin/bash`
  - Ensure that `/usr/local/bin` comes before `/bin` on your `$PATH` by running
    `echo $PATH`. Modify your path by editing `~/.bashrc` or `~/.bash_profile`
    and changing the `PATH`. Then source your profile with `source ~/.bashrc` or
    `~/.bash_profile` to ensure that your terminal has it.

### Docker and docker-compose

To set up docker on your local machine:

```console
brew cask install docker
brew install docker-completion docker-compose docker-compose-completion
```

Now you will need to start the Docker service: run Spotlight and type in
"docker", then select "Docker Desktop" in the results.

**Note: The project does not work with the new docker compose v2 release that
will ship as a part of the main docker command.**

### Go

You'll need a recent version of Go. We've had very few issues with using
different versions of Go on the project. Most developers use homebrew and run
`brew install go` to use whatever the latest version is.

Be sure to add `$GOPATH/bin` to your `PATH` so that executables installed with
the go tooling can be found. Add the following to your `.bash_profile`:

```bash
export PATH=$(go env GOPATH)/bin:$PATH
```

### Yarn

We use Yarn to manage our JavaScript dependencies. Most developers install it
with `brew install yarn`.

### direnv

- Run `brew install direnv` to install this tool.
- Add the following line at the very end of your `~/.bashrc` file:
  `eval "$(direnv hook bash)"`
  - Refer to [instructions for other shells](https://direnv.net/docs/hook.html)
    if you're using a shell other than bash.
- Restart your shell.
- To allow direnv in the project directory `direnv allow .`.

Once this is setup, you should see `direnv` loading/unloading environment
variables as you enter or depart from the project directory:

```console
$ cd easi-app
direnv: loading ~/Project/easi-app/.envrc
direnv: export +EXAMPLE_ENV +EXAMPLE_ENV_ADDITIONAL +EXAMPLE_ENV_MORE ... ~PATH
$ cd ..
direnv: unloading
$
```

For additional documentation of this tool, see also:

- The [official site](https://direnv.net/)
- Truss'
  [Engineering Playbook](https://github.com/trussworks/Engineering-Playbook/tree/master/developing/direnv)

## Code checkout

You can checkout this repository by running
`git clone git@github.com:cmsgov/easi-app.git`. Please check out the code in a
directory like `~/Projects/easi-app` and NOT in your `$GOPATH`. As an example:

```bash
mkdir -p ~/Projects
git clone git@github.com:cmsgov/easi-app.git
cd easi-app
```

You will then find the code at `~/Projects/easi-app`.

### pre-commit

- Run `pre-commit install` to install a pre-commit hook into
  `./git/hooks/pre-commit`.
  - This is different than `brew install pre-commit` and must be done so that
    the hook will check files you are about to commit to the repository.
- Next install the pre-commit hook libraries with `pre-commit install-hooks`.

## Starting the application

From within the project directory, run `direnv allow` to load the default
environment variables for the project. You will need to run this command again
each time changes are made to `.envrc` or `.envrc.local`.

- Run `scripts/dev prereqs` to check your machine for dependencies that need to
  be installed. It will offer to install most of them for you.

  - This script will also offer to configure your hosts file to resolve `minio`,
    which is required to work with file uploads locally.

- Start the application using `scripts/dev reset`. This will download and build
  a bunch of Docker containers and then start the frontend, backend, and
  database, as well as run scripts to migrate the database and seed data. You
  can run this again later to restore the application to a known state during
  development.

- You should be able to visit the application by visiting
  [http://localhost:3000](http://localhost:3000) in a browser.

Run `scripts/dev` to see a list of other useful commands.

## Build

### GraphQL Generation

```sh
scripts/dev gql
```

This command will:

- Regenerate the go types and resolver definitions
- Regenerate the TypeScript types and validate `schema.graphql`

### Golang cli app

To build the cli application in your local filesystem:

```sh
scripts/dev build
```

You can then access the tool with the `easi` command.

## Database

### Migrating the Database

To add a new migration, add a new file to the `migrations` directory following
the standard `V__${last_migration_version + 1}_your_migration_name_here.sql`

Then run `scripts/dev db:migrate`.

### PostgreSQL CLI

To inspect the database from your shell, `pgcli` is recommended:

```sh
brew install pgcli
```

Thanks to variables set in the `.envrc`, connecting is simple:

```console
$ pgcli
Server: PostgreSQL 11.6 (Debian 11.6-1.pgdg90+1)
Version: 2.2.0
Chat: https://gitter.im/dbcli/pgcli
Home: http://pgcli.com
postgres@localhost:postgres> SHOW server_version;
+-------------------------------+
| server_version                |
|-------------------------------|
| 11.6 (Debian 11.6-1.pgdg90+1) |
+-------------------------------+
SHOW
Time: 0.016s
postgres@localhost:postgres>
```

## Testing

Run all tests other than Cypress in the project using `scripts/dev test`.

### Server tests

Run `scripts/dev test:go`.

### JS Tests

Run `scripts/dev test:js`.

### Cypress tests (End-to-end integration tests)

There are multiple ways to run the Cypress tests:

- Run `yarn run cypress run` to run the tests in the CLI. To have a slightly
  more interactive experience, you can instead run `yarn run cypress open`.
  Note: the database, frontend, and backend must be running prior to starting
  the Cypress tests. The `APP_ENV` environment variable should be set to `test`.
- `APP_ENV=test ./scripts/run-cypress-test-docker` : Run the Cypress tests,
  database, migrations, backend, and frontend locally in Docker, similar to how
  they run in CircleCI. Running the tests in this way takes time, but is useful
  for troubleshooting integration test failures in CI.

## Optional Setup

### LaunchDarkly

The app uses LaunchDarkly to control feature flags in deployed environments. By
default the application run in offline mode and uses default values for all
flags. To enable loading the flags from LaunchDarkly, add the following to
`.envrc.local`:

```bash
export LD_SDK_KEY=sdk-0123456789
export FLAG_SOURCE=LAUNCH_DARKLY
```

These values can be obtained from the LaunchDarkly settings page or from
1Password.

### CircleCI

If you want to make changes to the CircleCI configuration, you will need to
install the `circleci` cli tool so that the changes can be validated by
pre-commit: `brew install circleci`. This should be done automatically by
`scripts/dev prereqs`.

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

These values can be found in 1Password.

### GraphQL Playground

You can visit `http://localhost:8080/api/graph/playground` to access a GraphQL
playground while the Go backend is running. **You will need to enter
`/api/graph/query` as the query path in the UI for this to work.**

### Accessing the application over Tailscale

`scripts/dev tailscale` will configure and start the app so it can be accessed
over a TAilscale network. This is currently used by developers to perform
accessibility audits of locally running applications through JAWS on cloud
Windows instances.

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

### Prince XML Lambda

EASi runs [Prince XML](https://www.princexml.com/) as a Lambda function to
convert HTML to PDF.

See the
[easi-infra-modules](https://github.com/CMSgov/easi-infra-modules/blob/master/lambda/prince/README.md)
repo for instructions on how to build the lambda locally.

[docker-lambda](https://github.com/lambci/docker-lambda) is used to run lambda
functions locally that execute in AWS in a deployed environment.

For local development, the Prince XML Lambda should start automatically if you
run `scripts/dev up`.

#### Removing the watermark

To generate PDFs without the watermark, add one of the following environment
variables to `.envrc.local`:

```console
export LICENSE_KEY=abcdefg12345678 (set this equal to the signature field value from the Prince license - see 1Password)

# or

export LICENSE_KEY_SSM_PATH=/path/to/license/key (set this equal to the SSM path where the license key signature is stored)
```

And update `docker-compose.override.yml` to reference those variable names (do
not include the values):

```text
 prince:
    image: lambci/lambda:go1.x
    ports:
      - 9001:9001
    environment:
      - DOCKER_LAMBDA_STAY_OPEN=1
      - LICENSE_KEY
```

or

```text
 prince:
    image: lambci/lambda:go1.x
    ports:
      - 9001:9001
    environment:
      - DOCKER_LAMBDA_STAY_OPEN=1
      - LICENSE_KEY_SSM_PATH
      - AWS_ACCESS_KEY_ID
      - AWS_SECRET_ACCESS_KEY
      - AWS_SESSION_TOKEN
      - AWS_DEFAULT_REGION
```

Note: using `LICENSE_KEY_SSM_PATH` requires AWS credentials for the appropriate
environment.

## Docker Compose Files

`scripts/dev` and parts of our CI tooling rely on docker-compose. Multiple
docker-compose files exist to support different use cases and environments.

| File                        | Description                                                                                                                       |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| docker-compose.yml          | Base configuration for `db`, `db_migrate`, `easi` and `easi_client` services                                                      |
| docker-compose.override.yml | Additional configuration for running the above services locally. Also adds configuration for `minio` and `prince` lambda services |
| docker-compose.circleci.yml | Additional configuration for running end-to-end Cypress tests in CircleCI                                                         |
| docker-compose.local.yml    | Additional configuration for running end-to-end Cypress tests locally                                                             |

### Use case: Run database and database migrations locally

Use the following command if you only intend to run the database and database
migration containers locally:

```console
$ docker-compose up --detach db db_migrate
Creating easi-app_db_1 ... done
Creating easi-app_db_migrate_1 ... done
```

By default, Docker Compose reads two files, a docker-compose.yml and an optional
docker-compose.override.yml file. That's why, for the above command, you don't
need to specify which compose files to use.

Two options to take it down:

```console
docker-compose kill  # stops the running containers
docker-compose down  # stops and also removes the containers
```

You can also force rebuilding the images (e.g. after using `kill`) with
`docker-compose build`.

### Use case: Run database, database migrations, backend, and frontend locally

Use the following to run the database, database migrations, backend server, and
frontend client locally in docker.

```console
COMPOSE_HTTP_TIMEOUT=120 docker-compose up --build
```

Run the following to shut it down:

```console
docker-compose down
```
