import { gql } from '@apollo/client';

export default gql`
  query GetTrbLeadOptions {
    trbLeadOptions {
      euaUserId
      commonName
    }
  }
`;
