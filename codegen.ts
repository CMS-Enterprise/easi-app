import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'pkg/graph/schema.graphql',
  documents: ['src/gql/apolloGQL/**/*.ts'],
  generates: {
    './src/gql/gen/graphql.ts': {
      // preset: 'client',
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo'
      ],
      config: {
        withHooks: true,
        scalars: {
          // old codegen mappings from global.d.ts
          // maintain until we add better scalar mapping with graphql-codegen
          //
          // These currently just need to map to aliased types there
          // Hopefully in the future we can use custom/useful types!
          Time: 'Time',
          UUID: 'UUID',
          Upload: 'Upload',
          EmailAddress: 'EmailAddress',
          HTML: 'HTML'
        }
      }
    }
  }
};
export default config;
