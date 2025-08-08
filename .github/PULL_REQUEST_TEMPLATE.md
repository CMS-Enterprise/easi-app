<!--
REQUIRED
    Ensure that your PR title has the relevant Jira ticket number(s) in the title.
    Follow this pattern: [EASI-1234] [EASI-4567] Title of the PR.
    Use [NOREF] in place of a ticket number when there's no associated Jira ticket.
    The heading below should just have the ticket numbers (for easy linking in Jira)
-->
# EASI-0000

## Description
<!--
REQUIRED
    Provide details as to what the PR aims to accomplish
    Be as descriptive as you can, and include any relevant information that will help the reviewer understand the scope of the changes
    Include screenshots or screen recordings to assist in reviewing if possible.
-->


## How to test this change
<!--
REQUIRED
    Add instructions on how to test the changes in this PR
    This can be a list of steps to reproduce a bug, or a list of steps to verify a feature in the application
    Include any example shell commands or BRUNO requests that reviewers can run to test the changes
-->
1.  

## PR Author Checklist
<!--
REQUIRED
    Ensure that each of the following is true before you submit this PR (or before it leaves "draft" status), and check each box to confirm
-->

- [ ] I have provided a detailed description of the changes in this PR.
- [ ] I have provided clear instructions on how to test the changes in this PR.
- [ ] I have updated tests or written new tests as appropriate in this PR.
- [ ] Updated the [BRUNO Collection](query_examples/EASi) if necessary.


## PR Reviewer Guidelines
<!--
This is just some static content to ensure we're following best practices when reviewing.
There is no need to edit this section.
-->
- It's best to pull the branch locally and test it, rather than just looking at the code online!
- When approving a PR, provide a reason _why_ you're approving it
  - e.g. "Approving because I tested it locally and all functionality works as expected"
  - e.g. "Approving because the change is simple and matches the Figma design"
- Don't be afraid to leave comments or ask questions, especially if you don't understand why something was done! (This is often a great time to suggest code comments or documentation updates)
- Check that all code is adequately covered by tests - if it isn't feel free to suggest the addition of tests.
