# EASi React Frontend

## Folder Layout

The frontend code is organized into several major subfolders:

- `app` contains the application entry index file and style.  Also include route definitions
- `assets` contains non-image static files used in the site, such as downloadable planning templates.
- `components` contains individual components, each potentially reusable, that don't constitute a full page/screen. Each component will have a folder with the component name, with the component code in `index.tsx`. Each component folder may also contain:
  - `index.scss` - SASS styling for the component.
  - `index.test.tsx` - unit tests for the component.
  - `index.stories.tsx` - setup to make the component available in Storybook.
- `config` contains various application configuration files
- `constants` contains various constant values used throughout the application.
- `data` contains definitions of default React state for some components, as well as helper methods for working with data in React state and Redux reducers.
- `features` contains the application's pages/screens.
- `gql` contains GraphQL queries used to interface with the backend API.
- `hooks` contains custom hooks used for common tasks throughout the application.
- `i18n` contains text used throughout the application that may need to be translatable for internationalization.
- `stores` contains Redux reducer functions for managing frontend application state.
- `sagas` contains Redux sagas for integrating asynchronous actions into the Redux lifecycle.
- `stylesheets` contains SASS stylesheets that are used throughout the application.
- `types` contains TypeScript types for application-wide usage.
- `utils` contains utility functions used repeatedly in the application.
- `validations` contains [`Yup`](https://github.com/jquense/yup) validation functions, used by [`Formik`](https://formik.org/) forms throughout the application.
- `views` contains the application's pages/screens.

## GraphQL

The source of truth for the GraphQL schema is `pkg/graph/schema.graphql`; Apollo Client is configured to reference this, and the Apollo Client VS Code plugin will enable autocomplete when writing queries/mutations for use in the frontend. Each query or mutation should be handwritten in the GraphQL query language in a file in the `src/queries` directory. Running `scripts/dev gql` (or `yarn generate`) will generate TypeScript types from these queries, placing the generated code in `src/gql/generated`. The queries and types can then be used in component code by calling `useQuery()`/`useMutation()` from `@apollo/client`.

For an example, consider the query used for fetching LaunchDarkly info for a currently logged-in user. The GraphQL query for fetching this data is defined in [`src/gql/operations/GetCurrentUserQuery.ts`](`./queries/GetCurrentUserQuery.ts`); the generated types are found in [`src/gql/generated.ts`](`./queries/types/GetCurrentUser.ts`). These are then used in [`src/wrappers/FlagsWrapper/index.tsx`](./views/FlagWrapper/index.tsx):

```
const { data } = useQuery<GetCurrentUser>(GetCurrentUserQuery);
```

which uses the Apollo Client library to fetch `data` from the backend using GraphQL.
