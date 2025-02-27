import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCedarContacts($commonName: String!) {
    cedarPersonsByCommonName(commonName: $commonName) {
      commonName
      email
      euaUserId
    }
  }
`);
