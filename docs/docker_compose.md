# Docker Compose File Structure and Usage

`scripts/dev` and parts of our CI tooling rely on docker-compose. Multiple
docker-compose files exist to support different use cases and environments.

| File                          | Description                                                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [docker-compose.yml](../docker-compose.yml)            | Base configuration for `db`, `db_migrate`, `easi` and `easi_client` services                                                      |
| [docker-compose.override.yml](../docker-compose.override.yml)   | Additional configuration for running the above services locally. Also adds configuration for `minio` and `prince` lambda services |
| [docker-compose.cypress_ci.yml](../docker-compose.cypress_ci.yml) | Additional configuration for running end-to-end Cypress tests in Github Actions                                                   |
| [docker-compose.cypress_local.yml](../docker-compose.cypress_local.yml)      | Additional configuration for running end-to-end Cypress tests locally                                                             |
| [docker-compose.tailscale.yml](../docker-compose.tailscale.yml) | Additional configuration for using Tailscale to expose a locally-running application to other computers
| [docker-compose.ci_server_test.yml](../docker-compose.ci_server_test.yml) | Additional configuration for running server-side tests in GitHub Actions

## Use case: Run database and database migrations locally

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

## Use case: Run database, database migrations, backend, and frontend locally

Use the following to run the database, database migrations, backend server, and frontend client locally in docker.

```console
COMPOSE_HTTP_TIMEOUT=120 docker-compose up --profile frontend --build
```

Run the following to shut it down:

```console
docker-compose --profile frontend down
```
