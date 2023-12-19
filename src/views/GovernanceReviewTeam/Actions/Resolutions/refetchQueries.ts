import GetSystemIntakesTableQuery from 'queries/GetSystemIntakesTableQuery';

/**
 * Refetches `getSystemIntake` and `getSystemIntakesTable` queries after closing/reopening a request
 */
const refetchQueries = () => [
  'GetSystemIntake',
  {
    query: GetSystemIntakesTableQuery,
    variables: {
      openRequests: true
    }
  },
  {
    query: GetSystemIntakesTableQuery,
    variables: {
      openRequests: false
    }
  }
];

export default refetchQueries;
