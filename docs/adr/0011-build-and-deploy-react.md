# Build frontend static files and deploy to AWS s3

The EASi frontend is built in React.

We will be building the static files in CI and pushing
them into s3

## Considered Alternatives

* *Build static files and put them in Docker image with backend*
* *Build frontend files and put it in Docker image by itself*
* *Build static files and serve them from S3*

## Decision Outcome

Chosen Alternative: *Build static files and serve them from S3*

This does mean we'll need to configure the web server in a
way that allows the end user to directly refer to the static
files in s3.

## Pros and Cons of the Alternatives

### *Build static files and put them in Docker image with backend*

* `+` Positive
* `+/-` Tightly couples the frontend with the backend
* `-` Negative

### *Build frontend files and put it in Docker image by itself*

* `+` Positive
* `-` Negative

### *Build static files and serve them from S3*

* `+` Positive
* `-` Negative

## References

* [create-react-app prod build documentation](https://create-react-app.dev/docs/production-build/#static-file-caching)
