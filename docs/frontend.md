# Frontend Documentation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the CMS EASi frontend application in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests)
or more information.

### `yarn storybook`

Launches the [React Storybook](https://storybook.js.org) setup for the application

### `yarn build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the
best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment)
for more information.

### `yarn eject`

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

## File Structure

All of the frontend React code lives in the `src` directory.

```text
├── src
│   ├── actions                   # Redux action creators
│   ├── components                # Common "EASi specific" React components
│   │   └── shared                # Utility components (e.g. button, spinner)
│   ├── constants                 # Application constants (e.g. Redux action types)
│   ├── reducers                  # Redux reducers
│   ├── sagas                     # Redux sagas
│   ├── services                  # Async actions or API calls
│   ├── types                     # TypeScript interfaces and alias types
│   └── views                     # Page or layout components
│   ├── index.scss                # Entry point for all SCSS files
│   ├── index.tsx                 # Entry point to inject React into HTML
│   ├── store.ts                  # Initialization for Redux store
```

## TypeScript

Here are a few helpful resources that might be helpful to getting onboarded to
using TypeScript with React.

[Learn TypeScript in 50 Minutes - Tutorial for Beginners](https://www.youtube.com/watch?v=WBPrJSw7yQA)
This is video goes over some of the basics of TypeScript. It’s great for those
who enjoy learning by watching videos/tutorials. You might be able to get by at
watching at 1.5 times speed.

[TypeScript and React](https://fettblog.eu/typescript-react/)
This is a primer on using TypeScript with React.

[Redux - Usage with TypeScript](https://redux.js.org/recipes/usage-with-typescript)
This is a link to the official Redux docs. It provides great info on how to
incorporate type checking with Redux.

[TypeScript Patterns](https://medium.com/@martin_hotell/10-typescript-pro-tips-patterns-with-or-without-react-5799488d6680)
This blog post goes over some TypeScript patterns or “best practices” way of
doing things. It touches on plain TypeScript patterns as well as React Specific
patterns.

[Type aliases vs. interfaces in TypeScript-based React apps](https://medium.com/@koss_lebedev/type-aliases-vs-interfaces-in-typescript-based-react-apps-e77c9a1d5fd0)
This link might be helpful in de-mystifying the differences between Type
aliases and interfaces.

[React + TypeScript Cheat sheet](https://github.com/typescript-cheatsheets/react-typescript-cheatsheet)
This repository contains a lot of examples of TypeScript syntax in different
scenarios with React.

[Composing React Components with TypeScript](https://www.pluralsight.com/guides/composing-react-components-with-typescript)
This link has a basic step-by-step example of TypeScript with React. It also
touches upon React patterns such as HOC and render props.

## Testing

### End-to-End Testing (Cypress)

Currently, Cypress tests are written in JavaScript. The benefit in writing these
tests in TypeScript isn't immediately apparent. If the project gravitates toward
writing these tests in TypeScript, there is documentation in supporting that [here](https://www.cypress.io/blog/2019/05/13/code-create-react-app-v3-and-its-cypress-tests-using-typescript/).

### Frontend integration/unit tests

The project is now using [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
 It originally started with Enzyme, and the decision was made to switch to RTL,
 so there may still be tests that have not been converted.
 (See [ADR](https://github.com/CMSgov/easi-app/blob/master/docs/adr/0028-use-react-testing-library.md)
 for reasoning)

### Code coverage

  To view  client test thresholds:
`yarn test:coverage`

To view current Go test coverage, go to Github Actions `server_test`
on the latest master build, and search for "total coverage is."

There are thresholds set such that the build in Github Actions
will fail if minimum code coverage thresholds are not met.
The intention is that as code coverage improves, the thresholds are moved upwards.

To adjust these thresholds for client tests, see the `package.json` file under `"coverageThreshold"`

To adjust the threshold for Go tests, go to `scripts/testsuite`,
and find the variable `goal_percent`.

## React Storybook

This application comes equipped with [React Storybook](https://storybook.js.org).
Storybook allows us to build/document components in isolation and mock out
its usage for design, product, and other stakeholders.

Deployed instance of storybook TBD.

We also use components from [react-uswds](https://github.com/trussworks/react-uswds).
Its deployed storybook can be viewed [here](https://trussworks.github.io/react-uswds/).
