import { gql } from '@apollo/client';

export default gql`
  query GetCedarContacts($commonName: String!) {
    cedarPersonsByCommonName(commonName: $commonName) {
      commonName
      email
      euaUserId
    }
  }
`;
