# Working with the Postgres Database

## Modifying the database schema with migrations

To add a new migration, add a new file to the `migrations` directory, following the standard `V__${last_migration_version + 1}_your_migration_name_here.sql`.

Running `scripts/dev db:migrate` will apply the new migration to a running database; alternatively, bringing the application down and back up with `scripts/dev down` followed by `scripts/dev up` will apply all migrations. 


## PostgreSQL CLI

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