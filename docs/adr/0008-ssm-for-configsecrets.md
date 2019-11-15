# Use AWS SSM Parameter Store for Config/Secrets management

The EASi application
will require a set of command line utilities
to setup, test, and serve the application.
These scripts are executed
in local developer environments
and in the CI/CD pipeline.
Similar to the application itself,
these scripts require a language,
framework,
and organization patterns
to create and maintain their value.

In this ADR,
we'll decide what language and packages
will be used for writing scripts.
The main drivers for this decision
are ease of setup,
maintainability,
and developer adoption.

## Considered Alternatives

* *AWS Secrets Manager*
* *AWS SSM Parameter Store*
* *AWS SSM Parameter Store + Chamber*
* *Hashicorp Vault*

## Decision Outcome

Chosen Alternative: *AWS SSM Parameter store + Chamber*

Since Go is in the same language as the server application,
it should allow for a lower learning curve
and higher adoption among developers.
Many services we're looking to work with
(such as Docker, AWS, Postgres)
have Go packages that will help us write
develop a set of resources
that are more maintainable in the long term
than Make or Bash.
We're electing to add the Cobra library
because it offers substantial value
in its command line flag
and configuration packages.
The maintainability of Cobra style code
should outweighs the complexity of setting up a third party package.

We can mitigate some of the downsides of Go
by building out command execution helpers,
and using Go packages as opposed to executing to shell.

## Pros and Cons of the Alternatives

### *AWS Secrets Manager*

* `+` In the same language as the server application
* `+` Standardization around code style
* `+` Support for packaging/easier organization
* `+` Lower learning curve than bash
* `-` Verbose for scripting
* `-` Requires a package to run other command line tools
* `-` Flag and config support isn't great

### *AWS SSM Parameter Store*

### *AWS SSM Parameter Store with Chamber*

### *Hashicorp Vault*
