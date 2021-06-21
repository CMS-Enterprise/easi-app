# Getting prod metrics for EASi

You'll likely need to fetch metrics for us at some point for the
project to understand the impact EASi is making.

## Steps

1. Visit [EASi Production](https://easi.cms.gov)
1. Login with your EUA credentials
1. Open up the browser console and find your OKTA Access Token with the
following command:
  `JSON.parse(localStorage["okta-token-storage"])["accessToken"].value`

- The output inside of the quotes is your OKTA access token. Copy it to your
  clipboard.

1. Then in Terminal, save your access token to a local variable:
  `OKTA_TOKEN="<paste your OKTA access token here>"`

1. Also in Terminal, run the following, but change the time
to whatever makes sense for your query:

```BASH
curl -X GET 'https://easi.cms.gov/api/v1/metrics?startTime=2020-05-30T00:00:00.00Z' \
-H "Authorization: Bearer $OKTA_TOKEN"
```

This uses the effective go live date.
