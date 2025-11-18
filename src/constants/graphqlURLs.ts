// Pull the graphql address from the vite environment variables
// However, if we don't have a VITE_GRAPHQL_ADDRESS, we should simply assume that the API is hosted on the same domain & port as the frontend
// We also assume a path of /api/graph/query should be tacked onto that
const graphqlAddress =
  import.meta.env.VITE_GRAPHQL_ADDRESS ||
  `${window.location.origin}/api/graph/query`;

export default graphqlAddress;
