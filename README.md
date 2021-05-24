# CMS EASi Application

This repository contains the application code
for the CMS EASi (Easy Access to System Information).

## Codebase Layout

## Go

The server portion of the application is written in Go.
More information can be found in the [pkg documentation](./pkg/README.md).

## Application Setup

### Setup: Developer Setup

There are a number of things you'll need at a minimum
to be able to check out,
develop,
and run this project.

- Install [Homebrew](https://brew.sh)
  - Use the following command
    `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
- We normally use the latest version of Go
  unless there's a known conflict
  (which will be announced by the team)
  or if we're in the time period just after a new version has been released.
  - Install it with Homebrew:
    `brew install go`
  - **Note**:
    If you have previously modified your PATH to point to a specific version of go,
    make sure to remove that.
    This would be either in your `.bash_profile` or `.bashrc`,
    and might look something like
    `PATH=$PATH:/usr/local/opt/go@1.12/bin`.
- Ensure you are using the latest version of bash for this project:

  - Install it with Homebrew:
    `brew install bash`
  - Update list of shells that users can choose from:

    ```bash
        [[ $(cat /etc/shells | grep /usr/local/bin/bash) ]] \
        || echo "/usr/local/bin/bash" | sudo tee -a /etc/shells
    ```

  - If you are using bash as your shell
    (and not zsh, fish, etc)
    and want to use the latest shell as well,
    then change it (optional): `chsh -s /usr/local/bin/bash`
  - Ensure that `/usr/local/bin` comes before `/bin`
    on your `$PATH` by running `echo $PATH`.
    Modify your path by editing `~/.bashrc` or `~/.bash_profile`
    and changing the `PATH`.
    Then source your profile with `source ~/.bashrc` or `~/.bash_profile`
    to ensure that your terminal has it.

- **Note**:
  If you have previously used yarn or Golang, please make sure none
  of them are pinned to an old version by running `brew list --pinned`.
  If they are pinned, please run `brew unpin <formula>`.
  You can upgrade these formulas instead of installing by running
  `brew upgrade <formula`.

### Setup: Git

Use your work email when making commits to our repositories.
The simplest path to correctness is setting global config:

```bash
git config --global user.email "trussel@truss.works"
git config --global user.name "Trusty Trussel"
```

If you drop the `--global` flag,
these settings will only apply to the current repo.
If you ever re-clone that repo or clone another repo,
you will need to remember to set the local config again.
You won't.
Use the global config. :-)

For web-based Git operations,
GitHub will use your primary email unless you choose
"Keep my email address private".
If you don't want to set your work address as primary,
please [turn on the privacy setting](https://github.com/settings/emails).

Note that with 2-factor-authentication enabled,
in order to push local code to GitHub through HTTPS,
you need to [create a personal access token](https://gist.github.com/ateucher/4634038875263d10fb4817e5ad3d332f)
and use that as your password.

### Setup: Golang

All of Go's tooling expects Go code to be checked out in a specific location.
Please read about [Go workspaces](https://golang.org/doc/code.html#Workspaces)
for a full explanation.
If you just want to get started,
then decide where you want all your go code to live
and configure the GOPATH environment variable accordingly.
For example,
if you want your go code to live at `~/code/go`,
you should add the following like to your `.bash_profile`:

```bash
export GOPATH=~/code/go
```

Golang expects the `GOPATH` environment variable to be defined.
If you'd like to use the default location,
then add the following to your `.bash_profile`
or hard code the default value.
This line will set the GOPATH environment variable
to the value of `go env GOPATH`
if it is not already set.

```bash
export GOPATH=${GOPATH:-$(go env GOPATH)}
```

**Regardless of where your go code is located**,
you need to add `$GOPATH/bin` to your `PATH`
so that executables installed with the go tooling can be found.
Add the following to your `.bash_profile`:

```bash
export PATH=$(go env GOPATH)/bin:$PATH
```

Finally to have these changes applied to your shell,
you must `source` your profile:

```bash
source ~/.bash_profile
```

You can confirm that the values exist with:

```bash
env | grep GOPATH
# Verify the GOPATH is correct
env | grep PATH
# Verify the PATH includes your GOPATH bin directory
```

### Setup: Project Checkout

You can checkout this repository by running
`git clone git@github.com:cmsgov/easi-app.git`.
Please check out the code in a directory like
`~/Projects/easi-app` and NOT in your `$GOPATH`. As an example:

```bash
mkdir -p ~/Projects
git clone git@github.com:cmsgov/easi-app.git
cd easi-app
```

You will then find the code at `~/Projects/easi-app`.
You can check the code out anywhere EXCEPT inside your `$GOPATH`.
So this is customization that is up to you.

### Setup: 1Password

_See also: [ADR on how we share secrets](./docs/adr/0019-use-1password-for-sharing-secrets.md)_

Truss have set up a [1Password vault](https://cmseasi.1password.com) for
EASi engineers to securely share secrets, such as API keys. You will need to be
invited to generate login credentials.

If you need access to a secret that is not in the EASi vault, please ask for
someone to add it to the vault.

### Setup: direnv

Run `brew install direnv` to install.
Add the following line at the very end of your `~/.bashrc`
file: `eval "$(direnv hook bash)"`, and then restart your shell.
(Here are [instructions for other shells](https://direnv.net/docs/hook.html).)
To allow direnv in the project directory `direnv allow .`.

Once this is setup, you should see `direnv` loading/unloading
environment variables as you enter or depart from the
project directory:

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
- Truss' [Engineering Playbook](https://github.com/trussworks/Engineering-Playbook/tree/master/developing/direnv)

### Setup: Yarn (temporary)

Run `brew install yarn` to install yarn.
Run `yarn install` to install dependencies.

This is temporary for setting up pre-commit package,
until we decide how to structure our CLI tools.

### Setup: Pre-Commit

Run `pre-commit install`
to install a pre-commit hook
into `./git/hooks/pre-commit`.
This is different than `brew install pre-commit`
and must be done
so that the hook will check files
you are about to commit to the repository.
Next install the pre-commit hook libraries
with `pre-commit install-hooks`.

### Setup: CircleCI (optional)

If you want to make changes to the CircleCI configuration, you will need to
install the `circleci` cli tool so that the changes can be validated by
pre-commit: `brew install circleci`

### Setup: Docker

To set up docker on your local machine:

```console
brew cask install docker
brew install docker-completion
```

Now you will need to start the Docker service: run Spotlight and type in
'docker'.

#### docker-compose

One option for running the app and its dependencies is to use
[`docker-compose`](https://docs.docker.com/compose/):

```console
brew install docker-compose
brew install docker-compose-completion  # optional
```

Multiple docker-compose files exist to support different use cases and
environments.

| File                        | Description                                                                                                                       |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| docker-compose.yml          | Base configuration for `db`, `db_migrate`, `easi` and `easi_client` services                                                      |
| docker-compose.override.yml | Additional configuration for running the above services locally. Also adds configuration for `minio` and `prince` lambda services |
| docker-compose.circleci.yml | Additional configuration for running end-to-end Cypress tests in CircleCI                                                         |
| docker-compose.local.yml    | Additional configuration for running end-to-end Cypress tests locally                                                             |

##### Use case: Run database and database migrations locally

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

##### Use case: Run database, database migrations, backend, and frontend locally

Use the following to run the database, database migrations, backend server, and
frontend client locally in docker.

```console
COMPOSE_HTTP_TIMEOUT=120 docker-compose up --build
```

Run the following to shut it down:

```console
docker-compose down
```

### Setup: Cloud Services

You may need to access cloud service
to develop the application.
This allows access to AWS resources (ex. SES Email).

Follow the instructions in the infra repo
[here](https://github.com/CMSgov/easi-infra#ctkey-wrapper).
You'll need to add the infra account environment variables
to your `.envrc.local`.
You can then run the `ctkey` command
to get/set AWS environment variables.

```bash
https_proxy=localhost:8888 \\
ctkey --username=$CTKEY_USERNAME \\
--password=$CTKEY_PASSWORD \\
--account=$AWS_ACCOUNT_ID \\
--url=$CTKEY_URL \\
--idms=$CT_IDMS \\
--iam-role=$CT_AWS_ROLE setenv
```

Eventually, we will move this over to wrapper
so developers do not need to manually run these commands.

### Live Reload Go with Air (Optional)

If you want to reload the Go application on changes locally,
you can use [Air](github.com/cosmtrek/air)

Install it:

```bash
go get -u github.com/cosmtrek/air
```

Run it:

```bash
air
```

It's not currently set up to run with docker.
You can edit the config [here](.air.conf)

### Setup: Minio

[MinIO](https://min.io/) is an S3 compatible object store.
It ships as a Docker container and accepts normal AWS S3
API requests. This allows us to test file uploading functionality
in our local development environments without needing to interact
with CMS AWS accounts.

The container is configured as part of our `docker-compose.yml` and
should be running when you `docker-compose up`. You'll need to set
two environment variables locally in your `.envrc.local` file:

```bash
export MINIO_ACCESS_KEY='minioadmin'
export MINIO_SECRET_KEY='minioadmin'
```

The container is accessed from the browser using the hostname 'minio'. To make
this work, run `scripts/dev hosts:check` and press enter to setup this hostname
on your machine.

### Setup: Prince XML Lambda

EASi runs [Prince XML](https://www.princexml.com/) as a Lambda function to
convert HTML to PDF.

See the [easi-infra-modules](https://github.com/CMSgov/easi-infra-modules/blob/master/lambda/prince/README.md)
repo for instructions on how to build the lambda locally.

[docker-lambda](https://github.com/lambci/docker-lambda) is used to run lambda functions
locally that execute in AWS in a deployed environment.

For local development, the Prince XML Lambda should start automatically if you
run `docker-compose up`.

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

## Build

### GraphQL Generation

Regenerate the go types and resolver definitions:

```shell
go generate ./...
```

Regenerate the TypeScript types and validate `schema.graphql`:

```shell
yarn generate
```

### Swagger Generation

(Most developers will not need to do this. It is rarely done, only
when updating our client to the CEDAR APIs. The output of these
instructions are checked into the repository.)

The EASi server uses Swagger generation
to access APIs from CEDAR (the data source).
Swagger specs (EASi and LDAP) can be downloaded from webMethods:

- [IMPL](https://webmethods-apigw.cedarimpl.cms.gov)

Put these files in ️`$CEDAR_EASI_DIRECTORY` and `$CEDAR_LDAP_DIRECTORY`, respectively,
and name them `swagger-<env>.yaml` respectively per environment.

If you haven't run go-swagger before,
you'll need to install it.
Run:

```shell script
go build -o bin/swagger github.com/go-swagger/go-swagger/cmd/swagger
```

Then, to generate the clients run:

```shell script
swagger generate client -f $CEDAR_EASI_SWAGGER_FILE -c $CEDAR_EASI_DIRECTORY/gen/client -m $CEDAR_EASI_DIRECTORY/gen/models
```

and

```shell script
swagger generate client -f $CEDAR_LDAP_SWAGGER_FILE -c $CEDAR_LDAP_DIRECTORY/gen/client -m $CEDAR_LDAP_DIRECTORY/gen/models
```

### Golang cli app

To build the cli application in your local filesystem:

```sh
go build -a -o bin/easi ./cmd/easi
```

You can then access the tool with the `easi` command.

### Migrating the Database

To add a new migration, add a new file to the `migrations` directory
following the standard
`V_${last_migration_version + 1}_your_migration_name_here.sql`

## Testing

### Server tests

Once your developer environment is setup,
you can run tests with the `easi test` command.

If you run into various `(typecheck)` errors when
running `easi test` follow the directions for [installing
golangci-lint](https://github.com/golangci/golangci-lint#install)
to upgrade golangci-lint.

### Cypress tests (End-to-end integration tests)

There are multiple ways to run the Cypress tests:

- Run `npx cypress run` to run the tests in the CLI. To have a slightly more interactive
  experience, you can instead run `npx cypress open`. Note: the database,
  frontend, and backend must be running prior to starting the Cypress tests.
  The `APP_ENV` environment variable
  should be set to `test`.
- `APP_ENV=test ./scripts/run-cypress-test-docker` : Run the Cypress tests, database,
  migrations, backend, and frontend locally in Docker, similar to how they run
  in CircleCI. Running the tests in this way takes time, but is useful for
  troubleshooting integration test failures in CI.

## Development and Debugging

### APIs

To start the API server: `$ ./bin/easi serve`
The APIs reside at `localhost:8080` when running.
To run a test request,
you can send a GET to the health check endpoint:
`curl localhost:8080/api/v1/healthcheck`

### Front-End

To start the JavaScript application serving: `$ yarn start`

### GraphQL Playground

You can visit `http://localhost:8080/api/graph/playground`
to access a GraphQL playground while
the Go backend is running. **You will need to enter `/api/graph/query` as the query
path in the UI for this to work.**

### Authorization

Setting this `APP_ENV` environment variable to "local"
will turn off API authorization.
This allows you to debug quickly without retrieving Okta access tokens.

If you need to test the authorization,
unset that environment variable.
You can then retrieve access tokens
by logging into [the development app](dev.easi.cms.gov)
and copying `okta-token-storage/accessToken` from the browser's local storage.
Place this in the `Authorization` header
as `Bearer ${accessToken}`.

### Routes Debugging

Setting the `DEBUG_ROUTES` environment variable, and upon startup, this will
log out a representation of all routes that have been registered.

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
