module.exports = {
  client: {
    service: {
      name: 'easi-app',
      localSchemaFile: './pkg/graph/schema.graphql'
    },
    includes: [
      './src/gql/operations/**/*.ts' // new queries (graphql-codegen)
    ]
  }
};
