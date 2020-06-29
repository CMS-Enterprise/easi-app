# Getting prod metrics for EASi

You'll likely need to fetch metrics for us at some point for the
project to understand the impact EASi is making.

## Steps

1) Visit [EASi Production](https://cms.easi.gov)
2) Login with your EUA credentials
3) Open up the browser console

    - Type in `localStorage["okta-token-storage"]`
    - Parse the output for the `accessToken's value`

4) Then in Terminal, run the following, but change the time
to whatever makes sense for your query:

```BASH
$ curl -X GET 'https://easi.cms.gov/api/v1/metrics?startTime=2020-05-30T00:00:00.00Z' \
-H 'Authorization: Bearer (PASTE accessToken's VALUE HERE)'
```

This uses the effective go live date.
