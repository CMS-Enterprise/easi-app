const glob = require('glob');

const allGraphQLFiles = glob.sync('pkg/graph/schema/**/*.graphql');

module.exports = {
  client: {
    service: {
      name: 'easi-app',
      localSchemaFile: allGraphQLFiles
    },
    includes: [
      './src/gql/operations/**/*.ts' // new queries (graphql-codegen)
    ]
  }
};
