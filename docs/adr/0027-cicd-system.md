# Use GitHub Actions for CI/CD

**User Story:** [ES 416](https://jiraent.cms.gov/browse/ES-416)

The on-premise CircleCI Enterprise offering that we currently use will be
deprecated at some point in the future and we need to identify which CI/CD
system we will migrate to.

Decision drivers:

* FedRAMP compliance
* Security
* Functionality
* Developer friendliness
* Reliability
* Maintenance cost

## Considered Alternatives

* GitHub Actions (GitHub-hosted runner)
* GitHub Actions (self-hosted runner)
* SaaS CircleCI
* AWS CodePipeline + CodeBuild (managed)
* CloudBees Core

## Decision Outcome

* Chosen Alternative: GitHub Actions (GitHub-hosted runner)

## Pros and Cons of the Alternatives <!-- optional -->

### GitHub Actions (GitHub-hosted runner)

* `+` Integration with GitHub, which we already use as our version control
  system.
* `+` Developer friendly: Workflow results are visible directly in the repo. No
  need to log into another system.
* `+` Managed: it requires zero operational overhead to maintain the servers,
  keep them patched, perform system maintenance, and other activities related to
  infrastructure management.
* `+` Highly configurable, rich feature set
* `+` Modularized configurations: Wide array of shared code and tooling
  available in the GitHub Actions marketplace
* `-` Moderate learning curve: Truss has been increasingly using GitHub Actions
  on other client projects but there will still be a learning curve and
  moderate level of effort to convert this project's CircleCI configuration to
  GitHub Actions.
* `-` It locks us into using GitHub. If we end up wanting to use some other git
  hosting solution, we will need to rewrite all of our CI configurations and
  tooling.
* `-` GitHub Actions was released for general availability in November 2019, so
  it is still a very young offering. This likely will result in rough edges that
  won't be present in more mature CI offerings.

### GitHub Actions (self-hosted runner)

* `+` Most of the same pros for GitHub-hosted runners apply here
* `+` More control over the runner's hardware and software configuration
* `-` EASi's application code is hosted in a public repository, and GitHub
  recommends only using self-hosted runners with private repositories. See
  [Self-hosted runner security with public
  repositories](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners#self-hosted-runner-security-with-public-repositories).
* `-` Higher maintenance cost than GitHub-hosted runners as it requires
  deploying and maintaining the runner infrastructure

### SaaS CircleCI

* `+` CircleCI SaaS is FedRAMP authorized at impact level LI-SaaS (low-impact)
* `+` Simple migration since we are already using CircleCI
* `+` Modularized configurations: orbs help automate repeated processes, speed
  up project setup, and enable integration with third-party tools.
* `+` Speed: it is performant, allowing users to get feedback on their code
  within seconds to minutes from the time they push their code. This is improved
  by the fact that CircleCI enables parallelized builds.
* `+` Reliable: our experience has shown that CircleCI SaaS is very reliable.
* `+` Managed: it requires zero operational overhead to maintain the servers,
  keep them patched, perform system maintenance, and other activities related to
  infrastructure management.
* `+` Debuggability: CircleCI allows people to SSH into containers, which makes
  certain debugging efforts much simpler.
* `+` Test reporting: the quality of the reports from tests is high.
* `-` Since it is designed to work with multiple version control systems, it
  lacks some of the tighter integrations with GitHub Actions

### AWS CodePipeline + CodeBuild (managed)

* `+` Both services are FedRAMP authorized
* `+` Integrates our CI/CD system with the cloud environment we deploy to
* `+` Integrates with IAM and KMS to provide granular permissions on things.
* `+` We would be able to configure the resources and manage access ourselves
* `+` There are lots of [positive
  reviews](https://www.reddit.com/r/devops/comments/bnl9xl/aws_cicd_codepipeline_codedeploy_etc_vs_git/)
  of this combination.
* `+` While [older
  reviews](https://www.reddit.com/r/devops/comments/bnl9xl/aws_cicd_codepipeline_codedeploy_etc_vs_git/en7v24t/)
  indicate that the user interface for CodePipeline is lacking, [newer
  reviews](https://www.trustradius.com/reviews/aws-codepipeline-2018-12-05-21-33-15)
  indicate that it is very intuitive.
* `-` Less friendly for developers to access and interact with the CI/CD system
* `-` The general consensus from online reviews was that it was not as good at
  meeting the needs of complex, dynamic pipelines as other CI solutions.
* `-` The general feature set of CodePipeline and CodeBuild seems to be less
  extensive than other CI offerings.
* `-` Steeper learning curve, since we do not have significant experience using
  these services

### CloudBees Core (managed)

* `+` Extensible plugin-based architecture
* `+` Integration with other CMS Cloud CI/CD tools
* `+` Managed: it requires zero operational overhead to maintain the servers,
  keep them patched, perform system maintenance, and other activities related to
  infrastructure management.
* `-` More complex onboarding and access management process than the
  alternatives
* `-` Less friendly for developers to access and interact with the CI/CD system
