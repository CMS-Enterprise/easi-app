# System intakes backfill

Systems (and their lifecycle IDs) that are created outside EASi can be imported
using data backfill. When run, the backfill program loads data from the
provided CSV and sends it to the backend over HTTP.

The backfill script needs three environment variables to be set:

```text
BACKFILL_FILE # path to csv for import
BACKFILL_HOST # host (with scheme)
BACKFILL_AUTH # JWT
```

## Preparations

1. Uncomment the backfill handler in `pkg/server/routes.go`. Merge and
   deploy this change.

2. Make sure the CSV to be imported is available on the local filesystem.
   You will need to make sure that it contains 25 columns. We have typically
   needed to manually fill some of the missing values (specifically contract
   dates) in the XLS files that are exported from Sharepoint before then saving
   the data as a CSV.

## Importing data

1. Login with your EUA credentials

2. Open up the browser console and find your OKTA Access Token with the
   following command:

   ```javascript
   JSON.parse(localStorage['okta-token-storage'])['accessToken'].value;
   ```

   If you are developing in a local environment, use
   `localStorage["dev-user-config"]` instead.

   The output inside of the quotes is your OKTA access token. Copy it to your
   clipboard.

3. Then in Terminal, save your access token to a local variable:
   `export BACKFILL_AUTH="<paste your OKTA access token here>"`

4. Execute the import.

   To run locally:

   ```console
   env BACKFILL_FILE=$path-to-file BACKFILL_HOST=http://localhost:8080 go run ./cmd/backfill/main.go
   ```

   To run against production:

   ```console
   env BACKFILL_FILE=$path-to-file BACKFILL_HOST=https://cms.easi.gov go run ./cmd/backfill/main.go
   ```
