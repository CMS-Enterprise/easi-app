# *How should bootstrap the frontend application?*

Which React toolchain should we use to bootstrap CMS EASi?

## Considered Alternatives

* [Create React App](https://github.com/facebook/create-react-app) (CRA)
* Roll up a new application from scratch

## Decision Outcome

Create React App (CRA)

* `+` This is a React toolchain we have experience using
* `+` Do not need to spend time tinkering with configuration
* `+` Provides an [eject](https://create-react-app.dev/docs/available-scripts#npm-run-eject)
command to gain full control of the build tool and configuration choices
* `+` Very well known toolchain that has a lot of tools to support it
(e.g. [craco](https://github.com/gsoft-inc/craco) and [rescripts](https://github.com/harrysolovay/rescripts)
* `-` Do no have full control over configuration files in case we need
customization (e.g. USWDS)
* `-` Ejecting is a one-way operation. Once you eject, you can't go back!
* `-`

## Pros and Cons of the Alternatives

Roll up a new application from scratch

* `+` Complete control over configuration
* `-` Lots of initial work and maintanence over time
* `-` Lots of additional decisions to make on build tools and versions
