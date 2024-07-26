import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'pkg/graph/schema.graphql',
  documents: ['src/gql/apolloGQL/**/*.ts'],
  overwrite: true,
  generates: {
    './src/gql/gen/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
        {
          // This plugin is used to generate type document query types.  Used when passing a mutation or query to a custom hook
          'typed-document-node': {
            transformUnderscore: false,
            documentVariablePrefix: 'Typed',
            fragmentVariablePrefix: 'Typed'
          }
        }
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
        },
        nonOptionalTypename: true,
        namingConvention: {
          enumValues: 'change-case-all#upperCase#snakeCase'
        }
      }
    }
  }
};
export default config;
