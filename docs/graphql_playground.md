# GraphQL Playground

You can visit `http://localhost:8080/api/graph/playground` to access a GraphQL playground while the Go backend is running. You will need to enter `/api/graph/query` as the query path in the UI for this to work. You'll also need to add the following to HTTP Headers (in the lower-left) to avoid auth errors:
```
{ "Authorization":"Local {\"favorLocalAuth\":true}"}
```

Additionally, you can define EUA job codes in the `Authorization` header that will be used when querying endpoints such as `systemIntake` that require them. The syntax is:
```
{ "Authorization":"Local {\"favorLocalAuth\":true, \"jobCodes\":[\"EASI_D_GOVTEAM\"]}"}
```
Additional job codes beyond/instead of `EASI_D_GOVTEAM` can be included in the `jobCodes` array, just make sure to escape the `"`'s around the job code names.