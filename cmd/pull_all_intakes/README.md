This script (`pull_all_intakes`) can be run with the following command `go run cmd/pull_all_intakes/main.go run`. The
intention behind this script is to pull all system intakes and related business cases in a format CEDAR can accept (
specifically, the format we normally publish these objects to their API). If CEDAR wants to audit their records or fill
in any gaps, they may ask us to run this and send them the results.

This script will create an `output` directory in this directory and populate with `biz_cases.json` and `intakes.json`.
The entire `output` directory is gitignored.

The below command allows you to dump prod db into a local db (basically copy/paste prod to local), then you can safely
query the new db locally.

```shell
PGPASSWORD=<prod_pw> pg_dump -h <prod_host> -p 5432 -U easiprod -Fc easiprod | \
PGPASSWORD=<local_pw> pg_restore -h localhost -p 5432 -U postgres -d postgres -C --clean
```

Change `PGDATABASE` in your `.envrc` to be `easiprod` (or rename the newly created local db to something other than
`easiprod`). Using the `-C` flag will create a new db with the name of the source db, in this case `easiprod`.
