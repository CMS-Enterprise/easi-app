# Development Environment Setup

Developers need a Unix-ish environment for local development. This README provides instructions for developing on MacOS and Windows+WSL2 (using Ubuntu).

We recommend using VS Code as the code editor of choice.

In general, the necessary tools are:
- Bash
- A standard C toolchain (notably, a C compiler and `make`)
- Git
- Docker
- Go
- [Go analysis tools](https://github.com/golang/vscode-go/blob/master/docs/tools.md): `gopls`, `dlv`, `dlv-dap`, `gopkgs`, `go-outline`, `goplay`, `gomodifytags`, `impl`, `gotests`, `staticcheck`
- [`goimports`](https://pkg.go.dev/golang.org/x/tools/cmd/goimports) (Used by `scripts/dev gql`)
- Node.js
- Yarn
- Ruby
- [`direnv`](https://direnv.net/)
- [`pre-commit`](https://pre-commit.com/) (Installation requires Python)
- `psql` (Postgres command-line client)

## Basic Prerequisites

**MacOS:** Developers will need [Homebrew](https://brew.sh) to install dependencies, which can be installed with `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`.

**Windows:** Developers will need to install WSL2, set up an Ubuntu distro, then configure VS Code to work with WSL2.
- In Powershell running as admin, run `wsl --install`.
- Reboot your computer to finish WSL installation.
- In a regular Powershell window, run `wsl --set-default-version 2`, then run `wsl --install -d Ubuntu`.
- In VSCode, install the [Remote - WSL extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) (ID: `ms-vscode-remote.remote-sdl`).

For developers on Windows+WSL, this repository should be cloned onto the Ubuntu filesystem. All installation instructions below should be run from within the Ubuntu environment, except for setting up Docker.

When working on the terminal in WSL, you may see the occasional `ERROR: UtilConnectToInteropServer:307` error message. This is caused by [this WSL issue](https://github.com/microsoft/WSL/issues/5065). The easiest fix is to define a Bash function from [this comment](https://github.com/microsoft/WSL/issues/5065#issuecomment-682198412) on that issue, then run that function whenever you see that error.

## Bash

**MacOS:** Developers will need to install the `bash` shell.
- Ensure you are using the latest version of bash for this project:

  - Install it with Homebrew: `brew install bash`
  - Update list of shells that users can choose from:

    ```bash
    [[ $(cat /etc/shells | grep /usr/local/bin/bash) ]] \
    || echo "/usr/local/bin/bash" | sudo tee -a /etc/shells
    ```

  - If you are using bash as your shell (and not zsh, fish, etc) and want to use
    the latest shell as well, then change it (optional):
    `chsh -s /usr/local/bin/bash`
  - Ensure that `/usr/local/bin` comes before `/bin` on your `$PATH` by running
    `echo $PATH`. Modify your path by editing `~/.bashrc` or `~/.bash_profile`
    and changing the `PATH`. Then source your profile with `source ~/.bashrc` or
    `~/.bash_profile` to ensure that your terminal has it.

**Windows+WSL:** Ubuntu set up with WSL already has Bash as its default shell.

## C Toolchain

The Go analysis tools and the frontend package `node-sass` depend on having a basic C toolchain installed.

**MacOS:** Developers should have this installed by default.

**Windows+WSL:** Developers can install this with `sudo apt install build-essential`.

## Git

**MacOS:** `brew install git`

**Windows+WSL:** The default Ubuntu installation should have a recent version of Git installed. To install the latest version of Git, see [the official installation instructions](https://git-scm.com/download/linux).

## Docker (with docker-compose)

**MacOS:**
```console
brew cask install docker
brew install docker-completion docker-compose docker-compose-completion
```
Now you will need to start the Docker service: run Spotlight and type in
"docker", then select "Docker Desktop" in the results.

**Windows+WSL:**
- Install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop).
- Enable WSL2 integration with the installed Ubuntu distro.
  - Open Docker Desktop
  - Click the gear icon to open settings
  - Under Resources -> WSL Integration, enable the switch for "Ubuntu" under the "Enable integration with additional distros" heading.

## Go

**MacOS:**
Install the latest version of Go with `brew install go`.

**Windows+WSL:**
- Download the `.tar.gz` file for the latest version of Go for Linux from [the official Go site](https://golang.org/doc/install), making sure to save it to the Ubuntu filesystem. The easiest way to do this is to copy the download link, then use `wget` to download it on the command line, i.e. `wget https://golang.org/dl/go1.17.3.linux-amd64.tar.gz`. This will download the `.tar.gz` to the current directory.
- From the directory containing the `.tar.gz` file, extract it to `/usr/local/go`, i.e. with `sudo tar -C /usr/local -xzf go1.17.3.linux-amd64.tar.gz`.
- Add `/usr/local/go/bin` to your `PATH`. The easiest way to do this is to add the following to your `~/.bashrc` file:

```bash
export PATH="$PATH:/usr/local/go/bin"
```

## Go tooling

Both MacOS and Windows+WSL developers will need to add the `GOBIN` environment variable (which defaults to `$GOPATH/bin`) to their `PATH`, so tools installed with `go install` can be called from the command line. Add the following to your `~/.bashrc` file:

```bash
export PATH="$PATH:$(go env GOPATH)/bin"
```

## Goimports

The [`goimports`](https://pkg.go.dev/golang.org/x/tools/cmd/goimports) tool is used by `scripts/dev gql` to clean up autogenerated code. To install it, run `go install golang.org/x/tools/cmd/goimports@latest`.

## Node.js/npm

We currently support Node.js v16 for this repo; Node 17 support is currently blocked by [this `create-react-app` issue](https://github.com/facebook/create-react-app/issues/11562). 

The easiest way to install this specific version of Node/npm is to use [`nvm`](https://github.com/nvm-sh/nvm). To install `nvm`, run 
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```
Reload your shell, then run `nvm install 16`.

## Yarn

We use [Yarn](https://yarnpkg.com/) to manage our JavaScript dependencies. It can be installed with `npm install --global yarn`.

## Ruby

**MacOS:** Ruby should be installed by default.

**Windows+WSL:** Install Ruby with `sudo apt install ruby-full`.

(#direnv)
## Direnv

**MacOS:** Install with `brew install direnv`.

**Windows+WSL:** Install with `sudo apt install direnv`.

**All developers:**
- Add the following line at the very end of your `~/.bashrc` file:
  `eval "$(direnv hook bash)"`
  - Refer to [instructions for other shells](https://direnv.net/docs/hook.html) if you're using a shell other than bash.
- Restart your shell.
- To allow direnv in the project directory `direnv allow`.

Once this is setup, you should see `direnv` loading/unloading environment
variables as you enter or depart from the project directory:

```console
$ cd easi-app
direnv: loading ~/Project/easi-app/.envrc
direnv: export +EXAMPLE_ENV +EXAMPLE_ENV_ADDITIONAL +EXAMPLE_ENV_MORE ... ~PATH
$ cd ..
direnv: unloading
$
```

## Setting up pre-commit Git hooks

This repo uses [`pre-commit`](https://pre-commit.com/) to manage pre-commit Git hooks for maintaining several quality and stylistic standards; see [`.pre-commit-config.yaml`](./.pre-commit-config.yaml) for details.

**MacOS:** Install with `brew install pre-commit`.

**Windows+WSL:** 
- First install Python's `pip` package manager with `sudo apt install python3-pip`.
- Then, install `pre-commit` with `pip install pre-commit`. This should install `pre-commit` in the `~/.local/bin` directory.
- Add this directory to your `PATH`. Add the following to `~/.bashrc`:
```bash
export PATH="$PATH:$HOME/.local/bin"
```

**All developers:**
- From the root of this repo, run `pre-commit install` to set up a Git pre-commit hook in `.git/hooks/pre-commit`.
- Then, run `pre-commit install-hooks` to install the environments for this project's specific hooks.

## psql

The Postgres command-line client is needed for running database-related scripting commands, but the database server doesn't need to be installed; it can be handled with Docker.

**MacOS:** Install with `brew install postgres`. This installs the Postgres server as well; if this is an issue, see [this StackOverflow Q&A](https://stackoverflow.com/questions/44654216/correct-way-to-install-psql-without-full-postgres-on-macos) for alternatives.

**Windows+WSL:** Install with `sudo apt install postgresql-client`. 

## Installing frontend dependencies

To install the frontend's dependencies, run `yarn install --frozen-lockfile --ignore-engines`. The `--frozen-lockfile` flag will install the exact versions of all dependencies that are specified in `yarn.lock`; the `--ignore-engines` flag is necessary with Node 16 due to [this `react-uswds` issue](https://github.com/trussworks/react-uswds/issues/1582).

## VSCode-specific tools

**Windows+WSL:** From the Ubuntu command line, navigate to the root of this repository, then run `code .` to open VS Code with this repository opened.

**All developers:**
- VS Code will recommend installing the extensions specified in [`.vscode/extensions.json`](./.vscode/extensions.json). Install all of them.
- The Go extension should prompt you to install the analysis tools it uses. Install all of them. See [these instructions](https://github.com/golang/vscode-go/blob/master/README.md#tools) for more details.

## Starting the application

With all dependencies installed, you should be able to start the application. See [these instructions](./dev_script_usage.md#starting-the-application) on how to use the development script to run the application locally.