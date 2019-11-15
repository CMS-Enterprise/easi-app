# Use AWS SSM Parameter Store for Config/Secrets management

The EASi application
will require configuration for different
environments it is deployed to. These values
may contain secrets. We would like to pick a
set of tools to allow us to securely manage configuration
and integrates easily into our existing toolchain.

In this ADR,
we'll decide what tools we will use
to store configuration and secrets
to enable environment level configuration
to the EASi application.

## Considered Alternatives

* *AWS Secrets Manager*
* *AWS SSM Parameter Store*
* *AWS SSM Parameter Store + Chamber*
* *Hashicorp Vault*

## Decision Outcome

Chosen Alternative: *AWS SSM Parameter store + Chamber*

This is some placeholder text about this solution

## Pros and Cons of the Alternatives

### *AWS Secrets Manager*

* `+` Positive
* `-` Negative

### *AWS SSM Parameter Store*

* `+` Positive
* `-` Negative

### *AWS SSM Parameter Store with Chamber*

* `+` Positive
* `-` Negative

### *Hashicorp Vault*

* `+` Positive
* `-` Negative
