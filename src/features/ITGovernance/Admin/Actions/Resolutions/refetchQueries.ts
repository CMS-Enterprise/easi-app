import { GetSystemIntakesTableDocument } from 'gql/generated/graphql';

/**
 * Refetches `getSystemIntake` and `getSystemIntakesTable` queries after closing/reopening a request
 */
const refetchQueries = () => [
  'GetSystemIntake',
  {
    query: GetSystemIntakesTableDocument,
    variables: {
      openRequests: true
    }
  },
  {
    query: GetSystemIntakesTableDocument,
    variables: {
      openRequests: false
    }
  }
];

export default refetchQueries;
