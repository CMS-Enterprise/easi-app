# Use AWS logging tools

To better debug and monitor the EASi application
we need some kind of logging solution that allows
us easy access to log information, to send and index
logs and information,

## Considered Alternatives

* *AWS built-in tooling*
* *ELK stack*
* *Honeycomb*
* *NewRelic*

## Decision Outcome

Chosen Alternative: *AWS built-in tooling*

**Why do this?**

## Pros and Cons of the Alternatives

### *AWS built-in tooling*

AWS provides common configurations for logging of infrastructure services.
Cloudwatch and S3 are common endpoints to send both metrics and logs into
and using Cloudwatch and Athena... Athena makes it pretty easy to/

* `+` Configuration is built into the infrastructure platform
* `+` Truss has internal experience with these tools
* `+` Can be configured in Terraform
* `+` Can easily be adapted for application logs
* `-` Minor latency in logs being indexed
* `-` Thing

### *ELK stack*

* `+` Provided for us by AWS West
* `+` Required by AWS West
* `-` Kibana has a steep learning curve
* `-` Latency in the logs being indexed
* `-` It's behind a VPN

### *Honeycomb*

* `+` CMS has some kind of contract with Honeycomb
* `+` Cool log exploration tool
* `+` Easy to send what you find to each other
* `-` AWS West has not implemented this tooling
* `-` Needs additional tooling
* `-` Steep learning curve

### *NewRelic*

* `+` CMS does have a NewRelic contract
* `+` Can also do metrics
* `-` Not entirely sure CMS uses the logging feature set
* `-` Is New Relic
