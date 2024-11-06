# Contributing

## Branch Naming

Branches need to follow a naming pattern based on the type of branch being created:
- `feature/EASI-####_description` should be used when developing a feature branch that will have multiple other branches merged into it. Feature branches should merge directly into `main`.
  - `EASI-####` is a the Jira issue number for the parent issue/story
  - `description` is a short description of the feature being developed
- `task/EASI-####_description` should be used when developing a task branch that will be merged into a feature branch. Task branches should merge into the feature branch they are associated with.
  - `EASI-####` is a the Jira issue number for the *parent* Jira issue, *NOT* the child issue.
  - `description` is a short description of the work
- `EASI-####/description` should be used for any other branch that is not a feature or task branch. The most common case for this pattern will be an issue in Jira that doesn't have any parent or child issues (e.g. a bugfix). These branches should merge directly into `main`.
  - `EASI-####` is a the Jira issue number for the related Jira issue.
  - `description` is a short description of the work being completed in this branch
- `NOREF/description` should be used for any branch that is not associated with a Jira issue. These branches should merge directly into `main`.
  - This should only be used in rare cases where a branch is needed for a change that is not associated with a Jira issue.

### Example

Let's say we're developing a new feature to add animations to the homepage. The Jira issue for this feature is `EASI-1234`. You could expect to see the following branches and PRs throughout the development of this feature:
- `feature/EASI-1234_add-homepage-animations`, which PRs into `main`
	- `task/EASI-1234_add_login_animation`, which PRs into `feature/EASI-1234_add-homepage-animations`
	- `task/EASI-1234_add_loading_animation`, which PRs into `feature/EASI-1234_add-homepage-animations`
	- `task/EASI-1234_fix_cypress_tests`, which PRs into `feature/EASI-1234_add-homepage-animations`

## Pull Request Conventions

### Title

The title of the pull request should follow this pattern:

- `[type: Issue#] description`. Examples are below
  - `[feature: EASI-1234] Add animations to homepage`
  - `[task: EASI-1234] Add login animation`
  - `[task: EASI-1234] Add loading animation`
  - `[task: EASI-1234] Fix cypress tests`
  - `[EASI-5678] Update governance team list`
  - `[NOREF] Fix failing cypress test`

### Description

We follow a standard template for our pull request descriptions that can be [found here](./.github/PULL_REQUEST_TEMPLATE.md).

You should include the parent issue and child issue number, if appropriate, in the main heading of the description.
