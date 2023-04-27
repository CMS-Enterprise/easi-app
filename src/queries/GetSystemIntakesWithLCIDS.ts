import { gql } from '@apollo/client';

export default gql`
  query GetSystemIntakesWithLCIDS {
    systemIntakesWithLcids {
      id
      lcid
      requestName
    }
  }
`;
