# GraphQL Playground

## Running Locally

You can visit `http://localhost:8080/api/graph/playground` to access a GraphQL playground while the Go backend is running. You will need to enter `/api/graph/query` as the query path in the UI for this to work.

### Authorization

The GraphQL endpoints require a valid `Authorization` header to use, which can be set in the "HTTP Headers" section in the lower-left of the playground. The value for this header is `"Local <JSON string>"` with quotes in the JSON string escaped. At a minimum, you'll need to set `favorLocalAuth: true` in the JSON payload, like so:

```
{ "Authorization":"Local {\"favorLocalAuth\":true}"}
```

#### Job Codes

Job codes can be included in an array for querying endpoints such as `systemIntake` that require them:

```
{ "Authorization":"Local {\"favorLocalAuth\":true, \"jobCodes\":[\"EASI_D_GOVTEAM\"]}"}
```
Additional job codes beyond/instead of `EASI_D_GOVTEAM` can be included in the `jobCodes` array, just make sure to escape the `"`'s around the job code names.

#### EUA ID

An EUA ID is needed for some endpoints such as creating system intakes; this can be added with the `EUAID` field:

```
{ "Authorization":"Local {\"EUAID\":\"ABCD\",\"favorLocalAuth\":true, \"jobCodes\":[\"EASI_D_GOVTEAM\", \"EASI_D_508_USER\"]}"}
```


## Running in Deployed Environments

The GraphQL playground can also be used in the deployed dev/impl/prod environments. Access it with the same `/api/graph/playground` path, with the appropriate domain, i.e. `https://dev.easi.cms.gov/api/graph/playground`. You'll still need to enter `/api/graph/query` in the playground UI. To authenticate, you'll need to log in to the environment, then get the Bearer token returned by Okta. The easiest way to do this is by opening the browser dev tools, then running the following command:

```
JSON.parse(localStorage.getItem('okta-token-storage')).accessToken.value
```

This will return a long base64-encoded string:

![Browser dev tools console, showing the result of the above command](./images/graphql_playground/browser_console.png)


Copy the string (_without_ the surrounding quotes). In the GraphQL playground, in HTTP Headers, enter 
```
{"Authorization":"Bearer <insert token here>"}
```
to authenticate your requests.

![GraphQL Playground, HTTP Headers section, showing the Authorization header with the token added](./images/graphql_playground/graphql_playground_header.png)
