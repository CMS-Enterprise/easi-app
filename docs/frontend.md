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

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) or more information.

### `yarn build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the
best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

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

```javascript
├── src
│   ├── actions                   # Redux action creators
│   ├── components                # Common "EASi specific" React components used throughout the application
│   │   └── shared                # Common utility components (e.g. buttons, tables, loading spinner, etc.)
│   ├── constants                 # Application constants (e.g. Redux action types)
│   ├── reducers                  # Redux reducers
│   ├── sagas                     # Redux sagas
│   ├── services                  # Async actions or API calls
│   ├── types                     # Typescript interfaces and alias types
│   └── views                     # Page or layout components
│   ├── index.scss                # Entry point for all SCSS files
│   ├── index.tsx                 # Entry point to inject React into HTML
│   ├── store.ts                  # Initialization for Redux store
```

## Testing

### End-to-End Testing (Cypress)

Currently, Cypress tests are written in Javascript. The benefit in writing these
tests in Typescript isn't immediately apparent. If the project gravitates toward
writing these tests in Typescript, there is documation in supporting that [here](https://www.cypress.io/blog/2019/05/13/code-create-react-app-v3-and-its-cypress-tests-using-typescript/).