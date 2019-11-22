# Build and deploy EASi backend to AWS Fargate

The EASi application backend is a server written in golang.

We want to be able to manage the infrastructure
configuration in code preferably Terraform.
We want to manage the service definition alongside other
infrastructure dependencies.
We want a deployment platform that is low effort to
maintain and has rollback capabilities.

## Considered Alternatives

* *Build AMIs and deploy EC2 instances*
* *Build Docker containers and deploy services to ECS*
* *Build Docker containers and deploy services to ECS: Fargate*

## Decision Outcome

Chosen Alternative: *Build Docker containers and deploy services to ECS: Fargate*

What is life...

## Pros and Cons of the Alternatives

### *Build AMIs and deploy EC2 instances*

* `+` This is a well practiced deployment pattern
* `+` AMIs are an immutable artifact
* `-` There's a lot of glue to properly instantiate your instances
* `-` Building AMIs is slow
* `-` You have to manage instance lifecycle (*)

`*` There is a new type of autoscaling group that can help manage
instance lifecycle based on uptime of instance but it was _just_
announced at re:Invent.

### *Build Docker containers and deploy services to ECS*

* `+` Docker containers can be immutable artifacts
* `+` Docker containers are a known pattern for Truss
* `-` Docker containers are a new pattern at CMS
* `-` You have to manage instance lifecycle

### *Build Docker containers and deploy services to ECS: Fargate*

* `+` Automated instance lifecycle management
* `-` Negative
