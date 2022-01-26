# Using `scripts/dev` for Development Tasks

Developers usually interact with `scripts/dev` as a frontend to
various development commands instead of invoking them directly.

## Available Commands

```console
$ scripts/dev
Please provide a task to run:

scripts/dev build             # Build the Go application
scripts/dev db:clean          # Deletes all rows from all tables
scripts/dev db:migrate        # Runs database migrations and wait for them to complete
scripts/dev db:recreate       # Destroys the database container and recreates it
scripts/dev db:seed           # Load development dataset
scripts/dev docker:sweep      # Delete all dangling volumes
scripts/dev down              # Stops all services in the project
scripts/dev gql               # Generate code from GraphQL schema
scripts/dev hosts:check       # Verify that hosts for local development are configured
scripts/dev lint              # Run all linters and checks managed by pre-commit
scripts/dev list              # List available tasks
scripts/dev minio:clean       # Mark all files in minio as clean (no viruses found)
scripts/dev minio:infected    # Mark all files in minio as infected (virus found)
scripts/dev minio:pending     # Mark all files in minio as pending (waiting for scan)
scripts/dev prereqs           # Check to see if the app's prerequisites are installed
scripts/dev reset             # Resets application to an empty state
scripts/dev restart           # Restart the specified container
scripts/dev tailscale         # Run app and expose to other machines over Tailscale
scripts/dev test              # Run all tests in parallel
scripts/dev test:go           # Runs Go tests
scripts/dev test:go:long      # Runs Go tests, including long ones
scripts/dev test:go:only      # Run targeted Go tests (pass path to package folder as additional options)
scripts/dev test:js           # Run JS tests (pass path to scope to that location)
scripts/dev test:js:named     # Run JS tests with a matching name (pass needle as additional option)
scripts/dev up                # Starts all services in the project
scripts/dev up:backend        # Starts all services except the frontend (runs more quickly, if frontend isn't needed)
scripts/dev up:backend:watch  # Starts all services in the foreground except the frontend (runs more quickly, if frontend isn't needed)
scripts/dev up:watch          # Starts all services in the project in the foreground
```


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

  
## Build

### Golang cli app

To build the cli application in your local filesystem:

```sh
scripts/dev build
```

You can then access the tool with the `easi` command.
