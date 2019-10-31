# CMS EASi Application

This repository contains the application code for the CMS EASi (Easy Access to
System Information).

## Application Setup

<<<<<<< HEAD
### CMS EASi Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

#### Available Scripts

In the project directory, you can run:

#### `yarn start`

Runs the CMS EASi frontend application in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) or more information.

#### `yarn build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the
best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can
`eject` at any time. This command will remove the single build dependency from
your project.

Instead, it will copy all the configuration files and the transitive
dependencies (Webpack, Babel, ESLint, etc) right into your project so you have
full control over them. All of the commands except `eject` will still work, but
they will point to the copied scripts so you can tweak them. At this point
you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for
small and middle deployments, and you shouldn’t feel obligated to use this
feature. However we understand that this tool wouldn’t be useful if you
couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
=======
### Setup: Developer Setup

There are a number of things you'll need at a minimum
to be able to check out,
develop,
and run this project.

* Install [Homebrew](https://brew.sh)
  * Use the following command
    `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
* We normally use the latest version of Go
  unless there's a known conflict
  (which will be announced by the team)
  or if we're in the time period just after a new version has been released.
  * Install it with Homebrew:
    `brew install go`
  * **Note**:
    If you have previously modified your PATH to point to a specific version of go,
    make sure to remove that.
    This would be either in your `.bash_profile` or `.bashrc`,
    and might look something like
    `PATH=$PATH:/usr/local/opt/go@1.12/bin`.
* Ensure you are using the latest version of bash for this project:
  * Install it with Homebrew:
    `brew install bash`
  * Update list of shells that users can choose from:
  
    ```bash
        [[ $(cat /etc/shells | grep /usr/local/bin/bash) ]] \
        || echo "/usr/local/bin/bash" | sudo tee -a /etc/shells
    ```

  * If you are using bash as your shell
    (and not zsh, fish, etc)
    and want to use the latest shell as well,
    then change it (optional): `chsh -s /usr/local/bin/bash`
  * Ensure that `/usr/local/bin` comes before `/bin`
    on your `$PATH` by running `echo $PATH`.
    Modify your path by editing `~/.bashrc` or `~/.bash_profile`
    and changing the `PATH`.
    Then source your profile with `source ~/.bashrc` or `~/.bash_profile`
    to ensure that your terminal has it.

### Setup: Git

Use your work email when making commits to our repositories.
The simplest path to correctness is setting global config:

  ```bash
  git config --global user.email "trussel@truss.works"
  git config --global user.name "Trusty Trussel"
  ```

If you drop the `--global` flag,
these settings will only apply to the current repo.
If you ever re-clone that repo or clone another repo,
you will need to remember to set the local config again.
You won't.
Use the global config. :-)

For web-based Git operations,
GitHub will use your primary email unless you choose
"Keep my email address private".
If you don't want to set your work address as primary,
please [turn on the privacy setting](https://github.com/settings/emails).

Note that with 2-factor-authentication enabled,
in order to push local code to GitHub through HTTPS,
you need to [create a personal access token](https://gist.github.com/ateucher/4634038875263d10fb4817e5ad3d332f)
and use that as your password.

### Setup: Golang

All of Go's tooling expects Go code to be checked out in a specific location.
Please read about [Go workspaces](https://golang.org/doc/code.html#Workspaces)
for a full explanation.
If you just want to get started,
then decide where you want all your go code to live
and configure the GOPATH environment variable accordingly.
For example,
if you want your go code to live at `~/code/go`,
you should add the following like to your `.bash_profile`:

  ```bash
  export GOPATH=~/code/go
  ```

Golang expects the `GOPATH` environment variable to be defined.
If you'd like to use the default location,
then add the following to your `.bash_profile`
or hard code the default value.
This line will set the GOPATH environment variable
to the value of `go env GOPATH`
if it is not already set.

  ```bash
  export GOPATH=${GOPATH:-$(go env GOPATH)}
  ```

**Regardless of where your go code is located**,
you need to add `$GOPATH/bin` to your `PATH`
so that executables installed with the go tooling can be found.
Add the following to your `.bash_profile`:

  ```bash
  export PATH=$(go env GOPATH)/bin:$PATH
  ```

Finally to have these changes applied to your shell,
you must `source` your profile:

  ```bash
  source ~/.bash_profile
  ```

You can confirm that the values exist with:

  ```bash
  env | grep GOPATH
  # Verify the GOPATH is correct
  env | grep PATH
  # Verify the PATH includes your GOPATH bin directory
  ```

### Setup: Project Checkout

You can checkout this repository by running
`git clone git@github.com:cmsgov/easi-app.git`.
Please check out the code in a directory like
`~/Projects/easi-app` and NOT in your `$GOPATH`. As an example:

  ```bash
  mkdir -p ~/Projects
  git clone git@github.com:cmsgov/easi-app.git
  cd easi-app
  ```

You will then find the code at `~/Projects/easi-app`.
You can check the code out anywhere EXCEPT inside your `$GOPATH`.
So this is customization that is up to you.

### Setup: EASi Command Line

The EASi application
and command line utilities
are powered by Go.
To install them,
run `go build -o bin/easi ./cmd/easi`.

Next, follow the steps for [setting up yarn](#yarn).
This is temporary until dependency setup is automated.

You can then access the tool with the `easi` command.

TODO: Need direnv setup
>>>>>>> c0beb1cb3607070e5bdd21d6dd3625b76dbda9b0

### Setup: Yarn (temporary)

Run `brew install yarn` to install yarn.
Run `yarn install` to install dependencies.

This is temporary for setting up pre-commit package,
until we decide how to structure our CLI tools.

### Setup: Pre-Commit

<<<<<<< HEAD
Run `pre-commit install` to install a pre-commit hook into
`./git/hooks/pre-commit`.
This is different than `brew install pre-commit` and must be done so that the
hook will check files you are about to commit to the repository. Next install
the pre-commit hook libraries with `pre-commit install-hooks`.
=======
Run `pre-commit install`
to install a pre-commit hook
into `./git/hooks/pre-commit`.
This is different than `brew install pre-commit`
and must be done
so that the hook will check files
you are about to commit to the repository.
Next install the pre-commit hook libraries
with `pre-commit install-hooks`.

## Testing

Once your developer environment is setup,
you can run tests with the `easi test` command.
>>>>>>> c0beb1cb3607070e5bdd21d6dd3625b76dbda9b0
