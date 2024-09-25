module.exports = {
  client: {
    service: {
      name: 'easi-app',
      localSchemaFile: './pkg/graph/schema.graphql'
    },
    includes: [
      './src/queries/**/*.ts', // old queries (apollo-client-codegen)
      './src/gql/apolloGQL/**/*.ts' // new queries (graphql-codegen)
    ]
  }
};
